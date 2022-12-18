import { DataSource } from "typeorm";
import { dbConfig } from "../config";
import { User } from "../api/modules/users/entity";
import { Conversation } from "../api/modules/conversations/entity";
import { Message } from "../api/modules/messages/entity";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: dbConfig.DB_HOST,
  port: 3306,
  username: dbConfig.DB_USER,
  password: dbConfig.DB_PASS,
  database: dbConfig.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [User, Conversation, Message],
  migrations: [],
  subscribers: [],
});