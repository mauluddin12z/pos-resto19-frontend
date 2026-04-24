import React from "react";
import LoadingButton from "./LoadingButton";

type ButtonVariant = "default" | "destructive" | "primary";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
  loadingText?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "default",
  className = "",
  isLoading = false,
  loadingText,
  disabled,
  ...props
}) => {
  const baseStyle =
    "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold cursor-pointer";

  const variants: Record<ButtonVariant, string> = {
    default: "border border-border hover:bg-secondary",
    destructive:
      "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    primary:
      "bg-primary text-primary-foreground shadow-[var(--shadow-card)] transition-opacity hover:opacity-90",
  };

  return (
    <button
      type="button"
      className={`${baseStyle} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      <span>{isLoading ? loadingText || children : children}</span>

      {isLoading && (
        <span className="flex items-center">
          <LoadingButton />
        </span>
      )}
    </button>
  );
};
