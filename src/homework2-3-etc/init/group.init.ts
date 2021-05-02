import { EPermission } from "../domain/group.domain";
import { Group } from "../models/group.model";

export const initGroupTable = async (): Promise<void> => {
  await Group.findOrCreate({
    where: { name: "Admins" },
    defaults: {
      name: "Admins",
      permissions: [
        EPermission.READ,
        EPermission.WRITE,
        EPermission.DELETE,
        EPermission.SHARE,
        EPermission.UPLOAD_FILES,
      ],
    },
  });
  await Group.findOrCreate({
    where: { name: "ScrumMasters" },
    defaults: {
      name: "ScrumMasters",
      permissions: [
        EPermission.READ,
        EPermission.WRITE,
        EPermission.SHARE,
        EPermission.UPLOAD_FILES,
      ],
    },
  });
  await Group.findOrCreate({
    where: { name: "Teammates" },
    defaults: {
      name: "Teammates",
      permissions: [EPermission.READ, EPermission.SHARE],
    },
  });
};
