import { db } from "@/lib/db";
import { Category, Course } from "@prisma/client";
import { getProgress } from "./get-progress";

export type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: {
    id: string;
  }[];
  progress: number | null;
};

type GetCourses = {
  userId: string;
  title?: string;
  categoryId?: string;
};

export const getCourses = async ({
  userId,
  categoryId,
  title,
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
  try {
    const courses = await db.course.findMany({
      where: {
        title: {
          // Filter by title
          contains: title,
          mode: "insensitive",
        },
        categoryId: categoryId, // Filter by category
        isPublished: true, //Published courses only
      },
      include: {
        category: true, // Include the category
        chapters: {
          // Include the chapters
          where: {
            isPublished: true, // Published chapters only
          },
          select: {
            id: true, // Select the id only
          },
        },
        purchases: {
          // The purchases data is included only if the user has purchased the course
          where: {
            // Otherwise, it will be null
            userId: userId,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const coursesWithProgress: CourseWithProgressWithCategory[] =
      await Promise.all(
        courses.map(async (course) => {
          if (course.purchases.length === 0) { //means the user has not purchased the course
            return {
              ...course,
              progress: null, // Progress is null
            };
          }

          const progressPercentage = await getProgress(userId, course.id);

          return {
            ...course,
            progress: progressPercentage,
          };
        }),
      );

    return coursesWithProgress;
  } catch (error) {
    console.log("[GET_COURSES_ERROR]", error);
    return [];
  }
};
