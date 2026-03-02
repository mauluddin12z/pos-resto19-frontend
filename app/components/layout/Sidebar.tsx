import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import Modal from "../ui/Modal";
import LoadingButton from "../ui/LoadingButton";
import { useAuth } from "@/app/context/AuthContext";

export default function Sidebar() {
   const { user, handleLogout, loading } = useAuth();
   const userRole = user?.role ?? "superadmin";
   const pathname = usePathname();
   const router = useRouter();

   const [isLoggingOut, setIsLoggingOut] = useState(false);
   const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

   const sidebarLinks = [
      {
         href: "/home",
         label: "Home",
         icon: "home.svg",
         roles: ["admin", "superadmin"],
      },
      {
         href: "/orders",
         label: "Orders",
         icon: "orders.svg",
         roles: ["admin", "superadmin"],
      },
      {
         href: "/sales",
         label: "Sales",
         icon: "sales.svg",
         roles: ["admin", "superadmin"],
      },
      {
         href: "/menus",
         label: "Menus",
         icon: "menus.svg",
         roles: ["admin", "superadmin"],
      },
      {
         href: "/categories",
         label: "Categories",
         icon: "categories.svg",
         roles: ["superadmin"],
      },
      {
         href: "/users",
         label: "Users",
         icon: "users.svg",
         roles: ["superadmin"],
      },
   ];

   const handleLogoutClick = async () => {
      setIsLoggingOut(true);
      await handleLogout();
      router.push("/login");
   };

   if (loading) {
      return (
         <aside className="fixed left-0 z-48 w-14 sm:w-24 h-full bg-white border border-gray-200 sm:px-3 sm:py-4 px-1 py-2 overflow-y-auto">
            <ul className="space-y-4 font-medium text-sm">
               {[...Array(5)].map((_, index) => (
                  <li key={index} className="flex justify-center items-center">
                     <div className="w-10 h-10 rounded-lg bg-gray-200"></div>
                  </li>
               ))}
            </ul>
         </aside>
      );
   }

   return (
      <aside
         className="fixed left-0 z-48 w-14 sm:w-24 h-full bg-white border border-gray-200 sm:px-3 sm:py-4 px-1 py-2 overflow-y-auto"
         aria-label="Sidebar"
      >
         <ul className="space-y-4 font-medium text-sm">
            {sidebarLinks
               .filter((link) => link.roles.includes(userRole))
               .map((item) => (
                  <li key={item.href}>
                     <Link
                        href={item.href}
                        className={`flex flex-col justify-center items-center gap-y-2 p-2 text-gray-900 rounded-lg hover:bg-gray-100 ${
                           pathname === item.href ? "bg-gray-200" : ""
                        }`}
                     >
                        <Image
                           className="w-4 aspect-square"
                           width={50}
                           height={50}
                           src={`sidebarIcon/${item.icon}`}
                           alt={item.label}
                           priority
                        />
                        <div className="hidden lg:block">{item.label}</div>
                     </Link>
                  </li>
               ))}
            <li>
               <button
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="flex flex-col justify-center items-center w-full gap-y-2 p-2 text-gray-900 rounded-lg hover:bg-gray-100 cursor-pointer"
               >
                  <Image
                     className="w-4 aspect-square"
                     width={50}
                     height={50}
                     src="sidebarIcon/logout.svg"
                     alt="logout"
                     priority
                  />
                  <div className="hidden lg:block">Logout</div>
               </button>
            </li>
         </ul>

         {isLogoutModalOpen && (
            <Modal
               isOpen={isLogoutModalOpen}
               onClose={() => setIsLogoutModalOpen(false)}
            >
               <div>
                  <p className="text-center">
                     Are you sure you want to log out of your account?
                  </p>
                  <div className="mt-4 gap-4 flex justify-center">
                     <button
                        onClick={handleLogoutClick}
                        className={`bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md ${
                           isLoggingOut
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer"
                        }`}
                        disabled={isLoggingOut}
                     >
                        {isLoggingOut ? (
                           <div className="flex gap-2 justify-center items-center">
                              <LoadingButton /> Logging out...
                           </div>
                        ) : (
                           "Logout"
                        )}
                     </button>
                     <button
                        onClick={() => setIsLogoutModalOpen(false)}
                        className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md cursor-pointer"
                     >
                        Cancel
                     </button>
                  </div>
               </div>
            </Modal>
         )}
      </aside>
   );
}
