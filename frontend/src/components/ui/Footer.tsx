import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-4 md:grid-cols-[2fr_1fr]">
        
        {/* Kolom 1 */}
        <div>
          <h2 className="mb-2 text-xl font-bold text-gray-800">
            Adiloka
          </h2>

          <p className="max-w-xl text-sm leading-relaxed text-gray-600">
            Adiloka adalah platform digital yang bertujuan untuk
            mendokumentasikan, memperkenalkan, dan melestarikan
            permainan tradisional Indonesia melalui teknologi
            interaktif agar tetap dikenal oleh generasi muda.
          </p>
        </div>

        {/* Kolom 2 */}
        <div>
          <h3 className="mb-3 text-md font-semibold text-gray-800">
            Tautan Cepat
          </h3>

          <ul className="font-bold space-y-3 text-sm text-gray-500">
            <li>
              <Link href="/" className="transition hover:text-[#980909]">
                Peta Interaktif
              </Link>
            </li>

            <li>
              <Link href="/tentangKami" className="hover:text-red-700">
                Tentang Kami
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t py-2 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Adiloka. All rights reserved.
      </div>
    </footer>
  );
}
