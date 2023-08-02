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
  description: "Start learning with Prameyshala",
  applicationName: "Pramey Shala",
  referrer: "origin-when-cross-origin",
  keywords: [
    "Class 9th",
    "Class 10th",
    "Class 11th",
    "Class 12th",
    "Class IX",
    "Class X",
    "Class XI",
    "Class XII",
    "Pyhics",
    "Chemistry",
    "Mathematics",
    "Biology",
    "Science",
    "NCERT",
    "CBSE",
    "JEE",
    "NEET",
    "NTSE",
    "KVPY",
    "Olympiads",
    "Foundation",
    "Competitive Exams",
    "Free",
    "Online",
    "Video Lectures",
    "Notes",
    "Solutions",
    "Doubts",
    "DPP",
    "Assignments",
    "Practice Papers",
    "Mock Tests",
    "Previous Year Papers",
    "Revision Notes",
    "Revision Videos",
    "Revision Assignments",
    "Revision DPP",
    "Revision Practice Papers",
    "Revision Mock Tests",
    "Revision Previous Year Papers",
    "Revision",
    "Revision Notes",
    "Revision Videos",
    "Revision Assignments",
    "Revision DPP",
    "Revision Practice Papers",
    "Revision Mock Tests",
    "Revision Previous Year Papers",
    "Revision",
    "Revision Notes",
    "Revision Videos",
    "Revision Assignments",
    "Revision DPP",
    "Revision Practice Papers",
    "Revision Mock Tests",
    "Revision Previous Year Papers",
    "Revision",
  ],
  authors: [
    { name: "Abhay Gupta" },
    { name: "Naman Chaudhary", url: "https://webkolek.com" },
  ],
  colorScheme: "light",
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
