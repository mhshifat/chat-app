import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { MessageDocument } from "./types";
import { Conversation } from './../conversations/entity';
import { User } from "../users/entity";

@Entity({ name: "messages" })
export class Message extends BaseEntity  {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  message: string;

  @ManyToOne(() => Conversation, conversation => conversation.messages)
  @JoinColumn()
  conversation: Conversation;

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @ManyToOne(() => User, user => user.messages)
  @JoinColumn()
  writter: User;
}