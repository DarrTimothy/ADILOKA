"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/service/auth";
import { Eye, EyeOff } from "lucide-react";
import { isValidEmail, validatePassword } from "@/utils/validation";
import { useNotif } from "@/context/NotifContext";
import TermsModal from "@/components/ui/TermModal";

export default function RegisterPage() {
  const router = useRouter();
  const { showNotif } = useNotif();

  const [userName, setuserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const [isConfirmPasswordHidden, setIsConfirmPasswordHidden] = useState(true);
  const [agree, setAgree] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      showNotif(
        "Alamat email tidak valid. Silakan masukkan email dengan format yang benar.",
        "error",
      );
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      showNotif(passwordError, "error");
      return;
    }

    if (password !== confirmPassword) {
      showNotif("Password dan konfirmasi password tidak sama.", "error");
      return;
    }

    if (!agree) {
      showNotif(
        "Anda harus menyetujui syarat dan ketentuan serta kebijakan privasi.",
        "error",
      );
      return;
    }

    setLoading(true);

    try {
      await register({
        username: userName,
        email,
        password,
      });

      showNotif(
        "Pendaftaran berhasil! Selamat bergabung di Adiloka ✨",
        "success",
      );

      router.push("/login");
    } catch (err: any) {
      showNotif(
        err.message || "Terjadi kesalahan pada server. Silakan coba lagi.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      {/* Background Map Indonesia */}
      <div
        className="absolute inset-0 bg-center bg-no-repeat bg-cover"
        style={{
          backgroundImage: "url('/asset/Map-Indonesia.svg')",
        }}
      />
      <div className="absolute inset-0 backdrop-blur-sm bg-black/10" />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white rounded-xl shadow p-6 space-y-4"
        >
          <h1 className="text-3xl text-center font-bold mb-2 text-black">
            Bergabung dengan Kami
          </h1>
          <p className="text-gray-500 mb-8 text-center font-bold text-xl">
            Mulai perjalanan Anda mengenal budaya Indonesia
          </p>

          <div>
            <label className="text-sm font-medium text-black">Username</label>
            <input
              type="text"
              placeholder="Username"
              value={userName}
              onChange={(e) => setuserName(e.target.value)}
              required
              className="input-field"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-black">Email</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-black">Password</label>

            <div className="relative">
              <input
                type={isPasswordHidden ? "password" : "text"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-field pr-10"
              />

              <button
                type="button"
                onClick={() => setIsPasswordHidden((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                aria-label={
                  isPasswordHidden
                    ? "Tampilkan password"
                    : "Sembunyikan password"
                }
              >
                {isPasswordHidden ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-black">
              Konfirmasi Password
            </label>

            <div className="relative">
              <input
                type={isConfirmPasswordHidden ? "password" : "text"}
                placeholder="Konfirmasi Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="input-field pr-10"
              />

              <button
                type="button"
                onClick={() => setIsConfirmPasswordHidden((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                aria-label={
                  isConfirmPasswordHidden
                    ? "Tampilkan konfirmasi password"
                    : "Sembunyikan konfirmasi password"
                }
              >
                {isConfirmPasswordHidden ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="cursor-pointer mt-1"
            />
            <p className="text-gray-400">
              Saya setuju dengan{" "}
              <span
                onClick={() => setIsTermsOpen(true)}
                className="text-red-600 underline font-medium hover:text-red-800 transition-colors cursor-pointer"
              >
                syarat dan ketentuan
              </span>{" "}
              serta{" "}
              <span
                onClick={() => setIsTermsOpen(true)}
                className="text-red-600 underline font-medium hover:text-red-800 transition-colors cursor-pointer"
              >
                kebijakan privasi
              </span>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full bg-red-800 text-white py-2 rounded-md mt-2 hover:bg-red-900 disabled:opacity-60 transition-colors"
          >
            {loading ? "Mendaftarkan..." : "Register"}
          </button>
        </form>
      </div>

      {/* Render TermsModal di luar hierarki form */}
      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
    </div>
  );
}
