// src/config/database.ts
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "../models/User";
import { Appointment } from "../models/Appointment";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: true, 
  logging: false,
  entities: [User, Appointment],
  subscribers: [],
  migrations: [],
});