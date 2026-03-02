import React from "react";

interface TextInputProps {
   id: string;
   name: string;
   placeholder?: string;
   value: string;
   onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
   className?: string;
}

const TextInput: React.FC<TextInputProps> = ({
   id,
   name,
   placeholder = "",
   value,
   onChange,
   className = "",
}) => {
   return (
      <input
         type="text"
         id={id}
         name={name}
         placeholder={placeholder}
         value={value}
         onChange={onChange}
         className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 ${className}`}
      />
   );
};

export default TextInput;
