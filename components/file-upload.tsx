"use client";

import toast from "react-hot-toast";

import { UploadDropzone } from "@/lib/uploadthing";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { useState } from "react";

interface FileUploadProps {
  onChange: (url?: string) => void;
  endpoint: keyof typeof ourFileRouter;
}

export const FileUpload = ({ onChange, endpoint }: FileUploadProps) => {
  const [file, setFile] = useState<File>();
  const sizeToMeabytes = (size: number): string => {
    return `${(size / 1048576).toFixed(2)} MB`;
  };
  return (
    <UploadDropzone
      endpoint={endpoint}
      content={{
        allowedContent({ isUploading }) {
          if (isUploading)
            return `Uploading ${file?.name} - ${
              file?.size ? sizeToMeabytes(file?.size) : ""
            }`;
        },
      }}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(error: Error) => {
        toast.error(`${error?.message}`);
      }}
      onBeforeUploadBegin={(files: File[]) => {
        if (files) setFile(files[0]);
        return files;
      }}
    />
  );
};
