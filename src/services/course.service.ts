import prisma from "../config/prisma";
import createError from "../utils/create-error.util";

export const getCourse = async (id: number) => {
  return prisma.course.findFirst({
    where: { id },
    include: {
      lessons: {
        omit: { courseId: true },
      },
    },
  });
};

export const userEnrollCourse = async (userId: number, courseId: number) => {
  return prisma.enrolledCourse.create({
    data: {
      userId,
      courseId,
    },
  });
};

export const findEnrolledCourse = async (userId: number, courseId: number) => {
  const enrolledCourse = await prisma.enrolledCourse.findFirst({
    where: { userId, courseId },
  });

  return enrolledCourse;
};

export const findLessonsFromEnrolledCourse = async (
  userId: number,
  courseId: number
) => {
  const enrolledCourse = await findEnrolledCourse(userId, courseId);

  const lessons = await prisma.lesson.findMany({
    where: { courseId },
    include: { quizzes: {
      omit: { lessonId: true }
    } }
  });

  if (enrolledCourse?.userId !== userId) {
    throw createError(401, "You have not enrolled this course yet");
  }

  if (!lessons) {
    throw createError(400, "Cannot find the course you are looking for");
  }

  return lessons;
};
