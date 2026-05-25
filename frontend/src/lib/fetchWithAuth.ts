export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
) {
  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.headers || {}),
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (response.status === 401) {
    window.location.replace("/login");

    throw new Error("Session expired");
  }

  return response;
}