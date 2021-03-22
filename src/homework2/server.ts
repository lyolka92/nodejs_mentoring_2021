import express from "express";
import dotenv from "dotenv";

import { UserDA } from "./DA";
import { UserService } from "./service";
import { UserRouter } from "./routes";

dotenv.config();

const app = express();
const router = express.Router();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", router);

UserRouter(router, new UserService(new UserDA()));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
