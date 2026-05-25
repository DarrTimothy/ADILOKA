export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function validatePassword(password: string): string | null {
  if (password.length < 7) {
    return "Password harus terdiri dari minimal 7 karakter.";
  }

  if (!/[A-Z]/.test(password)) {
    return "Password harus mengandung minimal satu huruf kapital.";
  }

  return null;
}