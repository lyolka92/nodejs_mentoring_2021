import dotenv from "dotenv";
import * as jwt from "jsonwebtoken";
import { UserDA } from "../data-access/user.DA";
import { IUserCredentials } from "../domain/auth.domain";
import { BaseError } from "../middleware/utils/baseError";
import { IAuthService } from "./auth.service.models";

dotenv.config();

export class AuthService implements IAuthService {
  constructor(private userDA: UserDA) {}

  public async AuthenticateUser({
    login,
    password,
  }: IUserCredentials): Promise<string> {
    const user = await this.userDA.getUserByLogin(login);

    if (user.password !== password) {
      throw new BaseError("Bad login/password combination", 401);
    } else {
      const userPermissions = new Set();
      user.groups.forEach((group) =>
        group.permissions.forEach((permission) =>
          userPermissions.add(permission)
        )
      );
      const payload = { sub: user.id, permissions: [...userPermissions] };
      return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: 10000,
      });
    }
  }
}
