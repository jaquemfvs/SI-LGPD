const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const backupDir = path.resolve(__dirname, process.env.BACKUP_DIR);

function ensureBackupDir() {
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
}

async function backupMySQL() {
  ensureBackupDir();
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupFile = path.join(backupDir, `backup-${timestamp}.sql`);
  const dumpCommand = `mysqldump -h ${process.env.DB_HOST} -u ${process.env.DB_USER} -p${process.env.DB_PASSWORD} ${process.env.DB_NAME}`;
  return new Promise((resolve, reject) => {
    exec(dumpCommand, (error, stdout) => {
      if (error) {
        console.error(`MySQL backup failed: ${error.message}`);
        reject(error);
        return;
      }
      fs.writeFileSync(backupFile, stdout);
      console.log(`MySQL database backed up to ${backupFile}`);
      resolve();
    });
  });
}

async function backupMongoDB() {
  ensureBackupDir();
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = path.join(backupDir, `mongo-backup-${timestamp}`);
  const dumpCommand = `mongodump --host ${process.env.MONGODB_HOST} --port ${process.env.MONGODB_PORT} --db ${process.env.MONGODB_NAME} --out ${backupPath}`;
  return new Promise((resolve, reject) => {
    exec(dumpCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`MongoDB backup failed: ${error.message}`);
        reject(error);
        return;
      }
      console.log(`MongoDB database backed up to ${backupPath}`);
      resolve();
    });
  });
}

module.exports = { backupMySQL, backupMongoDB };
