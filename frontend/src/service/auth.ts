import { AuthRoot } from "@/type"

const API_URL = process.env.NEXT_PUBLIC_API_URL

if (!API_URL) {
  throw new Error("API URL is not defined")
}

interface RegisterPayload {
  username: string
  email: string
  password: string
}

export async function register(
  payload: RegisterPayload
): Promise<AuthRoot> {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  const data: AuthRoot = await res.json()

  if (!res.ok) {
    throw new Error(data.message || "Register gagal")
  }

  return data
}
