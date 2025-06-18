const cron = require("node-cron");
const { backupMySQL, backupMongoDB } = require("./backup.service.js");
const {
  anonymizeUserInSQL,
  forceAnonymizeAll,
} = require("../services/anonymize.service.js");
const DeletedUser = require("../models/mongodb/deletedUser.model.js");

cron.schedule("0 */6 * * *", async () => {
  console.log("Scheduled backup started...");
  try {
    console.log("Starting anonymization before backup...");
    await forceAnonymizeAll();
    console.log("Anonymization completed before backup.");
    console.log("Starting MySQL backup...");
    await backupMySQL();
    console.log("Scheduled backup finished.");
  } catch (err) {
    console.error("Backup failed:", err);
  }
});

cron.schedule("28 * * * *", async () => {
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
    await forceAnonymizeAll();
    console.log("Scheduled anonymization finished.");
  } catch (err) {
    console.error("Anonymization failed:", err);
  }
});

console.log("Scheduler running. Waiting for jobs...");
