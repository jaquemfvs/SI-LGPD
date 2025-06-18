const cron = require("node-cron");
const { backupMySQL, backupMongoDB } = require("./backup.service.js");
const { forceAnonymizeAll } = require("../services/anonymize.service.js");
const DeletedUser = require("../models/mongodb/deletedUser.model.js");

// Is it worth to hold more backups?
// or is it worth more to host the backups on a cloud service?
// or is it worth to have multiple mysql/mongo servers with replication?

cron.schedule("0 */6 * * *", async () => {
  console.log("Scheduled backup started...");
  try {
    console.log("Starting MySQL backup...");
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
    await forceAnonymizeAll();
    console.log("Scheduled anonymization finished.");
  } catch (err) {
    console.error("Anonymization failed:", err);
  }
});

console.log("Scheduler running. Waiting for jobs...");
