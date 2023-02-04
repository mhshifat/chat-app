import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { UserDocument } from "./types";
import { Conversation } from "../conversations/entity";
import { Message } from "../messages/entity";

@Entity({ name: "users" })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  email: string;

  @Column()
  password?: string;

  @OneToMany(() => Conversation, conversation => conversation.creator)
  conversations: Conversation[];

  @OneToMany(() => Message, msg => msg.writter)
  messages: Message[];

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @ManyToOne(() => Conversation, conversation => conversation.banned_users)
  @JoinColumn()
  conversation: Conversation;
}
