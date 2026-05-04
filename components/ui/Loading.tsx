import React from "react";

export default function Loading() {
   return (
      <div className="w-full h-full flex items-center justify-center bg-black/5">
         <div className="flex space-x-2 justify-center items-center h-screen">
            <span className="sr-only">Loading...</span>
            <div className="h-4 w-4 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-4 w-4 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-4 w-4 bg-blue-400 rounded-full animate-bounce"></div>
         </div>
      </div>
   );
}
