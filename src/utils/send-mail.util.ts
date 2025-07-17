import transporter from "../config/mail";

const sendEmail = (email: string, link: string) => {
  (async () => {
    const info = await transporter.sendMail({
      from: 'suttirak.char@gmail.com',
      to: email,
      subject: "Request for resetting password",
      text: "Thank you for your response", // plain‑text body
      html: `
        <div>
          <h2>Hello from ReanGan</h2>
          <p>You have submitted the request to reset your password. If this wasn't you, you can ignore this email.</p>
          <a href="${link}">Click here to reset password</a>
        </div>
      `, // HTML body
    });

    console.log("Message sent:", info.messageId);
  })();
};

export default sendEmail