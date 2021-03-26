import dotenv from "dotenv";
import express from "express";
import {
  clientErrorHandler,
  errorHandler,
  logErrors,
  unknownRouteHandler,
} from "./middleware";
import { UserController } from "./routes/user.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/users", UserController);

app.use(unknownRouteHandler);
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
