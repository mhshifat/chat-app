import { Conversation } from "./entity"
import { AddParticipentToConversation, ConversationBody } from "./types";
import { HttpError } from "../../../utils/errors";
import { FindOptionsWhere, In } from "typeorm";
import { UserService } from "../users/service";
import { UserDocument } from "../users/types";
import { MessageService } from "../messages/service";
import { arrayEquals, isDeepEqual } from './../../../utils/helpers';

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
      .leftJoinAndSelect("conversation.lastMessageSent", "lastMessageSent")
      .leftJoinAndSelect("conversation.users", "allUsers")
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
    
    if (body.type === "private") {
      const conversation = await Conversation
        .createQueryBuilder("conversation")
        .where("conversation.type = 'private'")
        .leftJoinAndSelect("conversation.users", "user")
        .andWhere("user.id IN (:...users)", { users: receipients.map(u => +u.id) })
        .groupBy("conversation.id")
        .having("COUNT(user.id) = 1")
        .getOne();
      
      if (conversation) throw new HttpError(400, "Conversation already exists!")
    } else if (body.type === "group") {
      const conversation = await Conversation.findOne({ where: { name: body.name, type: "group" } });
      if (conversation) throw new HttpError(400, "Conversation already exists!")
    }
    
    const newConversation = Conversation.create({
      type: body.type,
      creator: user,
      name: body.name,
      users: [user, ...receipients]
    });
    await newConversation.save()
    const { message: newMessage } = await MessageService.createMessage({
      conversationId: newConversation.id,
      message: body.message,
      writter: user
    });
    newConversation.lastMessageSent = newMessage;
    await newConversation.save();
    return newConversation;
  },
  async addParticipentToConversation(body: AddParticipentToConversation, user: UserDocument) {
    const conversation = await Conversation
      .createQueryBuilder("conversation")
      .leftJoinAndSelect("conversation.creator", "creator")
      .leftJoinAndSelect("conversation.lastMessageSent", "lastMessageSent")
      .leftJoinAndSelect("conversation.users", "user")
      .where("conversation.id = :conversationId AND conversation.type = :conversationType AND creator.id = :creatorId", {
        conversationId: body.conversationId,
        conversationType: "group",
        creatorId: user.id
      })
      .getOne();
    if (!conversation) throw new HttpError(400, "Could not add the participent to the conversation!");
    if (conversation.users.find(u => String(u.id) === String(body.participentId))) throw new HttpError(400, "User already added to the group!");
    const participent = await UserService.findAndThrowError({ id: body.participentId });
    conversation.users.push(participent);
    await conversation.save();
    return conversation;
  },
}