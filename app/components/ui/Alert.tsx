import React, { useEffect, useState } from "react";
import { AlertPropsInterface } from "../../types";
import { X } from "lucide-react";

const Alert: React.FC<AlertPropsInterface> = ({ type, message, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  const alertStyles = {
    success: "bg-green-600",
    error: "bg-red-600",
    warning: "bg-yellow-600",
    info: "bg-blue-600",
    default: "bg-gray-600",
  };

  useEffect(() => {
    // Automatically close the alert after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 500); // Call onClose after fade-out transition is done
    }, 5000);

    // Cleanup the timer when the component unmounts
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`fixed text-white top-5 left-1/2 transform -translate-x-1/2 z-[999] transition-all duration-500 flex justify-between p-4 mb-4 text-sm rounded-lg shadow w-64 sm:min-w-96 ${
        alertStyles[type] || alertStyles.default
      } ${
        !isVisible ? "opacity-0 translate-y-5" : "opacity-100 translate-y-0"
      }`}
    >
      <span className="font-medium">{message}</span>
      <button
        onClick={() => {
          setIsVisible(false);
          onClose();
        }}
        className="cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Alert;
