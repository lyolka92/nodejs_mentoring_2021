import dotenv from "dotenv";
import express from "express";
import { GroupController } from "./controllers/group.controller";
import { UserController } from "./controllers/user.controller";
import {
  clientErrorHandler,
  errorHandler,
  logErrors,
  unknownRouteHandler,
} from "./middleware";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/users", UserController);
app.use("/groups", GroupController);

app.use(unknownRouteHandler);
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
