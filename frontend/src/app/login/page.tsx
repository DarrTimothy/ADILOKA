"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { login } from "@/service/auth";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setLoading(true);

    try {
      await login({
        username,
        password,
      });

      router.push("/");
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      {/* Background */}
      <div
        className="absolute inset-0 bg-center bg-no-repeat bg-cover"
        style={{
          backgroundImage: "url('/asset/Map-Indonesia.svg')",
        }}
      />
      <div className="absolute inset-0 backdrop-blur-sm bg-black/10" />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md bg-white rounded-xl shadow p-6 space-y-4"
        >
          <h1 className="text-3xl font-bold mb-2 text-center text-black">
            Selamat Datang Di Adiloka
          </h1>
          <p className="text-gray-500 mb-8 text-center text-bold text-xl">
            Masuk untuk melanjutkan perjalanan Anda
          </p>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div>
            <label className="text-sm font-medium text-black">Username</label>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              >
                {isPasswordHidden ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full bg-red-800 text-white py-2 rounded-md mt-2 hover:bg-red-900 disabled:opacity-60"
          >
            {loading ? "Masuk..." : "Login"}
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            Belum punya akun?{" "}
            <span
              onClick={() => router.push("/register")}
              className="text-red-600 underline cursor-pointer"
            >
              Daftar di sini
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
