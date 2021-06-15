import { IUserCredentials } from "../domain/auth.domain";

export interface IAuthService {
  AuthenticateUser: (credentials: IUserCredentials) => Promise<string>;
}
