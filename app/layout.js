import { Domine } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/ScrollTop";

const domine = Domine({
  subsets: ["latin"],
  variable: "--font-domine",
  display: "swap",
});

// --- SEO CONFIGURATION ---
export const metadata = {
  // 1. Base URL for resolving relative links (CRITICAL for OG Images)
  metadataBase: new URL("https://rimubhai.com"),

  // 2. Title & Description
  title: {
    default: "Rimu Bhai | Full Stack Developer",
    template: "%s | Rimu Bhai",
  },
  description:
    "Portfolio of Rimu Bhai, a Full Stack Developer specializing in Next.js, React, Node.js, and building exceptional digital experiences.",

  // 3. Keywords for Discovery (DuckDuckGo & Brave love these)
  keywords: [
    "Rimu Bhai",
    "Full Stack Developer",
    "Web Developer India",
    "Next.js Developer",
    "React Expert",
    "Node.js Backend",
    "Software Engineer Portfolio",
    "JavaScript",
    "TypeScript",
    "Creative Developer",
  ],

  // 4. Author Info
  authors: [{ name: "Rimu Mutasim Fuad", url: "https://rimubhai.com" }],
  creator: "Rimu Bhai",
  publisher: "Rimu Bhai",

  // 5. Open Graph (Facebook, LinkedIn, Discord previews)
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rimubhai.com",
    title: "Rimu Bhai | Full Stack Developer",
    description:
      "Building exceptional digital experiences with modern web technologies.",
    siteName: "Rimu Bhai Portfolio",
    images: [
      {
        url: "/rimu.png",
        width: 1200,
        height: 630,
        alt: "Rimu Bhai - Full Stack Developer",
      },
    ],
  },

  // 6. Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Rimu Bhai | Full Stack Developer",
    description:
      "Building exceptional digital experiences with modern web technologies.",
    images: ["/rimu.png"],
    creator: "@__rimu7_",
  },

  // 7. Icons
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },

  // 8. Canonical URL
  alternates: {
    canonical: "./",
  },

  // 9. Search Engine Verification (CRITICAL)
  verification: {
    google: "135vsrUzsz5wrVGMyMsIM-wH1scYhbQ90nL0DtkZtSo",
  },

  // 10. Crawler Directives
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// --- JSON-LD STRUCTURED DATA (The "Secret Sauce") ---
// This tells Google exactly WHO you are.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Rimu Bhai",
  url: "https://rimubhai.com",
  image: "https://rimubhai.com/rimu.png",
  sameAs: [
    "https://github.com/rimu-7",
    "https://x.com/__rimu7_",
    "https://www.linkedin.com/in/mutasim-fuad-rimu-36a4a8260",
  ],
  jobTitle: "Full Stack Developer",
  worksFor: {
    "@type": "Organization",
    name: "Freelance",
  },
  knowsAbout: [
    "Next.js",
    "React",
    "JavaScript",
    "Node.js",
    "MongoDB",
    "Web Development",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${domine.className} lowercase antialiased selection:bg-primary/20 selection:text-primary`}
      >
        {/* Inject JSON-LD Script */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster richColors closeButton position="top-center" />
          <ScrollToTop/>
        </ThemeProvider>
      </body>
    </html>
  );
}
