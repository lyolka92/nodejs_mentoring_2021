import { initUserTable } from "./user.init";
import { initGroupTable } from "./group.init";
import { seq } from "./dbConnection";

seq
  .sync()
  .then(async () => {
    await initUserTable();
    await initGroupTable();
  })
  .then(() => console.log("✅  All tables are ready to work"));
