import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function obfuscateEmailMiddleCharacters(
  email: string,
  obscurePercentage = 0.6
): string {
  const emailLength = email.length;
  const obscureCount = Math.floor(emailLength * obscurePercentage);
  const start = Math.floor((emailLength - obscureCount) / 2);
  const end = start + obscureCount;
  const obscuredMiddle = "*".repeat(obscureCount);
  return (
    email.charAt(0).toUpperCase() + // Capitalize the first character
    email.substring(1, start) + // Keep the characters before the obscured part
    obscuredMiddle + // Add the obscured middle characters
    email.substring(end) // Add the remaining characters after the obscured part
  );
}

export function isEmail(text: string): boolean {
  // Regular expression for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(text);
}
