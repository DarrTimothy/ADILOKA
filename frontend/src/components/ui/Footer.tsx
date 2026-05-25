import Link from "next/link";
import { FaInstagram, FaYoutube, FaGlobe } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
        
        {/* Kolom 1 */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">
            Adiloka
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Kami adalah inisiatif digital untuk mendokumentasikan dan
            mempopulerkan kembali permainan tradisional Indonesia
            agar tetap dikenal oleh generasi muda.
          </p>
        </div>

        {/* Kolom 2 */}
        <div>
          <h3 className="text-md font-semibold text-gray-800 mb-3">
            Tautan Cepat
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-red-700">
                Peta Interaktif
              </Link>
            </li>
            <li>
              <Link href="/tentang" className="hover:text-red-700">
                Tentang Kami
              </Link>
            </li>
          </ul>
        </div>

        {/* Kolom 3 */}
        <div>
          <h3 className="text-md font-semibold text-gray-800 mb-3">
            Ikuti Kami
          </h3>
          <div className="flex gap-3">
            <a
              href="#"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow hover:bg-red-100"
            >
              <FaGlobe />
            </a>
            <a
              href="#"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow hover:bg-red-100"
            >
              <FaYoutube />
            </a>
            <a
              href="#"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow hover:bg-red-100"
            >
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="text-center text-sm text-gray-500 py-4 border-t">
        © {new Date().getFullYear()} Adiloka. All rights reserved.
      </div>
    </footer>
  );
}