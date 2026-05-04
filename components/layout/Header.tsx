"use client";

import Image from "next/image";

export default function Header() {
   return (
      <header className="fixed top-0 left-0 right-0 z-49 h-16 bg-white shadow px-4 py-3 flex items-center">
         <div className="flex justify-center items-center gap-4">
            <Image
               className="rounded-t-lg w-10 h-full aspect-square"
               src="logo.png"
               width={500}
               height={500}
               priority
               unoptimized
               alt="logo"
            />
            <div className="text-lg font-bold">Fresh Jus</div>
         </div>
      </header>
   );
}
