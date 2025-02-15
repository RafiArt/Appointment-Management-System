import { DataSource } from "typeorm";
import { User } from "../models/User";
import { Appointment } from "../models/Appointment";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "Lasmojo123",
  database: process.env.DB_NAME || "appointment_db",
  synchronize: true,
  logging: true,
  entities: [User, Appointment],
  subscribers: [],
  migrations: [],
});