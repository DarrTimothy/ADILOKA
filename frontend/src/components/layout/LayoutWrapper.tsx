"use client";

import { usePathname } from "next/navigation";

import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideHeader =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/quiz");

  const hideFooter =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/quiz") ||
    pathname === "/profile";

  return (
    <div className="flex flex-col min-h-screen">
      {!hideHeader && <Header />}

      <main className="flex-1 overflow-hidden">
        {children}
      </main>

      {!hideFooter && <Footer />}
    </div>
  );
}