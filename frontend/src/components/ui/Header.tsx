"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, LogIn, LogOut, User } from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { setShowPopularWeek } = useSidebar();
  const { user, isAuthenticated, logoutUser } = useAuth();

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
          <Link
            href="/"
            className="text-gray-700 font-semibold hover:text-[#7B0000] transition"
          >
            Peta Interaktif
          </Link>

          <Link
            href="/tentangKami"
            className="text-gray-700 font-semibold hover:text-[#7B0000] transition"
          >
            Tentang Kami
          </Link>

          <button
            onClick={() => setShowPopularWeek(true)}
            className="flex items-center gap-2 text-gray-700 font-semibold hover:text-[#7B0000] transition cursor-pointer"
          >
            <Star size={18} />
            Popular Week
          </button>
        </nav>
      </div>

      {/* AUTH BUTTON */}
      <div className="flex items-center gap-4">
        {!isAuthenticated ? (
          <Link
            href="/login"
            className="flex items-center gap-2 px-4 py-2 border border-[#7B0000] text-[#7B0000] rounded-full font-semibold hover:bg-[#7B0000] hover:text-white transition"
          >
            <LogIn size={18} />
            Login
          </Link>
        ) : (
          <>
            <Link
              href="/profile"
              className="flex items-center gap-2 px-5 py-2 bg-[#F8F3F1] border border-[#7B0000]/20 text-[#7B0000] rounded-full font-semibold hover:bg-[#7B0000] hover:text-white hover:shadow-md transition-all duration-300"
            >
              <User size={18} />
              {user?.user?.username}
            </Link>

            <button
              onClick={async () => {
                await logoutUser();
              }}
              className="cursor-pointer flex items-center gap-2 px-5 py-2 bg-[#7B0000] text-white rounded-full font-semibold hover:bg-[#8f1a1a] hover:scale-[1.04] active:scale-[0.97] hover:shadow-md transition-all duration-300 ease-out"
            >
              <LogOut size={18} />
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
}
