import { User } from "../models/user.model";

export const initUserTable = async (): Promise<void> => {
  await User.findOrCreate({
    where: { login: "Elmo" },
    defaults: {
      login: "Elmo",
      password: "1234qwe",
      age: 12,
      isDeleted: false,
    },
  });
  await User.findOrCreate({
    where: { login: "Kermit the Frog" },
    defaults: {
      login: "Kermit the Frog",
      password: "1234qweRty",
      age: 18,
      isDeleted: false,
    },
  });
  await User.findOrCreate({
    where: { login: "Zeleboba" },
    defaults: {
      login: "Zeleboba",
      password: "1qaz!QAZ",
      age: 46,
      isDeleted: false,
    },
  });
};
