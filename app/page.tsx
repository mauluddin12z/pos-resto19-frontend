"use client";
import { useAuth } from "@/context/AuthContext";
import { redirect, useRouter, } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
   const { user } = useAuth();
   const router = useRouter();

   useEffect(() => {
     if (user) {
       router.push("/beranda");
     }else{
      router.push("/login");
     }
   }, [user, router]);

}
