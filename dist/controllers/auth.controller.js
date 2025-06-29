import bcrypt from "bcryptjs";
import prisma from "../config/prisma.js";
import createError from "../utils/create-error.util.js";
import jwt from "jsonwebtoken";
export const register = async (req, res, next) => {
    const { username, email, password } = req.body;
    if (username) {
        throw createError(400, "This username already exists");
    }
    if (email) {
        throw createError(400, "This email already exists");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            username,
            email,
            password: hashPassword,
        },
        omit: {
            password: true,
        },
    });
    res.json({ message: "Registered successfully", result: user });
};
export const login = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
        where: { email }
    });
    if (!user) {
        throw createError(400, "Invalid email or password");
    }
    const comparePassword = await bcrypt.compare(password, user?.password);
    const payload = { id: user?.id };
    if (!comparePassword) {
        throw createError(400, "Password is incorrect");
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        algorithm: "HS256",
        expiresIn: "30d"
    });
    res.json({ message: "Logged in successfully", token });
};
