import transporter from "../config/mail";

const sendEmail = (email: string, link: string) => {
  (async () => {
    const info = await transporter.sendMail({
      from: 'suttirak.char@gmail.com',
      to: email,
      subject: "Request for resetting password",
      text: "Thank you for your response", // plain‑text body
      html: `<a href="${link}">Click here to reset password</a>`, // HTML body
    });

    console.log("Message sent:", info.messageId);
  })();
};

export default sendEmail