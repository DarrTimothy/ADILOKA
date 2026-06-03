"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, LogIn, LogOut } from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { setShowPopularWeek } = useSidebar();
  const { isAuthenticated, logoutUser } = useAuth();

  return (
    <header className="flex items-center justify-between px-15 py-4 bg-white shadow">
      <div className="flex items-center gap-15">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/asset/Logo-Adiloka.svg"
            alt="Logo Adiloka"
            width={60}
            height={60}
            priority
          />
        </Link>

        <nav className="text-md flex items-center gap-10">
          <Link href="/" className="font-semibold hover:text-[#7B0000]">
            Peta Interaktif
          </Link>

          <Link href="/tentangKami" className="font-semibold hover:text-[#7B0000]">
            Tentang Kami
          </Link>

          <button
            onClick={() => setShowPopularWeek(true)}
            className="flex items-center gap-2 font-semibold hover:text-[#7B0000]"
          >
            <Star size={18} />
            Popular Week
          </button>
        </nav>
      </div>

      {/* AUTH BUTTON */}
      <div className="flex items-center gap-4">
        {!isAuthenticated ? (
          <Link href="/login" className="flex items-center gap-2 font-semibold">
            <LogIn size={18} />
            Login
          </Link>
        ) : (
          <button
            onClick={logoutUser}
            className="flex items-center gap-2 font-semibold text-red-600"
          >
            <LogOut size={18} />
            Logout
          </button>
        )}
      </div>
    </header>
  );
}