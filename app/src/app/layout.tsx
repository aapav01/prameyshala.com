import "@/styles/globals.css";
import { Hind } from "next/font/google";

const hind = Hind({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["devanagari"],
});

export const metadata = {
  metadataBase: new URL('https://prameyshala.com'),
  title: "Pramey Shala",
  description: "Start learning with Prameyshala",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={"antialiased "+ hind.className}>{children}</body>
    </html>
  );
}
