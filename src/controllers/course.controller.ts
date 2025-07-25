import type { NextFunction, Request, Response } from "express";
import prisma from "../config/prisma";
import createError from "../utils/create-error.util";
import {
  findEnrolledCourse,
  findLessonsFromEnrolledCourse,
  getCourse,
  userEnrollCourse,
} from "../services/course.service";

export const getAllCourses = async (
  req: Request,
  res: Response
) => {
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

export const enrollCourse = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { id: userId, role } = req.user;

  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!user) {
    throw createError(404, "User not found");
  }

  if (role === "ADMIN") {
    throw createError(403, "Only users can enroll the course");
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
  const { id: userId, role } = req.user;

  if (role === "ADMIN") {
    // throw createError(403, "Only users can unenroll the course");
    next();
    return;
  }

  const enrolledCourse = await findEnrolledCourse(userId, +id);
  const finishedQuiz = await prisma.finishedQuiz.findFirst({
    where: { userId: +userId, courseId: +id },
  });

  if (!enrolledCourse) {
    throw createError(400, "Course has not been enrolled yet");
  }

  await prisma.enrolledCourse.delete({
    where: enrolledCourse,
  });

  if (finishedQuiz) {
    await prisma.finishedQuiz.deleteMany({
      where: {
        userId: +finishedQuiz?.userId,
        courseId: +finishedQuiz?.courseId,
      },
    });
  }

  res.json({ message: "Course unenrolled" });
};

export const getEnrolledCourses = async (req: Request, res: Response) => {
  const { userId } = req.enrolledCourse;
  const courses = await prisma.course.findMany({
    where: {
      enrolledCourse: {
        some: {
          userId,
        },
      },
    },
    include: {
      lessons: {
        include: {
          quizzes: true,
        },
      },
    },
  });

  if (!courses || courses.length === 0) {
    res.json({ message: "No courses enrolled" });
  }

  res.json({ message: "Get enrolled courses", courses });
};

export const getLessonFromCourse = async (req: Request, res: Response) => {
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

// For admin

export const getCourseById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.user;
  const course = await prisma.course.findFirst({
    where: { id: +id },
    include: {
      lessons: {
        include: {
          quizzes: {
            include: {
              questions: true
            }
          }
        }
      },
    },
  });

  if (role !== "ADMIN") {
    throw createError(403, "Only admin can access this course");
  }

  if (!course) {
    throw createError(
      500,
      "An error occurred while loading the courses. Please try again later."
    );
  }

  res.json({ message: "Course fetched", course });
};

export const createCourse = async (req: Request, res: Response) => {
  const { title, description } = req.body;
  const { role } = req.user;

  if (!title) {
    throw createError(400, "Title is required");
  }

  const course = await prisma.course.create({
    data: { title, description },
  });

  if (role !== "ADMIN") {
    throw createError(403, "Only admin can access this course");
  }

  if (!course) {
    throw createError(400, "Failed to create a course");
  }

  res.json({ message: "Course created", course });
};

export const updateCourse = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const { role } = req.user;

  if (!title) {
    throw createError(400, "Title is required");
  }

  const findCourse = await prisma.course.findFirst({
    where: { id: +id },
  });

  if (role !== "ADMIN") {
    throw createError(403, "Only admin can access this course");
  }

  if (!findCourse) {
    throw createError(400, "Failed to update a course");
  }

  const course = await prisma.course.update({
    where: { id: findCourse?.id },
    data: { title, description },
  });

  res.json({ message: "Course updated", course });
};

export const deleteCourse = async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const { role } = req.user;

  const findCourse = await prisma.course.findFirst({
    where: { id: +courseId },
  });

  if (role !== "ADMIN") {
    throw createError(403, "Only admin can access this course");
  }

  if (!findCourse) {
    throw createError(400, "Failed to delete a course");
  }

  await prisma.course.delete({
    where: { id: findCourse?.id },
  });

  res.json({ message: "Course deleted" });
};
