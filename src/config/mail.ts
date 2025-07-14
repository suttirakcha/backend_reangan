import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "suttirak.char@gmail.com",
    pass: "nqgelzaaknlvjbdd",
  },
  tls: {
    rejectUnauthorized: false
  }
});

export default transporter;