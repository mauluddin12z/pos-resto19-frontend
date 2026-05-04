import React from "react";

interface NumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
   id: string;
   name?: string;
   value: string | number;
   onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
   className?: string;
}

const NumberInput: React.FC<NumberInputProps> = ({
   id,
   name,
   value,
   onChange,
   className = "",
   ...rest
}) => {
   return (
      <input
         type="number"
         id={id}
         name={name}
         value={value}
         onChange={onChange}
         className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 ${className}`}
         {...rest}
      />
   );
};

export default NumberInput;
