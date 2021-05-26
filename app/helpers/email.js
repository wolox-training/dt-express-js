const nodemailer = require('nodemailer');

const {
  common: {
    email: { host, username, password, port }
  }
} = require('../../config');

const transporter = nodemailer.createTransport({
  host,
  port,
  secure: true,
  auth: {
    user: username,
    pass: password
  }
});

exports.sendMail = (email, subject, text) => {
  transporter.sendMail({
    from: `'Wolox training' <${username}>`,
    to: email,
    subject,
    text
  });
};
