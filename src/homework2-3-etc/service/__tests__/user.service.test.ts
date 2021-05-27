import { UserDA } from "../../data-access/user.DA";
import { IUserData, IUserPresentationData } from "../../domain/user.domain";
import { UserService } from "../user.service";
import { IUserService } from "../user.service.models";
import { BaseError } from "../../middleware/utils/baseError";
import * as faker from "faker";

jest.mock("../../data-access/user.DA");

describe("User service", () => {
  let service: IUserService;

  beforeEach(() => {
    service = new UserService(new UserDA());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Add user", () => {
    it.each([
      ["Grover", 46, "PassWord"],
      ["Elmo", 15, "123456"],
      ["Cookie monster", 32, "qwerty"],
    ])(
      "should create new user with login %s and age %s",
      async (login: string, age: number, password: string) => {
        // Arrange
        const userData: IUserData = {
          login,
          age,
          password,
        };

        // Act
        const createdUser: IUserPresentationData = await service.AddUser(
          userData
        );

        // Assert
        expect(createdUser).toMatchObject({
          login: login,
          age: age,
        });
        expect(typeof createdUser.id).toBe("string");
      }
    );
  });

  describe("Update user", () => {
    it("should update user's login and age", async () => {
      // Arrange
      const initialUserData: IUserData = {
        login: faker.name.findName(),
        age: faker.datatype.number(70),
        password: faker.datatype.string(10),
      };

      const UPDATED_USER_LOGIN = faker.name.findName();
      const UPDATED_USER_AGE = faker.datatype.number(70);

      const updatedUserData: IUserData = {
        login: UPDATED_USER_LOGIN,
        age: UPDATED_USER_AGE,
        password: faker.datatype.string(10),
      };

      const createdUser: IUserPresentationData = await service.AddUser(
        initialUserData
      );

      // Act
      const updatedUser: IUserPresentationData = await service.UpdateUser({
        id: createdUser.id,
        data: updatedUserData,
      });

      // Assert
      expect(updatedUser).toMatchObject({
        login: UPDATED_USER_LOGIN,
        age: UPDATED_USER_AGE,
      });
      expect(updatedUser.id).toBe(createdUser.id);
    });

    it("should throw while attempt to update nonexistent user", async () => {
      // Arrange
      const updatedUserData: IUserData = {
        login: faker.name.findName(),
        age: faker.datatype.number(70),
        password: faker.datatype.string(10),
      };

      const RANDOM_USER_ID = faker.datatype.uuid();

      // Act
      try {
        await service.UpdateUser({
          id: RANDOM_USER_ID,
          data: updatedUserData,
        });
      } catch (err) {
        const error = err as BaseError;

        // Assert
        expect(error.message).toBe(`User with id ${RANDOM_USER_ID} not found`);
        expect(error.statusCode).toBe(404);
      }
    });
  });

  describe("Delete user", () => {
    it("should delete created user", async () => {
      // Arrange
      const userData: IUserData = {
        login: faker.name.findName(),
        age: faker.datatype.number(70),
        password: faker.datatype.string(10),
      };

      const createdUser: IUserPresentationData = await service.AddUser(
        userData
      );

      // Act
      const isUserDeleted: boolean = await service.RemoveUser({
        id: createdUser.id,
      });

      // Assert
      expect(isUserDeleted).toBe(true);
    });

    it("should throw while attempt to get deleted user", async () => {
      // Arrange
      const userData: IUserData = {
        login: faker.name.findName(),
        age: faker.datatype.number(70),
        password: faker.datatype.string(10),
      };

      const createdUser: IUserPresentationData = await service.AddUser(
        userData
      );

      await service.RemoveUser({
        id: createdUser.id,
      });

      // Act
      try {
        await service.GetUser({
          id: createdUser.id,
        });
      } catch (err) {
        const error = err as BaseError;

        // Assert
        expect(error.message).toBe(`User with id ${createdUser.id} not found`);
        expect(error.statusCode).toBe(404);
      }
    });
  });

  describe("Get user", () => {
    it("should return existent user", async () => {
      // Arrange
      const USER_LOGIN = faker.name.findName();
      const USER_AGE = faker.datatype.number(70);
      const USER_PASSWORD = faker.datatype.string(10);

      const userData: IUserData = {
        login: USER_LOGIN,
        age: USER_AGE,
        password: USER_PASSWORD,
      };

      const createdUser: IUserPresentationData = await service.AddUser(
        userData
      );

      // Act
      const foundUser: IUserPresentationData = await service.GetUser({
        id: createdUser.id,
      });

      // Assert
      expect(foundUser).toMatchObject({
        login: USER_LOGIN,
        age: USER_AGE,
      });
      expect(foundUser).not.toMatchObject({ password: USER_PASSWORD });
      expect(foundUser.id).toBe(createdUser.id);
    });

    it("should throw while attempt to get nonexistent user", async () => {
      // Arrange
      const RANDOM_USER_ID = faker.datatype.uuid();

      // Act
      try {
        await service.GetUser({
          id: RANDOM_USER_ID,
        });
      } catch (err) {
        const error = err as BaseError;

        // Assert
        expect(error.message).toBe(`User with id ${RANDOM_USER_ID} not found`);
        expect(error.statusCode).toBe(404);
      }
    });
  });

  describe("Get users", () => {
    it("should return correct amount of users", async () => {
      // Arrange
      const USERS_COUNT = 5;
      const USER_LOGIN_SUBSTRING = faker.datatype.string(5);

      for (let i = 1; i <= USERS_COUNT; i++) {
        const userData: IUserData = {
          login: `${USER_LOGIN_SUBSTRING}${i}`,
          age: faker.datatype.number(70),
          password: faker.datatype.string(10),
        };

        await service.AddUser(userData);
      }

      // Act
      const users: IUserPresentationData[] = await service.GetUsers({
        limit: USERS_COUNT,
        loginSubstring: USER_LOGIN_SUBSTRING,
      });

      // Assert
      expect(users.length).toBe(USERS_COUNT);
    });

    it("should return empty array when users are not found", async () => {
      // Arrange
      const USERS_COUNT = 5;
      const USER_LOGIN_SUBSTRING = faker.datatype.string(5);

      // Act
      const users: IUserPresentationData[] = await service.GetUsers({
        limit: USERS_COUNT,
        loginSubstring: USER_LOGIN_SUBSTRING,
      });

      // Assert
      expect(users.length).toBe(0);
    });
  });
});
