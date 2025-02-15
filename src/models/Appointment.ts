import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { User } from "./User";

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column()
  start!: Date;

  @Column()
  end!: Date;

  @ManyToOne(() => User, user => user.appointments)
  creator!: User;

  @ManyToMany(() => User)
  @JoinTable()
  participants!: User[];
}