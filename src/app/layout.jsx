import { Inter } from "next/font/google";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CartProvider } from "@/contexts/CartContext";
import OnboardingGuard from "@/components/OnboardingGuard";
import "./globals.css";
import { Toast } from "@heroui/react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "EverTrade | Premium Second-Hand Marketplace",
  description: "Secure, premium marketplace for pre-owned tech, furniture, and more.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} min-h-full flex flex-col bg-gray-50 dark:bg-[#060e20] text-gray-900 dark:text-[#e2e8f0] transition-colors duration-300`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <CartProvider>
            <Navbar />
            <main className="flex-grow flex flex-col">
              <OnboardingGuard>
                {children}
              </OnboardingGuard>
            </main>
            <Footer />
          </CartProvider>
        </ThemeProvider>
        <Toast.Provider />
      </body>
    </html>
  );
}
