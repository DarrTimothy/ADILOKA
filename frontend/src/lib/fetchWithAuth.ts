function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(";").shift();
  }

  return "";
}

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const xsrfToken = getCookie("XSRF-TOKEN") || "";

  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.headers || {}),
      Accept: "application/json",
      "Content-Type": "application/json",

      "X-XSRF-TOKEN": decodeURIComponent(xsrfToken),
    },
  });

  if (response.status === 401) {
    console.error("401 Unauthorized:", url);

    localStorage.removeItem("user");

    window.location.href = "/login";

    throw new Error("Session expired");
  }

  return response;
}
