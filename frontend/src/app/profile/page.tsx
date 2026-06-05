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
    badgeColor = "bg-[#7B0000]/10 text-[#7B0000]";
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
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* CARD PROFILE */}
        <div className="relative overflow-hidden bg-linear-to-r from-[#7B0000] to-[#A52A2A] rounded-4xl p-8 shadow-xl text-white">
          <Image
            src="/asset/Map-Indonesia.svg"
            alt="Indonesia Map"
            fill
            priority
            className="object-contain opacity-[0.08] scale-[4.4] pointer-events-none"
          />
          <div className="relative z-10 flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold">
              {user.user.username.charAt(0).toUpperCase()}
            </div>

            <div>
              <h1 className="text-3xl font-bold">{user.user.username}</h1>

              <p className="text-white/80 mt-1">{user.user.email}</p>

              <div
                className={`mt-4 inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${badgeColor}`}
              >
                🧭 {level}
              </div>
            </div>
          </div>
        </div>

        {/* PROGRESS */}
        <div className="mt-8 bg-white rounded-4xl p-8 shadow-sm border border-[#7B0000]/10">
          <h2 className="text-2xl font-bold text-[#2B0A0A]">
            Progress Jelajah Nusantara
          </h2>

          <p className="text-gray-500 mt-2">
            Pantau perjalanan Anda menjelajahi permainan tradisional Indonesia.
          </p>

          <div className="grid grid-cols-3 gap-6 mt-8">
            <div className="bg-[#F9F4F1] rounded-2xl p-5 text-center">
              <p className="text-sm text-gray-500">Wilayah Selesai</p>

              <p className="text-3xl font-bold text-[#7B0000] mt-2">
                {user.progress.completed_regions}
              </p>
            </div>

            <div className="bg-[#F9F4F1] rounded-2xl p-5 text-center">
              <p className="text-sm text-gray-500">Total Wilayah</p>

              <p className="text-3xl font-bold text-[#7B0000] mt-2">
                {user.progress.total_regions}
              </p>
            </div>

            <div className="bg-[#F9F4F1] rounded-2xl p-5 text-center">
              <p className="text-sm text-gray-500">Progress</p>

              <p className="text-3xl font-bold text-[#7B0000] mt-2">
                {user.progress.percentage}%
              </p>
            </div>
          </div>

          {/* PROGRESS BAR */}
          <div className="mt-8">
            <div className="flex justify-between mb-2">
              <span className="font-medium text-gray-700">
                Kemajuan Jelajah
              </span>

              <span className="font-bold text-[#7B0000]">
                {user.progress.percentage}%
              </span>
            </div>

            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
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
