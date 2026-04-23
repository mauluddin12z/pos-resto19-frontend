"use client";
import { useRouter } from "next/navigation";
import React, { useState, FormEvent } from "react";
import { login } from "@/app/api/auth";
import LoadingButton from "../components/ui/LoadingButton";

export default function Page() {
   const [username, setUsername] = useState<string>("");
   const [password, setPassword] = useState<string>("");
   const [message, setMessage] = useState<string>("");
   const router = useRouter();

   const [isSubmitting, setisSubmitting] = useState(false);
   const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
      setisSubmitting(true);
      e.preventDefault();
      try {
         await login(username, password);
         setisSubmitting(false);
         router.push("/beranda");
      } catch (error: any) {
         setisSubmitting(false);
         setMessage(error?.message || "An error occurred.");
         setTimeout(() => {
            setMessage("");
         }, 3000);
      }
   };
   return (
      <div className="w-full h-screen flex justify-center items-center relative overflow-hidden">
         <div className="absolute w-1/2 aspect-square rounded-full bg-red-600/10 top-[-50%] left-0 translate-x-[-50%] blur-2xl"></div>
         <div className="absolute w-1/2 aspect-square rounded-full bg-blue-600/10 bottom-[-50%] right-0 translate-x-[50%] blur-2xl"></div>
         <div className="px-14 py-14 flex flex-col justify-center border border-gray-200 rounded-lg shadow-sm bg-white">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
               <h2 className="text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                  Sign in to your account
               </h2>
            </div>

            {/* Show error or success message */}
            {message && (
               <div className="text-center text-red-600 mt-4">
                  <p>{message}</p>
               </div>
            )}

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
               <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                     <label
                        htmlFor="username"
                        className="block text-sm/6 font-medium text-gray-900"
                     >
                        Username
                     </label>
                     <div className="mt-2">
                        <input
                           id="username"
                           type="text"
                           name="username"
                           placeholder="username"
                           value={username}
                           onChange={(e) => setUsername(e.target.value)}
                           required
                           autoComplete="username"
                           className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                        />
                     </div>
                  </div>

                  <div>
                     <div className="flex items-center justify-between">
                        <label
                           htmlFor="password"
                           className="block text-sm/6 font-medium text-gray-900"
                        >
                           Password
                        </label>
                     </div>
                     <div className="mt-2">
                        <input
                           id="password"
                           type="password"
                           name="password"
                           placeholder="••••••••"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           required
                           autoComplete="current-password"
                           className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                        />
                     </div>
                  </div>

                  <div>
                     <button
                        type="submit"
                        className={`flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                           isSubmitting
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer"
                        }`}
                     >
                        {isSubmitting ? (
                           <div className="flex gap-2 justify-center items-center">
                              <LoadingButton /> Loading...
                           </div>
                        ) : (
                           "Sign In"
                        )}
                     </button>
                  </div>
               </form>
            </div>
         </div>
      </div>
   );
}
