import { initUserTable } from "./user.init";
import { initGroupTable } from "./group.init";
import { seq } from "./dbConnection";

(async function initDb() {
  await seq.sync();
  await initUserTable();
  await initGroupTable();
  console.log("✅  All tables are ready to work");
})();
