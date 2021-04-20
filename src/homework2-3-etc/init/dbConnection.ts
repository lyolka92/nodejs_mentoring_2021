import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

export const seq = new Sequelize({
  username: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  dialect: "postgres",
});

seq
  .authenticate()
  .then(() => console.log("✅  Connected to database"))
  .catch((err) => console.error("⛔️  Database connection error", err));
