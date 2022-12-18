import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { MessageDocument } from "./types";

@Entity({ name: "messages" })
export class Message implements MessageDocument {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  message: string;
}