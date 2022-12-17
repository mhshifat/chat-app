import { FindOptions } from "sequelize";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "./entity"
import { JwtPayload, LoginBody, RegisterBody, UserDocument } from "./types";
import { HttpError } from "../../../utils/errors";
import { appConfig } from "../../../config";

export const UserService = {
  async findAll() {
    return User.findAll();
  },
  async findAndThrowError(query: FindOptions<UserDocument>) {
    const doc = await User.findOne(query);
    if (!doc) throw new HttpError(404, "User not found!");
    return doc;
  },
  async findOne(query: FindOptions<UserDocument>) {
    const doc = await User.findOne(query);
    return doc;
  },
  async registerUser(user: RegisterBody) {
    const doc = await User.findOne({ where: { email: user.email } });
    if (doc) throw new HttpError(409, "User already exist!");
    const hashPass = await bcrypt.hash(user.password, 10);
    const newUser = await User.create({
      ...user,
      password: hashPass
    });
    const userJson = newUser.toJSON();
    const pauload: JwtPayload = { id: userJson.id! }
    const token = jwt.sign(pauload, appConfig.jwtSecret);
    delete userJson.password;
    return { token, user: userJson }
  },
  async loginUser(user: LoginBody) {
    const doc = await User.findOne({ where: { email: user.email } });
    if (!doc) throw new HttpError(400, "Invalid request!");
    const userJson = doc.toJSON();
    const isPwdMatched = await bcrypt.compare(user.password, userJson.password!);
    if (!isPwdMatched) throw new HttpError(400, "Invalid request!");
    const pauload: JwtPayload = { id: userJson.id! }
    const token = jwt.sign(pauload, appConfig.jwtSecret);
    delete userJson.password;
    return { token, user: userJson }
  },
}