import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const ChapterIdPage = async ({
  params,
}: {
  params: {
    courseId: string;
    chapterId: string;
  };
}) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const chapter = await db.chapter.findUnique({
    where: {
      id: params.chapterId,
      courseId: params.courseId,
    },
    include: {
      muxData: true,
    },
  });

  if (!chapter) {
    return redirect("/");
  }
  return (
    <div>
      <h1>{chapter.title}</h1>
    </div>
  );
};

export default ChapterIdPage;
