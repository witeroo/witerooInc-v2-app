require('dotenv').config();

const nodemailer = require("nodemailer");

async function sendFeedBackMail(message, subject) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD
        }
    });

    let mailOptions = {
        from: 'Witeroo Website" <contact@witeroo.com>',
        to: 'info@witeroo.com',
        subject: subject,
        html: message
    };

    // send mail with defined transport object
    await transporter.sendMail(mailOptions);
}

module.exports = sendFeedBackMail;