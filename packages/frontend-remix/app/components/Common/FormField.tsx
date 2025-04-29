// components/Common/FormField.tsx
import { ReactNode } from "react";

type FormFieldProps = {
  label: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
};

export function FormField({
  label,
  required,
  children,
  className = "",
}: FormFieldProps) {
  return (
    <label className={`flex flex-col gap-1 ${className}`}>
      <span className="font-semibold text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </span>
      {children}
    </label>
  );
}
