import { AuthRoot } from "@/type";

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL;

console.log("AUTH URL:", AUTH_URL);

if (!AUTH_URL) {
  throw new Error("AUTH URL is not defined");
}

interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

interface LoginPayload {
  username: string;
  password: string;
}

/**
 * Ambil CSRF Cookie Sanctum
 */
function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(";").shift();
  }

  return "";
}

export async function getCsrfCookie() {
  const response = await fetch(`${AUTH_URL}/sanctum/csrf-cookie`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Gagal mengambil CSRF cookie");
  }
}

/**
 * Register
 */
export async function register(payload: RegisterPayload): Promise<AuthRoot> {
  await getCsrfCookie();

  const res = await fetch(`${AUTH_URL}/register`, {
    method: "POST",
    credentials: "include",
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

/**
 * Login
 */
export async function login(payload: LoginPayload) {
  await getCsrfCookie();

  const xsrfToken = getCookie("XSRF-TOKEN") || "";

  const res = await fetch(`${AUTH_URL}/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-XSRF-TOKEN": decodeURIComponent(xsrfToken),
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Login gagal");
  }

  return data;
}

/**
 * Logout
 */
export async function logout() {
  const res = await fetch(`${AUTH_URL}/logout`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Logout gagal");
  }
}

/**
 * Ambil user login
 */
export async function getUser() {
  const res = await fetch(`${AUTH_URL}/api/user`, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}
