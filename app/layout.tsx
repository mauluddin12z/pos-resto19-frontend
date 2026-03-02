import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import "./utils/fontawesome";
import { AlertProvider } from "./context/AlertContext";
import { AuthProvider } from "./context/AuthContext";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
   title: "Pempek & Resto 19",
   description: "Pempek & Resto 19",
   generator: "Next.js",
   manifest: "/app/manifest.json",
   icons: [
      { rel: "apple-touch-icon", url: "icons/icons-128.png" },
      { rel: "icon", url: "icons/icons-128.png" },
   ],
};

export const viewport = {
   content:
      "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
   themeColor: [
      { media: "(prefers-color-scheme: dark)", color: "#000" },
      { media: "(prefers-color-scheme: light)", color: "#000" },
   ],
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en">
         <body
            className={`${roboto.className} antialiased`}
         >
            <AuthProvider>
               <AlertProvider>{children}</AlertProvider>
            </AuthProvider>
         </body>
      </html>
   );
}
