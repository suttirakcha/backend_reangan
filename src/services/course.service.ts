import prisma from "../config/prisma";

// export const checkEnrolledCourse = async () => {
//   return await prisma.enrolledCourse.findFirst({
//     where: { userId: user?.id, courseId: +id },
//   });
// }

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
  })
}