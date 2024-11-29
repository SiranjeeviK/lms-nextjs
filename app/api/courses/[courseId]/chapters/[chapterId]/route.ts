import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Mux } from "@mux/mux-node";

const { video } = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: {
      courseId: string;
      chapterId: string;
    };
  },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });
    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const chapter = await db.chapter.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
    });

    if (!chapter) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Clean up existing Mux data for chapter asset
    if (chapter.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: chapter.id,
        },
      });

      if (existingMuxData) {
        await video.assets.delete(existingMuxData.assetId);
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }
    }

    const deletedChapter = await db.chapter.delete({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
    });

    const publishedChaptersInCourse = await db.chapter.findMany({
      where: {
        courseId: params.courseId,
        isPublished: true,
      },
    });

    // If there is no published chapter in the course, unpublish the course
    if (!publishedChaptersInCourse.length) {
      await db.course.update({
        where: {
          id: params.courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return NextResponse.json(deletedChapter);
  } catch (error) {
    console.log("[COURSE CHAPTER ID DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: {
      courseId: string;
      chapterId: string;
    };
  },
) {
  try {
    const { userId } = await auth();
    // TODO: Do some thing with isPublished
    const { isPublished, ...values } = await req.json();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });
    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const chapter = await db.chapter.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
    });

    if (!chapter) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const updatedChapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        ...values,
      },
    });

    if (values.videoUrl) {
      // Clean up existing Mux data
      console.info(
        "[COURSE CHAPTER ID PATCH] ",
        "CLEANING UP EXISTING MUX DATA ...",
      );
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: updatedChapter.id,
        },
      });
      console.info("[COURSE CHAPTER ID PATCH] ", "FOUND EXISTING MUX DATA");

      if (existingMuxData) {
        // video.assets.retrieve(existingMuxData.assetId).then((asset) => {
        //   console.log("MUX ASSET", JSON.stringify(asset, null, 2));
        //   if (asset.status === "ready") {
        //     video.assets.delete(existingMuxData.assetId);
        //   }
        // });
        console.info("[COURSE CHAPTER ID PATCH] ", "Trying to delete asset...");
        try {
          const muxAsset = await video.assets.retrieve(existingMuxData.assetId);
          console.info(
            "[COURSE CHAPTER ID PATCH] Found",
            JSON.stringify(muxAsset, null, 2),
          );
          if (muxAsset.status === "ready") {
            await video.assets.delete(existingMuxData.assetId);
          }
          console.info("[COURSE CHAPTER ID PATCH] Deleted asset");
        } catch (error) {
          console.error(
            "[COURSE CHAPTER ID PATCH] Error deleting asset",
            error,
          );
        }
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
        console.info("[COURSE CHAPTER ID PATCH] Deleted asset data from DB");
      }

      // Create new Mux data
      const asset = await video.assets.create({
        input: values.videoUrl,
        playback_policy: ["public"],
        test: false,
      });

      await db.muxData.create({
        data: {
          assetId: asset.id,
          chapterId: updatedChapter.id,
          playbackId: asset.playback_ids?.[0]?.id,
        },
      });
    }

    return NextResponse.json(updatedChapter);
  } catch (error) {
    console.error("[COURSE CHAPTER ID PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
