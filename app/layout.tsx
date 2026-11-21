import type { Metadata } from "next";
import Providers from "./providers";
import SiteHeader from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: "BookLeagued — find your next favorite read",
  description:
    "A cozy reading room to discover books, share recommendations, and meet fellow readers.",
  icons: {
    icon: "/images/bookleagued-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <Providers>
          <div className="site-shell">
            <SiteHeader />
            {children}
            <footer className="site-footer">
              <span>BookLeagued Reading Room</span>
              <span>Made for people who always have one more chapter.</span>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
