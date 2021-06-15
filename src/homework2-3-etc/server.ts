import { App } from "./app";
import { AuthController } from "./controllers/auth.controller";
import { UserController } from "./controllers/user.controller";
import { GroupController } from "./controllers/group.controller";

new App([new AuthController(), new UserController(), new GroupController()]);
