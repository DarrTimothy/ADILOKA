"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Star, LogIn, LogOut, User, Menu, X } from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";
import { useAuth } from "@/context/AuthContext";
import { useNotif } from "@/context/NotifContext";

export default function Header() {
  const { setShowPopularWeek } = useSidebar();
  const { user, isAuthenticated, logoutUser } = useAuth();
  const { showNotif } = useNotif();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleLogout = async () => {
    try {
      setShowPopularWeek(false);
      await logoutUser();
      showNotif(
        "Anda telah keluar. Sampai jumpa di penjelajahan budaya berikutnya! 👋",
        "logout",
      );
      window.location.href = "/";
    } catch (error) {
      showNotif("Gagal melakukan keluar akun. Silakan coba lagi.", "error");
    }
  };

  return (
    <header className="relative bg-white shadow z-2000">
      <div className="flex items-center justify-between px-4 md:px-15 py-4">
        <div className="flex items-center gap-6 md:gap-15">
          <h1 className="text-xl font-bold text-gray-900">
            Adi<span className="text-red-600">Loka</span>
          </h1>

          <nav className="hidden md:flex text-md items-center gap-10">
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
              Popular Week
            </button>
          </nav>
        </div>

        {/* TAMPILAN CONTROLLER: DESKTOP */}
        <div className="hidden md:flex items-center gap-4">
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
                onClick={handleLogout}
                className="cursor-pointer flex items-center gap-2 px-5 py-2 bg-[#7B0000] text-white rounded-full font-semibold hover:bg-[#8f1a1a] hover:scale-[1.04] active:scale-[0.97] hover:shadow-md transition-all duration-300 ease-out"
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 text-gray-700 hover:text-[#7B0000] md:hidden transition cursor-pointer"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* TAMPILAN MENU: MOBILE RESPONSIVE */}
      <div
        className={`absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-xl transition-all duration-300 ease-in-out md:hidden overflow-hidden z-50
          ${isMenuOpen ? "max-h-100 opacity-100 py-4" : "max-h-0 opacity-0 pointer-events-none"}`}
      >
        <div className="flex flex-col px-6 gap-4">
          <Link
            href="/"
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-700 font-semibold py-2 border-b border-gray-50 hover:text-[#7B0000]"
          >
            Peta Interaktif
          </Link>

          <Link
            href="/tentangKami"
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-700 font-semibold py-2 border-b border-gray-50 hover:text-[#7B0000]"
          >
            Tentang Kami
          </Link>

          <button
            onClick={() => {
              setShowPopularWeek(true);
              setIsMenuOpen(false);
            }}
            className="flex items-center gap-2 text-gray-700 font-semibold py-2 border-b border-gray-50 hover:text-[#7B0000] text-left cursor-pointer w-full"
          >
            <Star size={18} />
            Popular Week
          </button>

          <div className="pt-2">
            {!isAuthenticated ? (
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border border-[#7B0000] text-[#7B0000] rounded-full font-semibold"
              >
                <LogIn size={18} />
                Login
              </Link>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-[#F8F3F1] border border-[#7B0000]/20 text-[#7B0000] rounded-full font-semibold"
                >
                  <User size={18} />
                  {user?.user?.username}
                </Link>

                <button
                  onClick={async () => {
                    setIsMenuOpen(false);
                    await handleLogout();
                  }}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-[#7B0000] text-white rounded-full font-semibold cursor-pointer"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
