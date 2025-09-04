import React from "react";
import { Label } from "@/components/ui/label"; 

// Definisi tipe data untuk props
interface DynamicTextareaProps {
  id: string; 
  label: string; 
  name: string;
  value: string;
  placeholder: string; 
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; 
  required?: boolean;
}

const TextAreaInput: React.FC<DynamicTextareaProps> = ({
  id,
  label,
  name,
  value,
  placeholder,
  onChange,
  required = false,
}) => {
  return (
    <div className="grid w-full gap-1.5 dark:text-white text-black">
      <Label htmlFor={id}>{label}</Label>
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-2 border border-gray-300 rounded-md text-sm dark:text-white dark:placeholder:text-gray-300 dark:bg-gray-500"
        required={required}
      />
    </div>
  );
};

export default TextAreaInput;
