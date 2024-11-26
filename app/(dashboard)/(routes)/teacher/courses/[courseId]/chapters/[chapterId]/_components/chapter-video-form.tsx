"use client";

import axios from "axios";
import MuxPlayer from "@mux/mux-player-react";
import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle, Video } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter, MuxData } from "@prisma/client";
import FileUpload from "@/components/file-upload";
// import { z } from "zod";

interface ChapterVideoFormProps {
  initialData: Chapter & { muxData?: MuxData };
  courseId: string;
  chapterId: string;
}

type FormType = {
  videoUrl: string;
};

// const formSchema = z.object({
//   videoUrl: z.string().url(),
// });

const ChapterVideoForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEditing = () => setIsEditing((prev) => !prev);

  const router = useRouter();

  // const form = useForm<FormType>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {
  //     videoUrl: initialData?.videoUrl || "",
  //   },
  // });

  // const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: FormType) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );
      toast.success("Chapter updated");
      toggleEditing();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter Video
        <Button variant={"ghost"} onClick={toggleEditing}>
          {isEditing ? (
            <>Cancel</>
          ) : initialData.videoUrl ? (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Video
            </>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a Video
            </>
          )}
        </Button>
      </div>
      {!isEditing ? (
        !initialData.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <MuxPlayer 
            playbackId={initialData?.muxData?.playbackId || ""}
            
            />
          </div>
        )
      ) : (
        <div>
          <FileUpload
            endPoint="chapterVideo"
            onChange={(url) => {
              if (url) {
                onSubmit({ videoUrl: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Upload this chapter&apos;s video.
          </div>
        </div>
      )}
      {initialData.videoUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          Videos can take a few minutes to process. Refresh the page if the
          video does not appear.
        </div>
      )}
    </div>
  );
};

export default ChapterVideoForm;
