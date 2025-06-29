import prisma from "../config/prisma.js";
export const getLessonFromCourse = async (req, res, next) => {
    const lessons = await prisma.lesson.findMany();
    res.json({ message: "Lessons fetched", lessons });
};
