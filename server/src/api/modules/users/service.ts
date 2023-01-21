import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "./entity"
import { JwtPayload, LoginBody, RegisterBody, UserDocument } from "./types";
import { HttpError } from "../../../utils/errors";
import { appConfig } from "../../../config";
import { FindOptionsWhere } from "typeorm";

export const UserService = {
  async findAll(query: FindOptionsWhere<User>) {
    return User.find({ where: query });
  },
  async searchUsers(query: string) {
    return User
      .createQueryBuilder("user")
      .where("user.email LIKE :query", { query: `%${query}%` })
      .getMany();
  },
  async findAndThrowError(query: FindOptionsWhere<User>) {
    const doc = await User.findOne({ where: query });
    if (!doc) throw new HttpError(404, "User not found!");
    return doc;
  },
  async findOne(query: FindOptionsWhere<User>) {
    const doc = await User.findOne({ where: query });
    return doc;
  },
  async registerUser(user: RegisterBody) {
    const doc = await User.findOne({ where: { email: user.email } });
    if (doc) throw new HttpError(409, "User already exist!");
    const hashPass = await bcrypt.hash(user.password, 10);
    const newUser = User.create({
      ...user,
      password: hashPass
    });
    await newUser.save();
    const payload: JwtPayload = { id: newUser.id! }
    const token = jwt.sign(payload, appConfig.jwtSecret);
    delete newUser.password;
    return { token, user: newUser }
  },
  async loginUser(user: LoginBody) {
    const doc = await User.findOne({ where: { email: user.email } });
    if (!doc) throw new HttpError(400, "Invalid request!");
    const isPwdMatched = await bcrypt.compare(user.password, doc.password!);
    if (!isPwdMatched) throw new HttpError(400, "Invalid request!");
    const payload: JwtPayload = { id: doc.id! }
    const token = jwt.sign(payload, appConfig.jwtSecret);
    delete doc.password;
    return { token, user: doc }
  },
}