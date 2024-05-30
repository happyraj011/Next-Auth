import User from '@/models/userModel'
import nodemailer from 'nodemailer'
import bcryptjs from 'bcryptjs'


export const sendEmail = async({email,emailType,userId}:any)=>{
    try {

      const hashedToken = await bcryptjs.hash(userId.toString(), 10)

      if (emailType === "VERIFY") {
          await User.findByIdAndUpdate(userId,{ 
              $set:
              {verifyToken: hashedToken, verifyTokenExpiry:new Date( Date.now() + 3600000)}})
      } else if (emailType === "RESET"){
          await User.findByIdAndUpdate(userId, {
            $set:

            
              {forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry:new Date( Date.now() + 3600000)}})
      }


             
            
      var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "b61e387d9a939d",
          pass: "4939f06eb98fc1"
        }
      });
      
       

 
         const mailOptions={
            from: 'raj@raj.email', 
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
            or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>`
         }
         

         const mailResponse=await transport.sendMail(mailOptions)
         return mailResponse


    } catch (error:any) {
         throw new Error(error.message)
    }
}