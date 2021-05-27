import * as faker from "faker";
import { EPermission, IGroup, IGroupData } from "../../domain/group.domain";
import { App } from "../../app";
import { Controller } from "../models";
import { GroupController } from "../group.controller";
import dotenv from "dotenv";
import express from "express";
import supertest from "supertest";

jest.mock("../../service/group.service");
dotenv.config();

describe("Group controller", () => {
  let groupController: Controller;
  let app: App;
  let server: express.Application;

  beforeEach(() => {
    groupController = new GroupController(false);
    app = new App([groupController], false, "3002");
    server = app.getServer();
  });

  afterEach(() => {
    app.stopServer();
    jest.clearAllMocks();
  });

  describe("GET /groups", () => {
    it("should return 200 on correct request", (done) => {
      // Act
      supertest(server)
        .get(groupController.path)
        .set({ "x-access-token": process.env.UNIT_TEST_JWT_TOKEN })
        // Assert
        .expect(200)
        .end(done);
    });
  });

  describe("GET /groups/:id", () => {
    it("should return 200 on get existent group", (done) => {
      // Arrange
      const groupData: IGroupData = {
        name: faker.hacker.noun(),
        permissions: [EPermission.READ],
      };

      supertest(server)
        .post(groupController.path)
        .set({ "x-access-token": process.env.UNIT_TEST_JWT_TOKEN })
        .send(groupData)
        .then((res) => {
          const group: IGroup = res.body;
          // Act
          supertest(server)
            .get(`${groupController.path}/${group.id}`)
            .set({ "x-access-token": process.env.UNIT_TEST_JWT_TOKEN })
            // Assert
            .expect(200)
            .end(done);
        });
    });

    it("should return 404 on get nonexistent group", (done) => {
      // Arrange
      const RANDOM_GROUP_ID = faker.datatype.uuid();

      // Act
      supertest(server)
        .get(`${groupController.path}/${RANDOM_GROUP_ID}`)
        .set({ "x-access-token": process.env.UNIT_TEST_JWT_TOKEN })
        // Assert
        .expect(404)
        .end(done);
    });
  });

  describe("POST /groups", () => {
    it("should return 200 after successfully create group", (done) => {
      // Arrange
      const groupData: IGroupData = {
        name: faker.hacker.noun(),
        permissions: [EPermission.READ],
      };

      // Act
      supertest(server)
        .post(groupController.path)
        .set({ "x-access-token": process.env.UNIT_TEST_JWT_TOKEN })
        .send(groupData)
        // Assert
        .expect(200)
        .end(done);
    });
  });

  describe("POST /groups/:id/users", () => {
    it("should return 200 after successfully add users to existing group", (done) => {
      // Arrange
      const groupData: IGroupData = {
        name: faker.hacker.noun(),
        permissions: [EPermission.READ],
      };

      const userIds = {
        ids: [faker.datatype.uuid(), faker.datatype.uuid()],
      };

      supertest(server)
        .post(groupController.path)
        .set({ "x-access-token": process.env.UNIT_TEST_JWT_TOKEN })
        .send(groupData)
        .then((res) => {
          const group: IGroup = res.body;
          // Act
          supertest(server)
            .post(`${groupController.path}/${group.id}/users`)
            .set({ "x-access-token": process.env.UNIT_TEST_JWT_TOKEN })
            .send(userIds)
            // Assert
            .expect(200)
            .end(done);
        });
    });
  });

  describe("PUT /groups/:id", () => {
    it("should return 200 after successfully update group", (done) => {
      // Arrange
      const groupData: IGroupData = {
        name: faker.hacker.noun(),
        permissions: [EPermission.READ],
      };

      const groupDataUpdate: IGroupData = {
        name: faker.hacker.noun(),
        permissions: [EPermission.READ, EPermission.SHARE],
      };

      supertest(server)
        .post(groupController.path)
        .set({ "x-access-token": process.env.UNIT_TEST_JWT_TOKEN })
        .send(groupData)
        .then((res) => {
          const group: IGroup = res.body;
          // Act
          supertest(app.getServer())
            .put(`${groupController.path}/${group.id}`)
            .set({ "x-access-token": process.env.UNIT_TEST_JWT_TOKEN })
            .send(groupDataUpdate)
            // Assert
            .expect(200)
            .end(done);
        });
    });
  });

  describe("DELETE /groups/:id", () => {
    it("should return 200 after successfully delete group", (done) => {
      // Arrange
      const groupData: IGroupData = {
        name: faker.hacker.noun(),
        permissions: [EPermission.READ],
      };

      supertest(server)
        .post(groupController.path)
        .set({ "x-access-token": process.env.UNIT_TEST_JWT_TOKEN })
        .send(groupData)
        .then((res) => {
          const group: IGroup = res.body;
          // Act
          supertest(server)
            .delete(`${groupController.path}/${group.id}`)
            .set({ "x-access-token": process.env.UNIT_TEST_JWT_TOKEN })
            // Assert
            .expect(200)
            .end(done);
        });
    });

    it("should return 404 after attempt to delete nonexistent group", (done) => {
      // Arrange
      const RANDOM_GROUP_ID = faker.datatype.uuid();

      // Act
      supertest(server)
        .delete(`${groupController.path}/${RANDOM_GROUP_ID}`)
        .set({ "x-access-token": process.env.UNIT_TEST_JWT_TOKEN })
        // Assert
        .expect(404)
        .end(done);
    });
  });
});
