import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bawaal-chaiwala.samarth-r.dev/"),
  title: "Bawaal Chaiwala | Chai Stall Tycoon",
  description: "Run your own Indian chai stall, manage inventory, set prices, serve rush-hour customers and survive the Minute 40 Milk Supply Shock.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Bawaal Chaiwala | Chai Stall Tycoon",
    description: "A browser-based chai stall business simulation. Make smart pricing and inventory decisions, then survive the milk supply shock.",
    url: "/",
    siteName: "Bawaal Chaiwala",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bawaal Chaiwala | Chai Stall Tycoon",
    description: "Run a neighbourhood chai tapri. Make the business calls. Survive the supply shock.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
