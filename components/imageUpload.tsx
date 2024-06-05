"use client";
import { CldUploadButton } from "next-cloudinary";
import Image from "next/image";
import { useEffect, useState } from "react";

type ImageUploadProps = {
  value: string;
  handleChange: (src: string) => void;
  disabled?: boolean;
};

const ImageUpload = ({ value, handleChange, disabled }: ImageUploadProps) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;
  //This will prevent hydration error on the part of Server Side Rendering.
  //As the cloudinary component mounts, the useEffect then runs and sets mounted to true
  //If not mounted, it will return null basically during ssr so as to not cause any errors.
  return (
    <div className="space-y-4 w-full flex flex-col justify-center items-center">
      <CldUploadButton
      onSuccess={(result:any)=>handleChange(result?.info.secure_url) }
        options={{
          maxFiles: 1,
        }}
        uploadPreset="sc43eort"
      >
        <div
          className="
            p-4
            border-4
            border-dashed border-primary/10
            rounded-g hover: opacity-75
            transition flex flex-col
            space-y-2
            1tems-center justify-center"
        >
          <div className="relative h-40 w-40">
            <Image
            fill
            alt={value||"Upload"}
            src={value ||"/placeholder.png"}
            className="rounded-lg object-cover"
            sizes="(max-width: 768px) 10rem, (max-width: 1200px) 10rem"
            />
          </div>
        </div>
      </CldUploadButton>
    </div>
  );
};

export default ImageUpload;
