import * as faker from "faker";
import { IUserData, IUserPresentationData } from "../../domain/user.domain";
import { App } from "../../app";
import { Controller } from "../models";
import { UserController } from "../user.controller";
import dotenv from "dotenv";
import express from "express";
import supertest from "supertest";

jest.mock("../../service/user.service");
dotenv.config();

describe("User controller", () => {
  let userController: Controller;
  let app: App;
  let server: express.Application;

  beforeEach(() => {
    userController = new UserController(false);
    app = new App([userController], false, "3001");
    server = app.getServer();
  });

  afterEach(() => {
    app.stopServer();
    jest.clearAllMocks();
  });

  describe("GET /users", () => {
    it("should return 200 on correct request", (done) => {
      // Arrange
      const LIMIT = faker.datatype.number(15);
      const LOGIN_SUBSTRING = faker.datatype.string(5);

      // Act
      supertest(server)
        .get(userController.path)
        .query({ limit: LIMIT, loginSubstring: LOGIN_SUBSTRING })
        .set({ "x-access-token": process.env.UNIT_TEST_JWT_TOKEN })
        // Assert
        .expect(200)
        .end(done);
    });

    it("should return 500 on incorrect limit (%s)", (done) => {
      // Arrange
      const LIMIT = "limit";
      const LOGIN_SUBSTRING = faker.datatype.string(5);

      // Act
      supertest(server)
        .get(userController.path)
        .query({ limit: LIMIT, loginSubstring: LOGIN_SUBSTRING })
        .set({ "x-access-token": process.env.UNIT_TEST_JWT_TOKEN })
        // Assert
        .expect(500)
        .end(done);
    });
  });

  describe("GET /users/:id", () => {
    it("should return 200 on get existent user", (done) => {
      // Arrange
      const userData: IUserData = {
        login: faker.internet.userName(),
        age: faker.datatype.number(60) + 4,
        password: "PaSsWorD123",
      };

      // Act
      supertest(server)
        .post(userController.path)
        .set({ "x-access-token": process.env.UNIT_TEST_JWT_TOKEN })
        .send(userData)
        .then((res) => {
          const user: IUserPresentationData = res.body;

          supertest(server)
            .get(`${userController.path}/${user.id}`)
            .set({ "x-access-token": process.env.UNIT_TEST_JWT_TOKEN })
            // Assert
            .expect(200)
            .end(done);
        });
    });

    it("should return 404 on get nonexistent user", (done) => {
      // Arrange
      const RANDOM_USER_ID = faker.datatype.uuid();

      // Act
      supertest(server)
        .get(`${userController.path}/${RANDOM_USER_ID}`)
        .set({ "x-access-token": process.env.UNIT_TEST_JWT_TOKEN })
        // Assert
        .expect(404)
        .end(done);
    });
  });

  describe("POST /users", () => {
    it("should return 200 after successfully create user", (done) => {
      // Arrange
      const userData: IUserData = {
        login: faker.internet.userName(),
        age: faker.datatype.number(60) + 4,
        password: "PaSsWorD123",
      };
      // Act
      supertest(server)
        .post(userController.path)
        .set({ "x-access-token": process.env.UNIT_TEST_JWT_TOKEN })
        .send(userData)
        // Assert
        .expect(200)
        .end(done);
    });

    [
      { age: 2, password: "Correct_password" },
      { age: 22, password: "Инкоррект_password" },
    ].forEach((item) =>
      it("should return 400 after attempt to create user with incorrect data", (done) => {
        // Arrange
        const userData: IUserData = {
          login: faker.internet.userName(),
          age: item.age,
          password: item.password,
        };
        // Act
        supertest(server)
          .post(userController.path)
          .set({ "x-access-token": process.env.UNIT_TEST_JWT_TOKEN })
          .send(userData)
          // Assert
          .expect(400)
          .end(done);
      })
    );
  });

  describe("PUT /users/:id", () => {
    it("should return 200 after successfully update user", (done) => {
      // Arrange
      const userData: IUserData = {
        login: faker.internet.userName(),
        age: faker.datatype.number(60) + 4,
        password: "PaSsWorD123",
      };

      const userDataUpdate: IUserData = {
        login: faker.internet.userName(),
        age: faker.datatype.number(60) + 4,
        password: "PaSsWorD123",
      };

      supertest(server)
        .post(userController.path)
        .set({ "x-access-token": process.env.UNIT_TEST_JWT_TOKEN })
        .send(userData)
        .then((res) => {
          const user: IUserPresentationData = res.body;
          // Act
          supertest(app.getServer())
            .put(`${userController.path}/${user.id}`)
            .set({ "x-access-token": process.env.UNIT_TEST_JWT_TOKEN })
            .send(userDataUpdate)
            // Assert
            .expect(200)
            .end(done);
        });
    });
  });

  describe("DELETE /users/:id", () => {
    it("should return 200 after successfully delete user", (done) => {
      // Arrange
      const userData: IUserData = {
        login: faker.internet.userName(),
        age: faker.datatype.number(60) + 4,
        password: "PaSsWorD123",
      };

      supertest(server)
        .post(userController.path)
        .set({ "x-access-token": process.env.UNIT_TEST_JWT_TOKEN })
        .send(userData)
        .then((res) => {
          const user: IUserPresentationData = res.body;
          // Act
          supertest(server)
            .delete(`${userController.path}/${user.id}`)
            .set({ "x-access-token": process.env.UNIT_TEST_JWT_TOKEN })
            // Assert
            .expect(200)
            .end(done);
        });
    });

    it("should return 404 after attempt to delete nonexistent user", (done) => {
      // Arrange
      const RANDOM_USER_ID = faker.datatype.uuid();

      // Act
      supertest(server)
        .delete(`${userController.path}/${RANDOM_USER_ID}`)
        .set({ "x-access-token": process.env.UNIT_TEST_JWT_TOKEN })
        // Assert
        .expect(404)
        .end(done);
    });
  });
});
