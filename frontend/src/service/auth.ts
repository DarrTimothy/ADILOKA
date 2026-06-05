import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { AuthRoot, RegisterPayload, LoginPayload, MeRoot } from "@/type";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("API URL is not defined");
}

export async function register(payload: RegisterPayload): Promise<AuthRoot> {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data: AuthRoot = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Register gagal");
  }

  return data;
}

export async function login(payload: LoginPayload): Promise<AuthRoot> {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data: AuthRoot = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Login gagal");
  }

  localStorage.setItem("token", data.result.token);

  return data;
}

export async function logout() {
  const res = await fetchWithAuth(`${API_URL}/logout`, {
    method: "POST",
  });

  localStorage.removeItem("token");

  if (!res.ok) {
    throw new Error(`Logout gagal (${res.status})`);
  }
}

export async function getUser() {
  const res = await fetchWithAuth(`${API_URL}/me`, {
    method: "GET",
  });

  const data: MeRoot = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal mengambil data user");
  }

  return data.result;
}
