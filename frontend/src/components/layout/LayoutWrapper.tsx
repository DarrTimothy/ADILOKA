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

  const hideLayout =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/quiz");

  return (
    <>
      {!hideLayout && <Header />}

      <main>{children}</main>

      {!hideLayout && <Footer />}
    </>
  );
}
