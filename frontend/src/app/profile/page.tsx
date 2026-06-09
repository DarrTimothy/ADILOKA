"use client";

import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { Compass } from "lucide-react";

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Memuat profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Anda belum login</p>
      </div>
    );
  }

  const percentage = user.progress.percentage;

  let level = "Pemula";
  let badgeColor = "bg-gray-100 text-gray-700";

  if (percentage >= 25) {
    level = "Penjelajah";
    badgeColor = "bg-amber-100 text-amber-700";
  }

  if (percentage >= 50) {
    level = "Pelestari Budaya";
    badgeColor = "bg-green-100 text-green-700";
  }

  if (percentage >= 75) {
    level = "Maestro Nusantara";
    badgeColor = "bg-[#7B0000] text-[#7B0000]";
  }

  return (
    <div className="relative min-h-screen bg-[#F8F6F3] overflow-hidden">
      <div className="absolute top-0 left-0 w-125 h-125 bg-[#7B0000]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-100 h-100 bg-[#A52A2A]/5 rounded-full blur-3xl" />
      <Image
        src="/asset/Map-Indonesia.svg"
        alt=""
        fill
        priority
        className="object-contain opacity-[0.09] pointer-events-none scale-[2.5]"
      />

      {/* Responsivitas Padding Container Utama */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-10">
        {/* CARD PROFILE */}
        {/* Mengubah rounded-4xl menjadi rounded-2xl di mobile agar tidak terlalu melengkung ekstrem */}
        <div className="relative overflow-hidden bg-linear-to-r from-[#7B0000] to-[#A52A2A] rounded-2xl md:rounded-4xl p-6 md:p-8 shadow-xl text-white">
          <Image
            src="/asset/Map-Indonesia.svg"
            alt="Indonesia Map"
            fill
            priority
            className="object-contain opacity-[0.08] scale-[4.4] pointer-events-none"
          />
          {/* Di mobile susunan menjadi flex-col & items-center (tengah), di desktop md:flex-row & items-center */}
          <div className="relative z-10 flex flex-col md:flex-row items-center text-center md:text-left gap-4 md:gap-6">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/20 flex items-center justify-center text-3xl md:text-4xl font-bold shrink-0">
              {user.user.username.charAt(0).toUpperCase()}
            </div>

            {/* Mengatur layout flex agar isi teks membungkus dengan rapi */}
            <div className="flex flex-col items-center md:items-start">
              <h1 className="text-2xl md:text-3xl font-bold break-all">
                {user.user.username}
              </h1>

              <p className="text-white/80 mt-1 text-sm md:text-base break-all">
                {user.user.email}
              </p>

              <div
                className={`mt-4 inline-flex items-center px-4 py-2 rounded-full text-xs md:text-sm font-semibold ${badgeColor}`}
              >
                <Compass size={16} className="mr-1.5 shrink-0" /> {level}
              </div>
            </div>
          </div>
        </div>

        {/* PROGRESS CARD */}
        <div className="mt-6 md:mt-8 bg-white rounded-2xl md:rounded-4xl p-6 md:p-8 shadow-sm border border-[#7B0000]/10">
          <h2 className="text-xl md:text-2xl font-bold text-[#2B0A0A]">
            Progress Jelajah Nusantara
          </h2>

          <p className="text-sm md:text-base text-gray-500 mt-2">
            Pantau perjalanan Anda menjelajahi permainan tradisional Indonesia.
          </p>

          {/* PROGRESS BOX STATS */}
          {/* Di mobile bertumpuk kebawah (grid-cols-1), di desktop kembali menyamping (md:grid-cols-3) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-6 md:mt-8">
            <div className="bg-[#F9F4F1] rounded-2xl p-4 md:p-5 text-center flex md:flex-col justify-between md:justify-center items-center md:items-center px-5 md:px-4">
              <p className="text-xs md:text-sm text-gray-500">
                Wilayah Selesai
              </p>
              <p className="text-2xl md:text-3xl font-bold text-[#7B0000] md:mt-2">
                {user.progress.completed_regions}
              </p>
            </div>

            <div className="bg-[#F9F4F1] rounded-2xl p-4 md:p-5 text-center flex md:flex-col justify-between md:justify-center items-center md:items-center px-5 md:px-4">
              <p className="text-xs md:text-sm text-gray-500">Total Wilayah</p>
              <p className="text-2xl md:text-3xl font-bold text-[#7B0000] md:mt-2">
                {user.progress.total_regions}
              </p>
            </div>

            <div className="bg-[#F9F4F1] rounded-2xl p-4 md:p-5 text-center flex md:flex-col justify-between md:justify-center items-center md:items-center px-5 md:px-4">
              <p className="text-xs md:text-sm text-gray-500">Progress</p>
              <p className="text-2xl md:text-3xl font-bold text-[#7B0000] md:mt-2">
                {user.progress.percentage}%
              </p>
            </div>
          </div>

          {/* PROGRESS BAR */}
          <div className="mt-6 md:mt-8">
            <div className="flex justify-between mb-2 text-sm md:text-base">
              <span className="font-medium text-gray-700">
                Kemajuan Jelajah
              </span>
              <span className="font-bold text-[#7B0000]">
                {user.progress.percentage}%
              </span>
            </div>

            <div className="h-3 md:h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#7B0000] transition-all duration-700"
                style={{
                  width: `${user.progress.percentage}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
