import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Appointment } from "./Appointment";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  username!: string;

  @Column({ name: "preferred_timezone" })
  preferredTimezone!: string;

  @OneToMany(() => Appointment, appointment => appointment.creator)
  appointments!: Appointment[];
}