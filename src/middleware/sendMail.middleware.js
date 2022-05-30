const nodemailer = require("nodemailer");

const DBconnection = require('../DB')

// async..await is not allowed in global scope, must use a wrapper
async function main(email, otp) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
    tls:{
      rejectUnauthorized:false
    }
  });

  
    // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'ptung23082001@gmail.com', // sender address
    to: email, // list of receivers
    subject: "OPT xác nhận", // Subject line
    text: "Mã xác thực của bạn là : "+ otp, // plain text body
  });

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

main().catch(console.error);

module.exports = {main}