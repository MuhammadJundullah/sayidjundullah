import React from "react";
import { Label } from "@/components/ui/label";

// Definisi tipe data untuk setiap opsi
interface SelectOption {
  value: string;
  label: string;
}

// Definisi tipe data untuk props
interface DynamicSelectProps {
  id: string;
  label: string; 
  name: string; 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; 
  options: SelectOption[];
  placeholder?: string; 
  required?: boolean;
}

const SelectInput: React.FC<DynamicSelectProps> = ({
  id,
  label,
  name,
  value,
  onChange,
  options,
  placeholder = "Pilih...",
  required = false,
}) => {
  return (
    <div className="grid w-xs gap-1.5 dark:text-white">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="select bg-gray-100 rounded-2xl px-3 py-2 text-black"
        required={required}>
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;
