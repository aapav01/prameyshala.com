import "@/styles/globals.css";
import "react-phone-number-input/style.css";
import { Hind } from "next/font/google";
import Script from "next/script";
import { Toaster } from "@/components/ui/toaster";

const hind = Hind({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["devanagari"],
});

export const metadata = {
  metadataBase: new URL("https://prameyshala.com"),
  title: "Pramey Shala",
  description:
    "Achieve exam success with PrameyShala. Personalized learning, expert mentors, and resources for IIT JEE, NEET, and board exams (CBSE, ICSE, more).",
  applicationName: "Pramey Shala",
  referrer: "origin-when-cross-origin",
  keywords: [
    "learning",
    "prameyshala",
    "jee",
    "main",
    "advance",
    "experience",
    "class",
    "standard",
    "biology",
    "pyhcis",
    "maths",
    "chemistry",
    "course",
    "icse",
    "cbse",
    "isc",
    "up",
    "U.P.",
    "Bihar",
    "Board",
    "school",
    "teacher",
    "students",
    "college",
    "cells",
    "exerise",
    "comprehensive",
    "concepts",
    "complex",
    "journey",
    "tracking",
  ],
  authors: [
    { name: "Abhay Gupta" },
    { name: "Naman Chaudhary", url: "https://webkolek.com" },
  ],
  creator: "Webkolek",
  openGraph: {
    title: "Pramey Shala",
    description: "Start learning with Prameyshala",
    url: "https://prameyshala.com",
    siteName: "Pramey Shala",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pramey Shala",
    description: "Start learning with Prameyshala",
    // siteId: '',
    // creator: '',
    // creatorId: '',
  },
  category: "education",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={"antialiased " + hind.className}>
        {children}
        <Toaster />
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-48KC5W0304"
        />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-48KC5W0304');
          `}
        </Script>
      </body>
    </html>
  );
}
