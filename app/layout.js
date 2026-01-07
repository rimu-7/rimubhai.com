import { Domine } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import Footer from "@/components/footer";

const domine = Domine({
  // src: "../../public/Domine-VariableFont_wght.ttf",
  weight: "400",
  variable: "--font-domine",
  display: "swap",
});

export const metadata = {
  title: "rimu bhai ☪︎",
  description: "Crafting digital experiences with precision and passion. Specializing in Next.js, React, and modern web architecture.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${domine.className} lowercase antialiased `}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster richColors closeButton/>
          <Navbar />
          {children}
          <Footer/>
        </ThemeProvider>
      </body>
    </html>
  );
}
