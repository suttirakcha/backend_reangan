import type { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma";
import createError from "../utils/create-error.util";
import { getUser } from "../services/auth.service";
import { getCourse, userEnrollCourse } from "../services/course.service";

export const getAllCourses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { search } = req.params;
  const courses = await prisma.course.findMany({
    include: {
      lessons: {
        omit: { courseId: true },
      },
      enrolledCourse: true
    },
  });

  if (!courses) {
    throw createError(
      500,
      "An error occurred while loading the courses. Please try again later."
    );
  }

  res.json({ message: "Courses fetched", courses });
};

export const getCourseById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const course = await prisma.course.findFirst({
    where: { id: +id },
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

export const enrollCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { username, email } = req.user;

  const user = await getUser(username, email);

  if (!user) {
    throw createError(404, "User not found");
  }

  const course = await getCourse(+id);

  if (!course) {
    throw createError(404, "Course not found");
  }

  const findEnrolledCourse = await prisma.enrolledCourse.findFirst({
    where: { userId: user?.id, courseId: course?.id },
  });

  if (findEnrolledCourse?.courseId === course?.id) {
    throw createError(400, "Course already enrolled");
  }

  const enrolled = await userEnrollCourse(user.id, course.id);

  res.json({ message: "Enrolled the course", result: enrolled });
};

export const unenrollCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { username } = req.user;

  const user = await prisma.user.findUnique({
    where: { username },
  });

  const enrolledCourse = await prisma.enrolledCourse.findFirst({
    where: { userId: user?.id, courseId: +id },
  });

  if (!enrolledCourse) {
    throw createError(400, "Course has not been enrolled yet");
  }

  await prisma.enrolledCourse.delete({
    where: enrolledCourse,
  });

  res.json({ message: "Course unenrolled" });
};

export const getEnrolledCourses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { courseId } = req.enrolledCourse;
  const courses = await prisma.course.findMany({
    where: { id: courseId },
  });

  res.json({ message: "Get enrolled courses", courses });
};

export const getLessonFromCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { userId } = req.enrolledCourse;

  const enrolledCourse = await prisma.enrolledCourse.findFirst({
    where: { courseId: +id }
  })
  const lessons = await prisma.lesson.findMany({
    where: { courseId: +id },
  });

  if (enrolledCourse?.userId !== userId){
    throw createError(401, "You have not enrolled this course yet");
  }

  if (!lessons) {
    throw createError(400, "Cannot find the course you are looking for");
  }

  res.json({ message: "Lessons fetched", lessons });
};
