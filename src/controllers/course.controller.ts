import type { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma";
import createError from "../utils/create-error.util";
import { getUser } from "../services/auth.service";
import {
  findEnrolledCourse,
  findLessonsFromEnrolledCourse,
  getCourse,
  userEnrollCourse,
} from "../services/course.service";

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
      enrolledCourse: true,
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

export const enrollCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!user) {
    throw createError(404, "User not found");
  }

  const course = await getCourse(+id);

  if (!course) {
    throw createError(404, "Course not found");
  }

  const enrolledCourse = await findEnrolledCourse(userId, course?.id);

  if (enrolledCourse?.courseId === course?.id) {
    throw createError(400, "Course already enrolled");
  }

  const result = await userEnrollCourse(user.id, course.id);

  res.json({ message: "Course enrolled, let's have fun", result });
};

export const unenrollCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  const enrolledCourse = await findEnrolledCourse(userId, +id);

  if (!enrolledCourse) {
    throw createError(400, "Course has not been enrolled yet");
  }

  await prisma.enrolledCourse.delete({
    where: enrolledCourse,
  });

  res.json({ message: "You have unenrolled this course" });
};

export const getEnrolledCourses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.enrolledCourse;
  const courses = await prisma.course.findMany({
    where: {
      enrolledCourse: {
        some: {
          userId,
        },
      },
    },
  });

  if (courses.length > 0){
    res.json({ message: "Get enrolled courses", courses });
  } else {
    res.json({ message: "You have not enrolled any courses yet" });
  }
};

export const getLessonFromCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { userId } = req.enrolledCourse;

  const course = await prisma.course.findFirst({
    where: { id: +id },
  });

  if (!course) {
    throw createError(404, "Course not found");
  }

  const { title, description } = course;
  const lessons = await findLessonsFromEnrolledCourse(userId, +id);

  res.json({ message: "Lessons fetched", title, description, lessons });
};
