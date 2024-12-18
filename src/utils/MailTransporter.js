import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true, 
  auth: {
    user: "gaganpalai987@gmail.com",
    pass: "whbe hfhy lihu ugsy",
  },
});

export const mailTransporter = async ({ receiverMail, message }) => {
  try {
    const info = await transporter.sendMail({
      from: "gaganpalai987@gmail.com",
      to: "gaganjobs09@gmail.com",
      subject: "you have got an offer",
      text: "Hello world?",
      html: "<b>Hello world?</b>",
    });

    console.log("Message sent: %s", info);
  } catch (error) {
    console.log("errot at mail");
  }
};
