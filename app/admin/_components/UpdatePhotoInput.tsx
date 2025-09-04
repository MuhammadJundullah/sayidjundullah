import React from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UpdatePhotoInputProps {
  id: string;
  label: string;
  name: string;
  image: string | File | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
  alt: string;
}

const UpdatePhotoInput: React.FC<UpdatePhotoInputProps> = ({
  id,
  label,
  name,
  image,
  onChange,
  accept = "image/*",
  alt,
}) => {
  const imageUrl = image
    ? typeof image === "string"
      ? image
      : URL.createObjectURL(image)
    : "https://res.cloudinary.com/dislphwb0/image/upload/v1748565484/404_vzvale.jpg";

  const handleImageLoad = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    if (image instanceof File) {
      URL.revokeObjectURL(e.currentTarget.src);
    }
  };

  return (
    <div className="grid w-full gap-1.5 dark:text-white">
      <div className="grid w-full gap-1.5">
        <Label htmlFor={id}>{label}</Label>
        <div className="sm:w-lg aspect-[2/1] relative mb-8">
          <Image
            src={imageUrl}
            alt={alt}
            fill
            sizes="100"
            className="rounded-2xl object-cover overflow-hidden my-3 border-4"
            onLoad={handleImageLoad}
          />
        </div>
      </div>
      <Input
        type="file"
        id={id}
        name={name}
        className="dark:text-white"
        onChange={onChange}
        accept={accept}
      />
    </div>
  );
};

export default UpdatePhotoInput;
