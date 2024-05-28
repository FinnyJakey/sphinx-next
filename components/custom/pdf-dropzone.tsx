// "use client";

import { useDropzone } from "react-dropzone";
import { useCallback } from "react";

export default function PDFDropzone({
  onDrop,
}: {
  onDrop: (acceptedFiles: any) => void;
}) {
  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      maxFiles: 1,
      accept: {
        "application/pdf": [".pdf"],
      },
      onDrop: onDrop,
    });

  return (
    <section>
      <div
        {...getRootProps()}
        className="h-24 flex justify-center items-center border border-dashed rounded-lg text-center text-lg"
      >
        <input {...getInputProps()} />
        {!isDragActive && "Click here or drop the file to upload!"}
        {isDragActive && !isDragReject && "Drop it!"}
        {isDragReject && "File type is NOT accepted. Try again!"}
      </div>
    </section>
  );
}
