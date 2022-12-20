import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { UserDocument } from "./types";

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
}
