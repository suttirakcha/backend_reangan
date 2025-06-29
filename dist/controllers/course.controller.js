import prisma from "../config/prisma.js";
import createError from "../utils/create-error.util.js";
export const getAllCourses = async (req, res, next) => {
    const courses = await prisma.course.findMany({
        include: {
            lessons: {
                omit: { courseId: true },
            },
        },
    });
    res.json({ message: "Courses fetched", courses });
};
export const getCourseById = async (req, res, next) => {
    const { id } = req.params;
    const course = await prisma.course.findFirst({
        where: { id: Number(id) },
        include: {
            lessons: {
                omit: { courseId: true },
            },
        },
    });
    if (!course) {
        throw createError(404, "Course not found");
    }
    res.json({ message: "Courses fetched", course });
};
