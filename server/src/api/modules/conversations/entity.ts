import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { ConversationDocument } from "./types";

@Entity({ name: "conversation" })
export class Conversation extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  type: string;
}