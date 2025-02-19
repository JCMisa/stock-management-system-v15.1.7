/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { updateMedicineImage } from "@/lib/actions/medicine";
import { storage } from "@/utils/FirebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const UploadMedicineImage = ({ medicine }: { medicine: any }) => {
  const [selectedFile, setSelectedFile] = useState<any>();

  useEffect(() => {
    if (medicine) {
      setSelectedFile(medicine?.imageUrl);
    }
  }, [medicine]);

  // select image from files and upload to to firebase storage
  const onFileSelected = async (e: any) => {
    const file = e.target.files[0]; // get the selected image file
    setSelectedFile(URL.createObjectURL(file)); // create a blob of the image file

    const fileName = Date.now() + ".jpg"; // generate the name of the file
    const storageRef = ref(storage, "rhu/" + fileName); // pass the filename to the specific path in the storage
    await uploadBytes(storageRef, file)
      .then(() => {
        console.log("upload file complete"); // this will store the image bytes to the firebase storage specified location
      })
      .then(() => {
        getDownloadURL(storageRef).then(async (downloadUrl) => {
          // this will get the viewable url of the img
          try {
            const result = await updateMedicineImage(
              medicine?.medicineId as string,
              downloadUrl as string
            );
            if (result?.data !== null) {
              toast(
                <p className="text-sm font-bold text-green-500">
                  Medicine image updated successfully
                </p>
              );
            }
          } catch {
            toast(
              <p className="text-sm font-bold text-red-500">
                Internal error occured while updating the medicine image
              </p>
            );
          }
        });
      });
  };

  return (
    <div className="mt-6">
      <label htmlFor="upload-image">
        {selectedFile ? (
          <Image
            src={selectedFile ? selectedFile : medicine?.imageUrl}
            loading="lazy"
            placeholder="blur"
            blurDataURL="/blur.jpg"
            width={1000}
            height={1000}
            alt={"banner"}
            className="object-cover cursor-pointer w-20 h-20 rounded-lg"
          />
        ) : (
          <Image
            src={"/empty-img.png"}
            loading="lazy"
            placeholder="blur"
            blurDataURL="/blur.jpg"
            width={1000}
            height={1000}
            alt={"banner"}
            className="object-cover cursor-pointer w-20 h-20 rounded-lg"
          />
        )}
      </label>
      <input
        className="w-20 opacity-0"
        name="file"
        type="file"
        id="upload-image"
        accept="image/png, image/jpeg"
        onChange={onFileSelected}
      />
    </div>
  );
};

export default UploadMedicineImage;
