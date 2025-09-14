import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DateInputProps {
  id: string;
  label: string;
  name: string;
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const DateInput: React.FC<DateInputProps> = ({
  id,
  label,
  name,
  value,
  onChange,
  required = false,
}) => {
  return (
    <div className="grid w-full gap-1.5 dark:text-white text-black">
      <Label htmlFor={id}>{label}</Label>
      <Input
        type="date"
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="dark:text-white"
        required={required}
      />
    </div>
  );
};

export default DateInput;
