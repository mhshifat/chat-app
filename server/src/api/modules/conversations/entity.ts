import { DataTypes, Model, UUID, UUIDV4 } from "sequelize";
import { ConversationDocument } from "./types";
import { sequelize } from "../../../loaders/database"

export const Conversation = sequelize.define<Model<ConversationDocument>>("conversation", {
  id: {
    primaryKey: true,
    type: UUID,
    defaultValue: UUIDV4
  },
  type: DataTypes.STRING,
});
