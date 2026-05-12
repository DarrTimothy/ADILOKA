"use client"

import Link from "next/link";

export default function TentangKamiPage() {
  return (
    <div className="min-h-screen bg-[#f5f3ef] text-neutral-800">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-b-[60px] bg-[#d9d0c3]">
        <div
          className="h-[520px] w-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=2070&auto=format&fit=crop')",
          }}
        >
          <div className="flex h-full items-center justify-center bg-black/35 px-6 text-center">
            <div className="max-w-3xl text-white">
              <p className="mb-3 text-sm tracking-[0.3em] uppercase text-neutral-200">
                Tentang Adiloka
              </p>

              <h1 className="text-4xl font-bold leading-tight md:text-6xl">
                Menghubungkan Tradisi dengan Inovasi
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-neutral-200 md:text-base">
                Melestarikan kekayaan warisan tradisional Indonesia melalui
                teknologi interaktif untuk generasi muda yang lebih terhubung
                dengan akar budaya mereka.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VISI MISI */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-20 md:grid-cols-2">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#a33b2f]">
            Visi & Misi Kami
          </p>

          <h2 className="text-4xl font-bold leading-tight">
            Menjaga Warisan
            <br />
            Digital Indonesia
          </h2>

          <p className="mt-6 max-w-xl leading-8 text-neutral-600">
            Di era serba digital, pelestarian tradisi menjadi tantangan
            tersendiri. Kami hadir untuk menjembatani kesenjangan ini dengan
            menghadirkan cara baru memandang sejarah melalui basis teknologi
            modern.
          </p>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f0e9de] text-2xl">
              💡
            </div>

            <h3 className="text-xl font-semibold">Visi Kami</h3>

            <p className="mt-3 leading-7 text-neutral-600">
              Menjadi platform digital terdepan dalam edukasi budaya yang
              menginspirasi generasi muda untuk mencintai warisan bangsa.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f0e9de] text-2xl">
              🚀
            </div>

            <h3 className="text-xl font-semibold">Misi Kami</h3>

            <p className="mt-3 leading-7 text-neutral-600">
              Menghadirkan pengalaman interaktif melalui peta nusantara dan
              cerita perjalanan yang menyenangkan serta mudah diakses.
            </p>
          </div>
        </div>
      </section>

      {/* WHY SECTION */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold">Mengapa Melestarikan Budaya?</h2>
            <div className="mx-auto mt-4 h-1 w-28 rounded-full bg-[#a33b2f]" />
          </div>

          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Card 1 */}
            <div className="overflow-hidden rounded-3xl bg-[#f8f5f1] shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=1974&auto=format&fit=crop"
                alt="nilai sosial"
                className="h-56 w-full object-cover"
              />

              <div className="p-6">
                <h3 className="text-xl font-bold">📌 Nilai Sosial</h3>
                <p className="mt-3 leading-7 text-neutral-600">
                  Warisan tradisional bukan sekadar hiburan, namun juga sarana
                  pembentukan karakter budaya dan rasa cinta tanah air.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="overflow-hidden rounded-3xl bg-[#f8f5f1] shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1526481280695-3c4691f241ac?q=80&w=1974&auto=format&fit=crop"
                alt="kelangsungan fisik"
                className="h-56 w-full object-cover"
              />

              <div className="p-6">
                <h3 className="text-xl font-bold">🛠️ Kelangsungan Fisik</h3>
                <p className="mt-3 leading-7 text-neutral-600">
                  Aktivitas tradisional masih tersebar dan harus mulai
                  diarsipkan, agar nilainya tetap relevan untuk generasi
                  mendatang.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="overflow-hidden rounded-3xl bg-[#f8f5f1] shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1515169067868-5387ec356754?q=80&w=1974&auto=format&fit=crop"
                alt="identitas bangsa"
                className="h-56 w-full object-cover"
              />

              <div className="p-6">
                <h3 className="text-xl font-bold">🎭 Identitas Bangsa</h3>
                <p className="mt-3 leading-7 text-neutral-600">
                  Mengenal akar budaya sejak dini membantu generasi muda
                  menciptakan karakter yang kuat dan identitas nasional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl rounded-3xl bg-[#980909] px-8 py-16 text-center text-white shadow-lg">
          <h2 className="text-4xl font-bold">Siap Menjelajahi Nusantara?</h2>

          <p className="mx-auto mt-5 max-w-2xl leading-8 text-neutral-100">
            Mulai perjalanan Anda sekarang dengan peta interaktif kami dan
            temukan kekayaan budaya yang tersimpan di setiap sudut Indonesia.
          </p>

          <Link
            href="/"
            className="mt-8 inline-block rounded-2xl bg-white px-8 py-4 font-semibold text-[#980909] transition hover:scale-105 hover:bg-neutral-100"
          >
            Jelajahi Peta Sekarang →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-neutral-200 bg-[#f5f3ef]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-12 md:grid-cols-3">
          <div>
            <h3 className="text-xl font-bold">Adiloka</h3>
            <p className="mt-4 leading-7 text-neutral-600">
              Kanal edukasi interaktif untuk melestarikan budaya Indonesia
              melalui media digital.
            </p>
          </div>

          <div>
            <h4 className="font-semibold">Tentang Cepat</h4>
            <ul className="mt-4 space-y-3 text-neutral-600">
              <li>• Peta Interaktif</li>
              <li>• Tentang Kami</li>
              <li>• Blog Budaya</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">Ikuti Kami</h4>

            <div className="mt-4 flex items-center gap-4 text-2xl">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm transition hover:-translate-y-1">
                📷
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm transition hover:-translate-y-1">
                🎵
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm transition hover:-translate-y-1">
                ▶️
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
