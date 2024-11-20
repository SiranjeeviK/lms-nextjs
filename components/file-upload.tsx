"use client";

import { UploadButton, UploadDropzone } from "@/lib/uploadthing";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import toast from "react-hot-toast";

interface FileUploadProps {
  onChange: (url?: string) => void;
  endPoint: keyof typeof ourFileRouter;
}

const FileUpload = ({ onChange, endPoint }: FileUploadProps) => {
  return (
    <UploadButton
      onUploadProgress={(progress) => {
        console.log(progress);
      }}
      endpoint={endPoint}
      onClientUploadComplete={(res) => {
        alert("File uploaded successfully");
        console.log("[FILE UPLOAD]", res);
        onChange(res?.[0].url);
      }}
      onUploadError={(error: Error) => {
        toast.error(`${error?.message}`);
      }}
    />
  );
};

export default FileUpload;
