import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { ConversationDocument } from "./types";

@Entity({ name: "conversation" })
export class Conversation implements ConversationDocument {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  type: string;
}