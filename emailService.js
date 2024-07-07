const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
const sendConfirmationEmail = (username,userEmail, confirmationCode) => {
  const date= new Date().getFullYear()
  const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Account Confirmation',
      html: `
          <!DOCTYPE html>
          <html>
          <head>
              <title>Email Confirmation</title>
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      margin: 0;
                      padding: 0;
                      background-color: #f4f4f4;
                  }
                  .container {
                      width: 100%;
                      max-width: 600px;
                      margin: 0 auto;
                      background-color: #ffffff;
                      padding: 20px;
                      border-radius: 8px;
                      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  }
                  .header {
                      text-align: center;
                      padding: 20px;
                      background-color: #060606;
                      color: #ffffff;
                      border-top-left-radius: 8px;
                      border-top-right-radius: 8px;
                  }
                  .header h1 {
                      margin: 0;
                      font-size: 24px;
                  }
                  .content {
                      padding: 20px;
                      color: #333333;
                      line-height: 1.6;
                  }
                  .content p {
                      margin: 0 0 10px;
                  }
                  .content a {
                      color: #007bff;
                      text-decoration: none;
                  }
                  .footer {
                      text-align: center;
                      padding: 10px;
                      background-color: #f4f4f4;
                      color: #666666;
                      border-bottom-left-radius: 8px;
                      border-bottom-right-radius: 8px;
                  }
                  .footer p {
                      margin: 0;
                  }
              </style>
          </head>
          <body>
              <div class="container">
                  <div class="header">
                      <h1>Confirmation Email</h1>
                  </div>
                  <div class="content">
                      <p>Hello ${username},</p>
                      <p>Thank you for registering with us. Please confirm your email address by clicking the link below. This link is valid for 5 minutes.</p>
                      <p><a href="${process.env.localhost_URL}/api/confirm?code=${confirmationCode}">Confirm Email Address</a></p>
                      <p>Thank you,<br>The InnoByte Team</p>
                  </div>
                  <div class="footer">
                      <p>&copy; ${date} InnoByte. All rights reserved.</p>
                  </div>
              </div>
          </body>
          </html>
      `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.log('Error sending email:', error);
      } else {
          console.log('Email sent:', info.response);
      }
  });
};


module.exports = { sendConfirmationEmail };
