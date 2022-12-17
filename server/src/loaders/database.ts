import { Sequelize } from "sequelize";
import { dbConfig } from "../config";

export async function connectDatabase() {
  const sequelize = new Sequelize(dbConfig.DB_NAME, dbConfig.DB_USER, dbConfig.DB_PASS, {
    host: dbConfig.DB_HOST,
    dialect: "mysql",
    logging: false
  });

  return sequelize.sync()
}