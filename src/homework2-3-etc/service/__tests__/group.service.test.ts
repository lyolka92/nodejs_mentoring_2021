import { GroupService } from "../group.service";
import { IGroupService } from "../group.service.models";
import { GroupDA } from "../../data-access/group.DA";
import { EPermission, IGroup, IGroupData } from "../../domain/group.domain";
import * as faker from "faker";
import { BaseError } from "../../middleware/utils/baseError";

jest.mock("../../data-access/group.DA");

describe("Group service", () => {
  let service: IGroupService;

  beforeEach(() => {
    service = new GroupService(new GroupDA());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Add group", () => {
    it.each([
      ["Students", [EPermission.READ]],
      [
        "Teachers",
        [
          EPermission.READ,
          EPermission.WRITE,
          EPermission.SHARE,
          EPermission.UPLOAD_FILES,
        ],
      ],
      [
        "Gods",
        [
          EPermission.READ,
          EPermission.WRITE,
          EPermission.SHARE,
          EPermission.UPLOAD_FILES,
          EPermission.DELETE,
        ],
      ],
    ])(
      "should create new group with name %s and permissions %s",
      async (name: string, permissions: EPermission[]) => {
        // Arrange
        const groupData: IGroupData = {
          name,
          permissions,
        };

        // Act
        const createdGroup: IGroup = await service.AddGroup(groupData);

        // Assert
        expect(createdGroup).toMatchObject(groupData);
        expect(typeof createdGroup.id).toBe("string");
      }
    );
  });

  describe("Add users to group", () => {
    it("should add users to existent group", async () => {
      // Arrange
      const groupData = {
        name: faker.hacker.noun(),
        permissions: [EPermission.READ, EPermission.SHARE],
      };
      const userIds = [faker.datatype.uuid(), faker.datatype.uuid()];

      const createdGroup = await service.AddGroup(groupData);

      // Act
      const groupWithUsers = await service.AddUsersToGroup({
        groupId: createdGroup.id,
        userIds,
      });

      // Assert
      expect(groupWithUsers).toMatchObject({
        ...createdGroup,
        groupUsers: userIds,
      });
    });

    it("should throw while attempt to add users to nonexistent group", async () => {
      // Arrange
      const RANDOM_GROUP_ID = faker.datatype.uuid();
      const userIds = [faker.datatype.uuid(), faker.datatype.uuid()];

      // Act
      try {
        await service.AddUsersToGroup({
          groupId: RANDOM_GROUP_ID,
          userIds,
        });
      } catch (err) {
        const error = err as BaseError;

        // Assert
        expect(error.message).toBe(
          `Group with id ${RANDOM_GROUP_ID} not found`
        );
        expect(error.statusCode).toBe(404);
      }
    });
  });

  describe("Get group", () => {
    it("should return existent group", async () => {
      // Arrange
      const groupData = {
        name: faker.hacker.noun(),
        permissions: [EPermission.READ, EPermission.SHARE],
      };

      const createdGroup = await service.AddGroup(groupData);

      // Act
      const group = await service.GetGroup({
        id: createdGroup.id,
      });

      // Assert
      expect(group).toMatchObject(groupData);
    });

    it("should throw while attempt to get nonexistent group", async () => {
      // Arrange
      const RANDOM_GROUP_ID = faker.datatype.uuid();

      // Act
      try {
        await service.GetGroup({
          id: RANDOM_GROUP_ID,
        });
      } catch (err) {
        const error = err as BaseError;

        // Assert
        expect(error.message).toBe(
          `Group with id ${RANDOM_GROUP_ID} not found`
        );
        expect(error.statusCode).toBe(404);
      }
    });
  });

  describe("Get groups", () => {
    it("should return all existing groups", async () => {
      // Arrange
      const GROUP_COUNT = faker.datatype.number(5);

      for (let i = 1; i <= GROUP_COUNT; i++) {
        const groupData = {
          name: faker.hacker.noun(),
          permissions: [EPermission.READ, EPermission.SHARE],
        };

        await service.AddGroup(groupData);
      }

      // Act
      const allGroups = await service.GetGroups();

      // Assert
      expect(allGroups.length).toBe(GROUP_COUNT);
    });

    it("should return empty array when no groups exist", async () => {
      // Act
      const allGroups = await service.GetGroups();

      // Assert
      expect(allGroups.length).toBe(0);
    });
  });

  describe("Remove group", () => {
    it("should remove existing group", async () => {
      // Arrange
      const groupData = {
        name: faker.hacker.noun(),
        permissions: [EPermission.READ, EPermission.SHARE],
      };

      const createdGroup = await service.AddGroup(groupData);

      // Act
      const isGroupDeleted = await service.RemoveGroup({ id: createdGroup.id });

      // Assert
      expect(isGroupDeleted).toBe(true);
    });

    it("should throw while attempt to remove nonexistent group", async () => {
      // Arrange
      const RANDOM_GROUP_ID = faker.datatype.uuid();

      // Act
      try {
        await service.RemoveGroup({ id: RANDOM_GROUP_ID });
      } catch (err) {
        const error = err as BaseError;

        // Assert
        expect(error.message).toBe(
          `Group with id ${RANDOM_GROUP_ID} not found`
        );
        expect(error.statusCode).toBe(404);
      }
    });
  });

  describe("Update group", () => {
    it("should update existent group", async () => {
      // Arrange
      const groupData: IGroupData = {
        name: faker.hacker.noun(),
        permissions: [EPermission.READ, EPermission.SHARE],
      };

      const groupDataUpdate: IGroupData = {
        name: faker.hacker.noun(),
        permissions: [
          EPermission.READ,
          EPermission.SHARE,
          EPermission.UPLOAD_FILES,
        ],
      };

      const createdGroup: IGroup = await service.AddGroup(groupData);

      // Act
      const updatedGroup: IGroup = await service.UpdateGroup({
        id: createdGroup.id,
        group: groupDataUpdate,
      });

      // Assert
      expect(updatedGroup).toMatchObject(groupDataUpdate);
      expect(updatedGroup.id).toBe(createdGroup.id);
    });

    it("should throw while attempt to update nonexistent group", async () => {
      // Arrange
      const groupData: IGroupData = {
        name: faker.hacker.noun(),
        permissions: [EPermission.READ, EPermission.SHARE],
      };

      const RANDOM_GROUP_ID = faker.datatype.uuid();

      // Act
      try {
        await service.UpdateGroup({
          id: RANDOM_GROUP_ID,
          group: groupData,
        });
      } catch (err) {
        const error = err as BaseError;

        // Assert
        expect(error.message).toBe(
          `Group with id ${RANDOM_GROUP_ID} not found`
        );
        expect(error.statusCode).toBe(404);
      }
    });
  });
});
