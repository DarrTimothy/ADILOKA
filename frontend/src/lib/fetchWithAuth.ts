export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = localStorage.getItem("token");

  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },
  });

  if (response.status === 401) {
    console.error("401 Unauthorized:", url);
    localStorage.removeItem("token");
    
    throw new Error("UNAUTHORIZED");
  }

  return response;
}