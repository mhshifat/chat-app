import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { MessageDocument } from "./types";

@Entity({ name: "messages" })
export class Message extends BaseEntity  {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  message: string;
}