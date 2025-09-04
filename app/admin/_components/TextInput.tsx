import React from "react";
import { Input } from "@/components/ui/input"; 
import { Label } from "@/components/ui/label"; 

interface DynamicInputProps {
  id: string; 
  label: string;
  type: string;
  name: string;
  value: string | number; 
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  required?: boolean;
}

const TextInput: React.FC<DynamicInputProps> = ({
  id,
  label,
  type,
  name,
  value,
  placeholder,
  onChange,
  required = false,
}) => {
  return (
    <div className="grid w-full gap-1.5 dark:text-white text-black">
      <Label htmlFor={id}>{label}</Label>
      <Input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="dark:text-white dark:placeholder:text-gray-300"
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
};

export default TextInput;