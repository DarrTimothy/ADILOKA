"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/service/auth";
import { Eye, EyeOff } from "lucide-react";
import { isValidEmail, validatePassword } from "@/utils/validation";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const [isConfirmPasswordHidden, setIsConfirmPasswordHidden] = useState(true);
  const [agree, setAgree] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Email validation
    if (!isValidEmail(email)) {
      setError(
        "Alamat email tidak valid. Silakan masukkan email dengan format yang benar.",
      );
      return;
    }

    // 2. Password rule validation
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    // 3. Confirm password
    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak sama.");
      return;
    }

    // 4. Agreement
    if (!agree) {
      setError(
        "Anda harus menyetujui syarat dan ketentuan serta kebijakan privasi.",
      );
      return;
    }

    setLoading(true);

    try {
      await register({
        username: fullName,
        email,
        password,
      });

      router.push("/");
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan. Silakan coba lagi.");
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
          <p className="text-gray-500 mb-8 text-center text-bold text-xl">
            Mulai perjalanan Anda mengenal budaya Indonesia
          </p>
          {error && <p className="text-sm text-red-600">{error}</p>}

          <div>
            <label className="text-sm font-medium text-black">
              Nama Lengkap
            </label>
            <input
              type="text"
              placeholder="Nama Lengkap"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
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
              <span className="text-red-600 underline cursor-pointer">
                syarat dan ketentuan
              </span>{" "}
              serta{" "}
              <span className="text-red-600 underline cursor-pointer">
                kebijakan privasi
              </span>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full bg-red-800 text-white py-2 rounded-md mt-2 hover:bg-red-900 disabled:opacity-60"
          >
            {loading ? "Mendaftarkan..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
