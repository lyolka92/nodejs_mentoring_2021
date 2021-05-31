import dotenv from "dotenv";
import * as jwt from "jsonwebtoken";
import { UserDA } from "../data-access/user.DA";
import { IUserCredentials } from "../domain/auth.domain";
import { BaseError } from "../middleware/utils/baseError";

dotenv.config();

export class AuthService {
  constructor(private userDA: UserDA) {}

  public async AuthenticateUser({
    login,
    password,
  }: IUserCredentials): Promise<string | void> {
    const user = await this.userDA.getUserByLogin(login);

    if (user.password !== password) {
      throw new BaseError("Bad login/password combination", 401);
    } else {
      const payload = { sub: user.id };
      return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: 100,
      });
    }
  }
}
