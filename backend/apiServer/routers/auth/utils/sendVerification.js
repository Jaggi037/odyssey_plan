require('dotenv').config();
const nodemailer = require('nodemailer')

var transporter = nodemailer.createTransport({
    host:process.env.SMTP_HOST,
    port:Number(process.env.SMTP_PORT),
    secure:Boolean(process.env.STMP_SECURE),
    service : 'gmail',
    auth : {
      user : process.env.EMAIL_SMTP,
      pass : process.env.EMAIL_PASSWORD,
    }
  })
console.log(
    process.env.EMAIL_PASSWORD
)

 async function sendMail(email , Id){
    try{
        var mailOptions = {
            from : process.env.EMAIL_SMTP,
            to : email,
            subject : 'Email Verification for Odyssey',
            text : 'http://localhost:8000/auth/verify?Id='+Id,
        }
        const flag = await transporter.sendMail(mailOptions)
        console.log(flag);
        return true;
    }
    catch (e) {
        return false;
    }
    
}

module.exports = {sendMail}