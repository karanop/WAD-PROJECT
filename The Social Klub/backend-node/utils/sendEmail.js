const nodemailer = require('nodemailer');

const sendVerificationEmail = async (email, token) => {
  try {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });

    const verificationLink = `http://localhost:5000/api/users/verify/${token}`;

    const info = await transporter.sendMail({
      from: '"The Social Klub" <no-reply@thesocialklub.com>', // sender address
      to: email, // list of receivers
      subject: "Welcome! Please verify your email address", // Subject line
      html: `
        <h2>Welcome to The Social Klub!</h2>
        <p>Thank you for registering. Please confirm your email address by clicking the link below:</p>
        <a href="${verificationLink}" style="padding: 10px 20px; background-color: #D4A96A; color: white; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
        <p>Or copy and paste this link into your browser:</p>
        <p>${verificationLink}</p>
        <br/>
        <p>If you did not request this, please ignore this email.</p>
      `,
    });

    console.log("Message sent: %s", info.messageId);
    // Preview URL will output the ethereal fake email page where we can inspect it safely!
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending verification email: ", error);
  }
};

module.exports = {
  sendVerificationEmail
};
