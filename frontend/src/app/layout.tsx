import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { SidebarProvider } from "@/context/SidebarContext";
import { AuthProvider } from "@/context/AuthContext";
import { NotifProvider } from "@/context/NotifContext"; 
import LayoutWrapper from "@/components/layout/LayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Adiloka",
  description: "Platform eksplorasi permainan tradisional Indonesia",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <NotifProvider>
            <SidebarProvider>
              <LayoutWrapper>{children}</LayoutWrapper>
            </SidebarProvider>
          </NotifProvider>
        </AuthProvider>
      </body>
    </html>
  );
}