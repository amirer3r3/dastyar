"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { createUser } from "./users";

export type AuthFormState = {
  error?: string;
} | undefined;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function registerAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (name.length < 2) {
    return { error: "نام باید حداقل ۲ حرف باشد." };
  }
  if (!isValidEmail(email)) {
    return { error: "ایمیل معتبر نیست." };
  }
  if (password.length < 6) {
    return { error: "رمز عبور باید حداقل ۶ کاراکتر باشد." };
  }

  try {
    await createUser({ name, email, password });
  } catch (err) {
    if (err instanceof Error && err.message === "EMAIL_TAKEN") {
      return { error: "این ایمیل قبلاً ثبت شده است." };
    }
    return { error: "خطا در ثبت‌نام. دوباره تلاش کنید." };
  }

  await signIn("credentials", {
    email,
    password,
    redirectTo: "/",
  });
}

export async function loginAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!isValidEmail(email) || password.length === 0) {
    return { error: "ایمیل یا رمز عبور را کامل وارد کنید." };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "ایمیل یا رمز عبور اشتباه است." };
    }
    throw err;
  }
}

export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: "/login" });
}
