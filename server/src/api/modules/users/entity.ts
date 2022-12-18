import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { UserDocument } from "./types";

@Entity({ name: "users" })
export class User implements UserDocument {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  email: string;

  @Column()
  password: string;
}
