import dotenv from "dotenv";
import express from "express";
import { GroupController } from "./controllers/group.controller";
import { UserController } from "./controllers/user.controller";
import { errorMiddleware } from "./middleware/error.middleware";
import { uncaughtExceptionMiddleware } from "./middleware/uncaughtException.middleware";
import { unhandledRejectionMiddleware } from "./middleware/unhandledRejection.middleware";
import { logger, requestLogger } from "./middleware/utils/logger";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(requestLogger);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", UserController);
app.use("/groups", GroupController);

process.on("uncaughtException", uncaughtExceptionMiddleware);
process.on("unhandledRejection", unhandledRejectionMiddleware);
app.use(errorMiddleware);

app.listen(PORT, () => {
  logger.info(
    `Server started and running on http://${process.env.HOST}:${PORT}`
  );
});
