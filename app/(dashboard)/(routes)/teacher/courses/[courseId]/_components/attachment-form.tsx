"use client";

import axios from "axios";
import { Button } from "@/components/ui/button";
import { File, Loader2, PlusCircle, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Attachment, Course } from "@prisma/client";
import FileUpload from "@/components/file-upload";
import { z } from "zod";

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = z.object({
  url: z.string().url().min(1),
});

type FormType = z.infer<typeof formSchema>;

const AttachmentForm = ({ initialData, courseId }: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toggleEditing = () => setIsEditing((prev) => !prev);

  const router = useRouter();

  // const form = useForm<FormType>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {
  //     imageUrl: initialData?.imageUrl || "",
  //   },
  // });

  // const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: FormType) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values);
      toast.success("Course updated");
      toggleEditing();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
      toast.success("Attachment deleted");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Attachment
        <Button variant={"ghost"} onClick={toggleEditing}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a file
            </>
          )}
        </Button>
      </div>
      {!isEditing ? (
        initialData.attachments.length === 0 ? (
          <p className="text-sm mt-2 text-slate-500 italic">
            No attachments yet
          </p>
        ) : (
          <div className="space-y-2">
            {initialData.attachments.map((attachment) => (
              <div
                className="flex items-center gap-x-2 p-3 w-full bg-sky-100 border border-sky-200 text-sky-700 rounded-md"
                key={attachment.id}
              >
                <File className="w-4 h-4 mr-2 flex-shrink-0" />
                <p className="text-xs line-clamp-1">{attachment.name}</p>
                {deletingId === attachment.id ? (
                  <div>
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : (
                  <button
                    className="ml-auto hover:opacity-75 transition"
                    onClick={() => onDelete(attachment.id)}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )
      ) : (
        <div>
          <FileUpload
            endPoint="courseAttachment"
            onChange={(url) => {
              if (url) {
                onSubmit({ url: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Add anything your students might need to complete the course.
          </div>
        </div>
      )}
    </div>
  );
};

export default AttachmentForm;
