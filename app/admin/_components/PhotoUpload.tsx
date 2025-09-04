import React from "react";
import { Input } from "@/components/ui/input"; 
import { Label } from "@/components/ui/label";

// Definisi tipe data untuk props
interface PhotoUploadProps {
  id: string; 
  label: string;
  name: string; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  accept?: string; 
  hint?: string; 
  required?: boolean;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({
  id,
  label,
  name,
  onChange,
  accept = "image/*",
  hint,
  required = false,
}) => {
  return (
    <div className="grid w-full gap-1.5 dark:text-white text-black">
      <Label htmlFor={id}>{label}</Label>
      <Input
        type="file"
        id={id}
        name={name}
        onChange={onChange}
        className="dark:text-white dark:placeholder:text-gray-300"
        accept={accept}
        required={required}
      />
      {hint && <p className="text-gray-500 dark:text-gray-200 text-xs">{hint}</p>}
    </div>
  );
};

export default PhotoUpload;
