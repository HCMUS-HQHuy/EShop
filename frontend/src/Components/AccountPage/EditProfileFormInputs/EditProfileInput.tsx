import React from "react";
import s from "./EditProfileInput.module.scss";

// 1. Định nghĩa type cho props
interface InputDataProps {
  label?: string;
  name: string;
  type?: React.HTMLInputTypeAttribute; // e.g. 'text', 'email', 'password', etc.
  value: string;
  setValue?: (value: string) => void;
  required?: boolean;
  autoComplete?: boolean;
  placeholder?: string;
}

interface EditProfileInputProps {
  inputData: InputDataProps;
}

// 2. Component
const EditProfileInput: React.FC<EditProfileInputProps> = ({ inputData }) => {
  const {
    label,
    name,
    type = "text",
    value,
    setValue,
    required = false,
    autoComplete = false,
    placeholder = "",
  } = inputData;

  const inputAttributes: React.InputHTMLAttributes<HTMLInputElement> = {
    type,
    name,
    id: name,
    value: value ?? "",
    required,
    "aria-required": required,
    autoComplete: autoComplete ? "on" : "off",
    placeholder,
    onChange: setValue ? (e) => setValue(e.target.value) : undefined,
  };

  return (
    <div className={s.input}>
      {label && <label htmlFor={name}>{label}</label>}
      <input {...inputAttributes} />
    </div>
  );
};

export default EditProfileInput;
