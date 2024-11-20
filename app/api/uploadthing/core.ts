import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const handleAuth = async () => {
  const { userId } = await auth();
  if (!userId) {
    throw new UploadThingError("Unauthorized");
  }
  return { userId };
};


export const ourFileRouter = {
  courseImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(({ file }) => {
      return file;
    }),
  courseAttachment: f(["text", "image", "video", "audio", "pdf"])
    .middleware(() => handleAuth())
    .onUploadComplete(({ file }) => {
      return file;
    }),
  chapterVideo: f({ video: { maxFileSize: "512MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(({ file }) => {
      return file;
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
