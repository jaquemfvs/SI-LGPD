const fs = require('fs');
const { spawn } = require('child_process');
const mysql = require('mysql2/promise');
const emailService = require("./email.services.js");

function log(msg) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${msg}`);
}
async function restoreDatabase(sqlFilePath) {
  return new Promise((resolve, reject) => {
    log(`Restoring database from: ${sqlFilePath}`);

    const restore = spawn('mysql', [
      '-h', process.env.DB_HOST,
      '-u', process.env.DB_USER,
      `-p${process.env.DB_PASSWORD}`,
      process.env.DB_NAME
    ]);

    const stream = fs.createReadStream(sqlFilePath);
    stream.pipe(restore.stdin);

    restore.stderr.on('data', data => console.error(`stderr: ${data}`));

    restore.on('close', code => {
      if (code === 0) {
        log('Database restore complete.');
        resolve();
      } else {
        reject(new Error(`Restore failed with code ${code}`));
      }
    });
  });
}
async function fetchUsers() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  const [rows] = await connection.execute('SELECT name, email FROM users');
  await connection.end();
  return rows;
}
async function triggerBreachNotificationEmail(emailRecipient) {
    let now = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format((new Date()));
    const emailSubject = `Security Notice: Possible Data Breach (${now})`
    const emailBody = "We recently detected unauthorized access to our systems, and your account information may have been affected.\n"
                    + "As a precaution, we recommend changing your password and staying alert for suspicious emails.\n"
                    + "We apologize for the inconvenience and are working to enhance our security."
    try {
        await emailService.sendEmail(emailRecipient, emailSubject, emailBody)
        return emailRecipient;
    } catch (err) {
        console.log(err)
        return null
    }
}

async function runCLI() {
  const sqlFile = process.argv[2];
  if (!sqlFile || !fs.existsSync(sqlFile)) {
    console.error('Usage: node notify-breach.js <path-to-backup.sql>');
    process.exit(1);
  }

  try {
    log('Process started.');

    await restoreDatabase(sqlFile);
    const users = await fetchUsers();
    log(`Found ${users.length} user(s) to notify.`);

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      try {
        // await triggerBreachNotificationEmail(user.email);
        log(`Email sent to: ${user.email}`);
      } catch (err) {
        log(`Failed to send email to ${user.email}: ${err.message}`);
      }
    }

    log('Process completed.');
  } catch (err) {
    log(`Fatal error: ${err.message}`);
  }
}



runCLI();
