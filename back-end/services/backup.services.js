const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const { forceAnonymizeAll } = require("./anonymize.service");

class BackupService {
  backupDatabase = async () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupDir = path.join(__dirname, "..", "db_backups");
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    const files = fs
      .readdirSync(backupDir)
      .filter((f) => f.endsWith(".sql"))
      .map((f) => ({
        name: f,
        time: fs.statSync(path.join(backupDir, f)).mtime.getTime(),
      }))
      .sort((a, b) => a.time - b.time);
    if (files.length >= 3) {
      const oldest = files[0];
      fs.unlinkSync(path.join(backupDir, oldest.name));
      console.log(`Deleted oldest backup: ${oldest.name}`);
    }
    const backupFile = path.join(backupDir, `backup-${timestamp}.sql`);

    const dumpCommand = `mysqldump -h ${process.env.DB_HOST} -u ${process.env.DB_USER} -p${process.env.DB_PASSWORD} ${process.env.DB_NAME}`;
    const dump = exec(dumpCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Backup failed: ${error.message}`);
        return;
      }
      fs.writeFileSync(backupFile, stdout);
      console.log(`Database backed up to ${backupFile}`);
    });
  };
  restoreMostRecentDatabase = async () => {
    const backupDir = path.join(__dirname, "..", "db_backups");
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const files = fs
      .readdirSync(backupDir)
      .filter((f) => f.endsWith(".sql"))
      .map((f) => ({
        name: f,
        time: fs.statSync(path.join(backupDir, f)).mtime.getTime(),
      }))
      .sort((a, b) => b.time - a.time);
    if (files.length === 0) {
      console.log("No backup files found to restore.");
      return;
    }
    const latest = path.join(backupDir, files[0].name);
    console.log(`Latest backup found: ${files[0].name}`);
    this.restoreDatabase(latest);
  };
  restoreDatabase = async (dumpFilePath) => {
    const restoreCommand = `mysql -h ${process.env.DB_HOST} -u ${process.env.DB_USER} -p${process.env.DB_PASSWORD} ${process.env.DB_NAME} < ${dumpFilePath}`;
    exec(restoreCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Restore failed: ${error.message}`);
        return;
      }
      try {
        forceAnonymizeAll();
      } catch (err) {
        console.error(`Anonymization failed: ${err.message}`);
      }
      console.log(`Database restored from ${dumpFilePath}`);
    });
  };
}

module.exports = new BackupService();
