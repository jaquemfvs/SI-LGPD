const cron = require("node-cron");
const { backupMySQL, backupMongoDB } = require("./backup.service.js");
const { anonymizeUserInSQL } = require("../services/anonymize.service.js");
const DeletedUser = require("../models/mongodb/deletedUser.model.js");

cron.schedule("0 */6 * * *", async () => {
  console.log("Scheduled backup started...");
  try {
    await backupMySQL();
    console.log("Scheduled backup finished.");
  } catch (err) {
    console.error("Backup failed:", err);
  }
});

cron.schedule("0 * * * *", async () => {
  console.log("Scheduled MongoDB backup started...");
  try {
    await backupMongoDB();
    console.log("Scheduled MongoDB backup finished.");
  } catch (err) {
    console.error("MongoDB backup failed:", err);
  }
});

cron.schedule("0 */5 * * *", async () => {
  console.log("Scheduled anonymization started...");
  try {
    const deletedUsers = await DeletedUser.find({});
    for (const user of deletedUsers) {
      await anonymizeUserInSQL(user.userId);
    }
    console.log("Scheduled anonymization finished.");
  } catch (err) {
    console.error("Anonymization failed:", err);
  }
});

console.log("Scheduler running. Waiting for jobs...");
