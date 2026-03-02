import type { Metadata } from "next";
import Roboto from "next/font/local";
import "./globals.css";
import "./utils/fontawesome";
import { AlertProvider } from "./context/AlertContext";
import { AuthProvider } from "./context/AuthContext";

const roboto = Roboto({
  src: [
    { path: "./fonts/Roboto-Thin.ttf", weight: "100", style: "normal" },
    { path: "./fonts/Roboto-ThinItalic.ttf", weight: "100", style: "italic" },
    { path: "./fonts/Roboto-ExtraLight.ttf", weight: "200", style: "normal" },
    {
      path: "./fonts/Roboto-ExtraLightItalic.ttf",
      weight: "200",
      style: "italic",
    },
    { path: "./fonts/Roboto-Light.ttf", weight: "300", style: "normal" },
    { path: "./fonts/Roboto-LightItalic.ttf", weight: "300", style: "italic" },
    { path: "./fonts/Roboto-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Roboto-Italic.ttf", weight: "400", style: "italic" },
    { path: "./fonts/Roboto-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/Roboto-MediumItalic.ttf", weight: "500", style: "italic" },
    { path: "./fonts/Roboto-SemiBold.ttf", weight: "600", style: "normal" },
    {
      path: "./fonts/Roboto-SemiBoldItalic.ttf",
      weight: "600",
      style: "italic",
    },
    { path: "./fonts/Roboto-Bold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/Roboto-BoldItalic.ttf", weight: "700", style: "italic" },
    { path: "./fonts/Roboto-ExtraBold.ttf", weight: "800", style: "normal" },
    {
      path: "./fonts/Roboto-ExtraBoldItalic.ttf",
      weight: "800",
      style: "italic",
    },
    { path: "./fonts/Roboto-Black.ttf", weight: "900", style: "normal" },
    { path: "./fonts/Roboto-BlackItalic.ttf", weight: "900", style: "italic" },
  ],
  variable: "--font-roboto",
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
      <body className={`${roboto.variable} antialiased`}>
        <AuthProvider>
          <AlertProvider>{children}</AlertProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
