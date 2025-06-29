import React from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface ValidatedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  register: UseFormRegisterReturn;
  error?: FieldError;
}

const ValidatedInput: React.FC<ValidatedInputProps> = ({
  register,
  error,
  ...rest
}) => {
  return (
    <input
      {...register}
      {...rest}
      className={`outline-1 w-full rounded-lg h-10 pl-2 transition-all duration-200
        ${
          error
            ? "outline-error-red focus:outline-error-red"
            : "outline-gray-200 hover:outline-black focus:outline-primary focus:outline-1"
        } ${rest.className ?? ""}`}
    />
  );
};

export default ValidatedInput;
