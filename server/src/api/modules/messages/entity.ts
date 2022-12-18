import { DataTypes, Model, UUID, UUIDV4 } from "sequelize";
import { MessageDocument } from "./types";
import { sequelize } from "../../../loaders/database"

export const Message = sequelize.define<Model<MessageDocument>>("message", {
  id: {
    primaryKey: true,
    type: UUID,
    defaultValue: UUIDV4
  },
  message: DataTypes.STRING,
});
