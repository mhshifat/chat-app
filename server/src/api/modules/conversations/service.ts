import { Conversation } from "./entity"
import { ConversationBody } from "./types";
import { HttpError } from "../../../utils/errors";
import { FindOptionsWhere, In } from "typeorm";
import { UserService } from "../users/service";
import { UserDocument } from "../users/types";
import { MessageService } from "../messages/service";
import { arrayEquals } from './../../../utils/helpers';

export const ConversationService = {
  async findAll() {
    return Conversation.find();
  },
  async findAndThrowError(query: FindOptionsWhere<Conversation>) {
    const doc = await Conversation.findOne({ where: query });
    if (!doc) throw new HttpError(404, "Conversation not found!");
    return doc;
  },
  async findOne(query: FindOptionsWhere<Conversation>) {
    const doc = await Conversation.findOne({ where: query });
    return doc;
  },
  async findOneWithError(query: FindOptionsWhere<Conversation>) {
    const doc = await Conversation.findOne({ where: query, relations: { creator: true, users: true } });
    if (!doc) throw new HttpError(404, "Conversation not found!");
    return doc;
  },
  async findConversationWhereAuthUserBelongsTo(conversationId: number, authUserId: number) {
    const docs = await Conversation
      .createQueryBuilder("conversation")
      .leftJoinAndSelect("conversation.users", "users")
      .select("conversation.id", "conversationId")
      .where("conversation.id = :conversationId", { conversationId })
      .andWhere("users.id IN (:...ids)", { ids: [authUserId] })
      .select("conversation", "conversation")
      .leftJoinAndSelect("conversation.creator", "creator")
      .getMany();
    return docs;
  },
  async getAuthUserConversations(query: FindOptionsWhere<Conversation>, authUser: UserDocument) {
    const docs = await Conversation
      .createQueryBuilder("conversation")
      .leftJoinAndSelect("conversation.users", "allUsers")
      .where("allUsers.id = :authUserId", { authUserId: authUser.id })
      .leftJoinAndSelect("conversation.creator", "creator")
      .leftJoinAndSelect("conversation.lastMessageSent", "lastMessageSent")
      .leftJoinAndSelect("conversation.users", "users")
      .getMany();
    return docs;
  },
  async createPrivateConversation(body: ConversationBody, user: UserDocument) {
    const emails = body.email.split(",");
    if (emails.includes(user.email)) throw new HttpError(400, "Can't create a conversation with you!");
    const receipients = await UserService.findAll({ email: In(emails) });
    const listIds = receipients.map(re => re.id).concat(user.id!);
    if (!receipients.length || receipients.length !== emails.length) throw new HttpError(404, "User(s) not found!");
    const conversation = await Conversation
      .createQueryBuilder("conversation")
      .leftJoinAndSelect("conversation.users", "users")
      .select("conversation.id", "conversationId")
      .where("conversation.type = :type", { type: "private" })
      .andWhere("users.id in (:...ids)", { ids: listIds })
      .groupBy("conversation.id")
      .having("count(users.id) = :count", { count: listIds.length })
      .getRawMany();
      
    if (conversation.length) throw new HttpError(400, "Could not create the conversation!");
    const newConversation = Conversation.create({
      type: body.type,
      creator: user,
      name: body.name,
      users: [user, ...receipients]
    });
    await newConversation.save()
    const newMessage = await MessageService.createMessage({
      conversationId: newConversation.id,
      message: body.message,
      writter: user
    });
    newConversation.lastMessageSent = newMessage;
    await newConversation.save();
    return newConversation;
  },
}