import { DataTypes, Model, UUID, UUIDV4 } from "sequelize";
import { UserDocument } from "./types";
import { sequelize } from "../../../loaders/database"

export const User = sequelize.define<Model<UserDocument>>("user", {
  id: {
    primaryKey: true,
    type: UUID,
    defaultValue: UUIDV4
  },
  first_name: DataTypes.STRING,
  last_name: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
});
