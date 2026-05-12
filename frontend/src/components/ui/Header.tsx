"use client";

import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-15 py-4 bg-white shadow">
      <div className="flex items-center gap-15">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/asset/Logo-Adiloka.svg"
            alt="Logo Adiloka"
            width={60}
            height={60}
            priority
            className="object-contain"
          />
        </Link>

        {/* Navigation */}
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
        </nav>
      </div>
    </header>
  );
}
