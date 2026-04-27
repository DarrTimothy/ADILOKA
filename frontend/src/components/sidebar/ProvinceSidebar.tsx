"use client";

export default function ProvinceSidebar() {
  return (
    <aside className="w-80 bg-white border-r p-5">
      <h2 className="text-lg font-semibold text-[#7B0000]">
        Jawa Barat
      </h2>

      <p className="text-sm text-gray-500 mb-4">
        5 Permainan Tradisional
      </p>

      <div className="space-y-4">
        <div className="border rounded-lg p-4 hover:shadow transition">
          <h3 className="font-semibold">Egrang</h3>
          <p className="text-xs text-gray-500">Fisik • Kelompok</p>

          <button className="mt-3 text-sm text-[#7B0000] font-medium">
            Lihat Detail →
          </button>
        </div>

        <div className="border rounded-lg p-4 hover:shadow transition">
          <h3 className="font-semibold">Congklak</h3>
          <p className="text-xs text-gray-500">Strategi</p>

          <button className="mt-3 text-sm text-[#7B0000] font-medium">
            Lihat Detail →
          </button>
        </div>
      </div>
    </aside>
  );
}
