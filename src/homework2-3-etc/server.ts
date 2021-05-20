import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { AuthController } from "./controllers/auth.controller";
import { GroupController } from "./controllers/group.controller";
import { UserController } from "./controllers/user.controller";
import { errorMiddleware } from "./middleware/error.middleware";
import { uncaughtExceptionMiddleware } from "./middleware/uncaughtException.middleware";
import { unhandledRejectionMiddleware } from "./middleware/unhandledRejection.middleware";
import { logger, loggerMiddleware } from "./middleware/utils/logger";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const corsOptions: cors.CorsOptions = {
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "X-Access-Token",
  ],
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(loggerMiddleware);

app.use("/authenticate", AuthController);
app.use("/users", UserController);
app.use("/groups", GroupController);

process.on("unhandledRejection", unhandledRejectionMiddleware);
process.on("uncaughtException", uncaughtExceptionMiddleware);
app.use(errorMiddleware);

app.listen(PORT, () => {
  logger.info(
    `✨ Server is started and running on http://${process.env.HOST}:${PORT}`
  );
});
