import "./globals.css";
import { Providers } from "./providers";
import NavBar from "@/components/ui/Navbar";
import StickyFooter from "@/components/ui/StickyFooter";

export const metadata = {
  title: "Trade It",
  description: "Token Discovery",
  icons: {
    icon: "favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-(--bg) text-white">
        {/* Global Providers */}
        <Providers>
          <NavBar />
          <main className="app-container">
            <div className="tokens-wrapper">{children}</div>
          </main>
          <StickyFooter />
        </Providers>
      </body>
    </html>
  );
}
