import { ReactNode } from "react";

interface IconButtonProps {
  onClick?: () => void;
  children: ReactNode;
  variant?: "default" | "edit" | "delete";
  disabled?: boolean;
}

export default function IconButton({
  onClick,
  children,
  variant = "default",
  disabled = false,
}: IconButtonProps) {
  const baseStyle =
    "flex h-8 w-8 items-center justify-center rounded-lg border transition cursor-pointer";

  const variants = {
    default: "text-gray-500 hover:bg-gray-200",
    edit: "text-gray-500 hover:bg-blue-600 hover:text-white",
    delete: "border-red-300 text-red-600 hover:bg-red-600 hover:text-white",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {children}
    </button>
  );
}
