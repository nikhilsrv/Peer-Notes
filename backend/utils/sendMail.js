import nodemailer from "nodemailer";

export const sendMail = (receiverMail,reason) => {
  
  var subject=""
  var message=""
  if(reason==="notes uploaded"){
     subject="Notes Uploaded",
     message="Thank you for uploading notes on Peer Notes.Your Notes will be visible once approved"
  }
 
  const auth = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    port: 465,
    auth: {
      user: process.env.GMAIL_ACCOUNT,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const receiver = {
    from: process.env.GMAIL_ACCOUNT,
    to: receiverMail,
    subject: subject,
    text: message,
  };

  auth.sendMail(receiver, (err, emailResponse) => {
    if (err) console.log(err);
    console.log(emailResponse);
  });
};
