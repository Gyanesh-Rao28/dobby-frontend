// src/components/ui/Alert.jsx
import React from "react";
import { AlertCircle, CheckCircle, XCircle, Info } from "lucide-react";

export default function Alert({ type = "info", message, onClose }) {
  const types = {
    success: {
      bgColor: "bg-green-50",
      textColor: "text-green-800",
      borderColor: "border-green-200",
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    },
    error: {
      bgColor: "bg-red-50",
      textColor: "text-red-800",
      borderColor: "border-red-200",
      icon: <XCircle className="h-5 w-5 text-red-500" />,
    },
    warning: {
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-800",
      borderColor: "border-yellow-200",
      icon: <AlertCircle className="h-5 w-5 text-yellow-500" />,
    },
    info: {
      bgColor: "bg-blue-50",
      textColor: "text-blue-800",
      borderColor: "border-blue-200",
      icon: <Info className="h-5 w-5 text-blue-500" />,
    },
  };

  const { bgColor, textColor, borderColor, icon } = types[type];

  return (
    <div
      className={`${bgColor} ${textColor} ${borderColor} border p-4 rounded-md mb-4`}
    >
      <div className="flex">
        <div className="flex-shrink-0">{icon}</div>
        <div className="ml-3">
          <p className="text-sm">{message}</p>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <button
              type="button"
              className={`inline-flex rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-offset-2`}
              onClick={onClose}
            >
              <span className="sr-only">Dismiss</span>
              <XCircle className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
