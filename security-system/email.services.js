const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const GMAIL_ADDRESS = process.env.GMAIL_ADDRESS;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

class emailService {
    sendEmail = async (cljkhcxiucsa, subject, body) => {
        try {
            const accessToken = await oAuth2Client.getAccessToken();
        
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                type: 'OAuth2',
                user: GMAIL_ADDRESS,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken.token,
                },
            });
        
            const mailOptions = {
                from: `${GMAIL_ADDRESS}`,
                to: cljkhcxiucsa,
                subject: subject,
                text: body,
            };
        
            const result = await transporter.sendMail(mailOptions);
            return result;
        } catch (error) {
            throw(error);
        }
    }
}

module.exports = new emailService();