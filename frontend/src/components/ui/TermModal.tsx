"use client";

import { X } from "lucide-react";

type TermsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      {/* Backdrop Gelap Belakang */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Box Modal Utama */}
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-100 flex flex-col max-h-[85vh] z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-[#7B0000]">
            Syarat, Ketentuan & Kebijakan Privasi
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Isi Konten Dokumen (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-gray-600 leading-relaxed no-scrollbar">
          <p className="text-xs text-gray-400 italic">Terakhir diperbarui: Juni 2026</p>
          <p>
            Selamat datang di **Adiloka** (Platform Jelajah Nusantara & Gim Tradisional Indonesia). Dengan mendaftar dan menggunakan aplikasi ini, Anda dinyatakan memahami dan menyetujui seluruh aturan serta pengelolaan data yang tertera di bawah ini:
          </p>

          {/* ================= BAGIAN 1: SYARAT & KETENTUAN ================= */}
          <div className="space-y-3">
            <h4 className="text-base font-bold text-[#7B0000] border-b border-gray-100 pb-1">
              BAGIAN A: Syarat & Ketentuan Penggunaan
            </h4>
            
            <div>
              <h5 className="font-bold text-[#2B0A0A] mb-1">1. Akun Pengguna & Keamanan</h5>
              <p>Anda bertanggung jawab penuh untuk menjaga kerahasiaan kredensial login (email dan password) akun Anda. Platform berhak mengambil tindakan tegas atau menangguhkan akun jika ditemukan aktivitas manipulasi ilegal pada progress penjelajahan peta.</p>
            </div>

            <div>
              <h5 className="font-bold text-[#2B0A0A] mb-1">2. Hak Kekayaan Intelektual</h5>
              <p>Seluruh materi kebudayaan, deskripsi sejarah, visualisasi gim tradisional, dan interaktivitas komponen peta di dalam platform ini dilindungi oleh hak pelestarian budaya digital. Pengguna dilarang keras menyalin atau mengomersialkan aset data API platform tanpa izin tertulis.</p>
            </div>

            <div>
              <h5 className="font-bold text-[#2B0A0A] mb-1">3. Batasan Tanggung Jawab</h5>
              <p>Platform disediakan secara terbuka ("as is"). Kami selalu berusaha menjaga keakuratan data informasi sejarah nusantara, namun kami tidak bertanggung jawab atas kerugian teknis atau kegagalan penyimpanan data lokal akibat kendala koneksi internet pengguna.</p>
            </div>
          </div>

          {/* ================= BAGIAN 2: KEBIJAKAN PRIVASI ================= */}
          <div className="space-y-3 pt-2">
            <h4 className="text-base font-bold text-[#7B0000] border-b border-gray-100 pb-1">
              BAGIAN B: Kebijakan Privasi (Perlindungan Data)
            </h4>

            <div>
              <h5 className="font-bold text-[#2B0A0A] mb-1">1. Data yang Kami Kumpulkan</h5>
              <p>Kami mengumpulkan informasi identitas dasar yang Anda berikan secara sukarela saat pendaftaran, meliputi <strong>Nama Lengkap</strong> dan <strong>Alamat Email</strong>.</p>
            </div>

            <div>
              <h5 className="font-bold text-[#2B0A0A] mb-1">2. Penggunaan Data Aktivitas Peta</h5>
              <p>Sistem kami melacak dan menyimpan aktivitas interaksi pencarian serta penjelajahan provinsi Anda. Data ini digunakan semata-mata untuk mengkalkulasi persentase kemajuan pribadi Anda (*Progress Bar*) serta menyusun peringkat gim pada fitur statistik *Populer Minggu Ini*.</p>
            </div>

            <div>
              <h5 className="font-bold text-[#2B0A0A] mb-1">3. Keamanan & Jaminan Pihak Ketiga</h5>
              <p>Sesuai dengan regulasi UU Perlindungan Data Pribadi (UU PDP), kami berkomitmen penuh menjaga kerahasiaan data Anda. Adiloka menjamin bahwa data pribadi Anda tidak akan pernah dijual, disewakan, atau disalahgunakan kepada pihak pengiklan luar.</p>
            </div>
          </div>
        </div>

        {/* Footer Modal */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="py-2 px-6 bg-[#7B0000] hover:bg-[#5E0000] text-white font-semibold text-sm rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
          >
            Saya Setuju & Mengerti
          </button>
        </div>
      </div>
    </div>
  );
}