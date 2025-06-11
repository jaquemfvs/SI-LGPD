// const fs = require('fs');
// const path = require('path');
// const { spawn } = require('child_process');
// const mysql = require('mysql2/promise');
// const nodemailer = require('nodemailer');
// require('dotenv').config();

// // Log helper
// function log(msg) {
//   const timestamp = new Date().toISOString();
//   console.log(`[${timestamp}] ${msg}`);
// }

// // Restore database from SQL file
// async function restoreDatabase(sqlFilePath) {
//   return new Promise((resolve, reject) => {
//     log(`Restoring database from: ${sqlFilePath}`);

//     const restore = spawn('mysql', [
//       '-h', process.env.DB_HOST,
//       '-u', process.env.DB_USER,
//       `-p${process.env.DB_PASSWORD}`,
//       process.env.DB_NAME
//     ]);

//     const stream = fs.createReadStream(sqlFilePath);
//     stream.pipe(restore.stdin);

//     restore.stderr.on('data', data => console.error(`stderr: ${data}`));

//     restore.on('close', code => {
//       if (code === 0) {
//         log('Database restore complete.');
//         resolve();
//       } else {
//         reject(new Error(`Restore failed with code ${code}`));
//       }
//     });
//   });
// }

// // Fetch users from DB
// async function fetchUsers() {
//   const connection = await mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
//   });

//   const [rows] = await connection.execute('SELECT name, email FROM users');
//   await connection.end();
//   return rows;
// }

// // Send breach email
// function createTransporter() {
//   return nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: parseInt(process.env.EMAIL_PORT),
//     secure: false,
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS
//     }
//   });
// }

// function sendEmail(transporter, user) {
//   const mailOptions = {
//     from: `"Security Team" <${process.env.EMAIL_USER}>`,
//     to: user.email,
//     subject: 'Security Notice: Possible Data Breach',
//     text: `Hello ${user.name || ''},\n\nWe detected unauthorized access to our systems. Your account info may have been affected.\n\nPlease change your password and stay alert for suspicious activity.\n\nWe apologize for the inconvenience.`
//   };

//   return transporter.sendMail(mailOptions);
// }

// // Main CLI flow
// async function runCLI() {
//   const sqlFile = process.argv[2];
//   if (!sqlFile || !fs.existsSync(sqlFile)) {
//     console.error('Usage: node notify-breach.js <path-to-backup.sql>');
//     process.exit(1);
//   }

//   try {
//     log('Process started.');

//     await restoreDatabase(sqlFile);
//     const users = await fetchUsers();
//     log(`Found ${users.length} user(s) to notify.`);

//     const transporter = createTransporter();

//     for (let i = 0; i < users.length; i++) {
//       const user = users[i];
//       try {
//         await sendEmail(transporter, user);
//         log(`Email sent to: ${user.email}`);
//       } catch (err) {
//         log(`Failed to send email to ${user.email}: ${err.message}`);
//       }
//     }

//     log('Process completed.');
//   } catch (err) {
//     log(`Fatal error: ${err.message}`);
//   }
// }

// runCLI();
