"use client";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white shadow">
      <h1 className="text-xl font-bold text-[#7B0000]">
        TradisiPlay
      </h1>

      <nav className="flex items-center gap-6">
        <a className="text-gray-700 hover:text-[#7B0000]">Peta</a>
        <a className="text-gray-700 hover:text-[#7B0000]">Permainan</a>
        <a className="text-gray-700 hover:text-[#7B0000]">Tentang</a>

        <button className="ml-4 px-6 py-2 rounded-md bg-[#7B0000] text-white hover:bg-[#5A0000] transition">
          Mulai Belajar →
        </button>
      </nav>
    </header>
  );
}
