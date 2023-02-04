import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "../users/entity";
import { Message } from './../messages/entity';

@Entity({ name: "conversations" })
export class Conversation extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  type: string;

  @Column({ nullable: true })
  name?: string;

  @ManyToOne(() => User, user => user.conversations)
  @JoinColumn()
  creator: User;

  @OneToMany(() => Message, message => message.conversation)
  @JoinColumn()
  messages: Message[];

  @ManyToMany(() => User)
  @JoinTable()
  users: User[]

  @OneToOne(() => Message)
  @JoinColumn()
  lastMessageSent: Message

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @OneToMany(() => User, user => user.conversation)
  @JoinColumn()
  banned_users: User[];
}