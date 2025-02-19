/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { storage } from "@/utils/FirebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";

const UploadRoleRequestProof = ({
  setImageUrlProof,
  setFileExtension,
}: {
  setImageUrlProof: (downloadUrl: string) => void;
  setFileExtension: (extension: string) => void;
}) => {
  const [selectedFile, setSelectedFile] = useState<any>();
  const [isPDF, setIsPDF] = useState(false);

  // Select file from input and upload to Firebase Storage
  const onFileSelected = async (e: any) => {
    const file = e.target.files[0]; // Get the selected file

    if (file) {
      const fileType = file.type;
      const isPDFFile = fileType === "application/pdf";
      setIsPDF(isPDFFile); // Update state based on file type

      setSelectedFile(URL.createObjectURL(file)); // Create a blob URL of the file

      const fileExtension = isPDFFile ? ".pdf" : ".jpg"; // Set extension based on file type
      setFileExtension(isPDFFile ? ".pdf" : ".jpg");
      const fileName = Date.now() + fileExtension; // Generate a unique file name
      const storageRef = ref(storage, "rhu/" + fileName); // Reference to the file in storage

      await uploadBytes(storageRef, file)
        .then(() => {
          console.log("Upload complete");
        })
        .then(() => {
          getDownloadURL(storageRef).then(async (downloadUrl) => {
            // Get the downloadable URL
            try {
              setImageUrlProof(downloadUrl);

              toast(
                <p className="text-sm font-bold text-green-500">
                  File uploaded successfully
                </p>
              );
            } catch {
              toast(
                <p className="text-sm font-bold text-red-500">
                  Internal error occurred while uploading the file
                </p>
              );
            }
          });
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
          toast(
            <p className="text-sm font-bold text-red-500">
              Error uploading file
            </p>
          );
        });
    }
  };

  return (
    <div>
      <label htmlFor="upload-image">
        {selectedFile ? (
          isPDF ? (
            <embed
              src={selectedFile}
              width="100%"
              height="500px"
              type="application/pdf"
              className="object-cover cursor-pointer h-52 rounded-lg bg-light-100 dark:bg-dark-100 w-full"
            />
          ) : (
            <Image
              src={selectedFile}
              loading="lazy"
              placeholder="blur"
              blurDataURL="/blur.jpg"
              width={1000}
              height={1000}
              alt="Uploaded File"
              className="object-cover cursor-pointer h-52 rounded-lg bg-light-100 dark:bg-dark-100 w-full"
            />
          )
        ) : (
          <Image
            src="/empty-img.png"
            loading="lazy"
            placeholder="blur"
            blurDataURL="/blur.jpg"
            width={1000}
            height={1000}
            alt="Placeholder"
            className="object-cover cursor-pointer w-full h-52 rounded-lg"
          />
        )}
      </label>
      <input
        className="w-20 opacity-0"
        name="file"
        type="file"
        id="upload-image"
        accept="image/png, image/jpeg, application/pdf"
        onChange={onFileSelected}
      />
    </div>
  );
};

export default UploadRoleRequestProof;
