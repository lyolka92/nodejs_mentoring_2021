import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import { logger } from "../middleware/utils/logger";

dotenv.config();

export const seq = new Sequelize({
  username: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  dialect: "postgres",
  logging: false,
});

seq
  .authenticate()
  .then(() => logger.info("🍻Connected to database"))
  .catch((err) => logger.crit("⛔ Database connection error", err));
