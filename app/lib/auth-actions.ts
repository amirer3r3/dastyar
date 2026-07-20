"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { createUser, isTeachingLevel } from "./users";

export type AuthFormState = {
  error?: string;
} | undefined;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isRedirectError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const digest = (err as { digest?: string }).digest;
  return (
    typeof digest === "string" &&
    (digest.startsWith("NEXT_REDIRECT") || digest.startsWith("NEXT_REDIRECT;"))
  );
}

export async function registerAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const teachingLevelRaw = String(formData.get("teachingLevel") ?? "").trim();

  if (name.length < 2) {
    return { error: "نام باید حداقل ۲ حرف باشد." };
  }
  if (!isValidEmail(email)) {
    return { error: "ایمیل معتبر نیست." };
  }
  if (password.length < 6) {
    return { error: "رمز عبور باید حداقل ۶ کاراکتر باشد." };
  }
  if (!isTeachingLevel(teachingLevelRaw)) {
    return { error: "مقطع تدریس را انتخاب کنید." };
  }

  try {
    await createUser({
      name,
      email,
      password,
      teachingLevel: teachingLevelRaw,
    });
  } catch (err) {
    if (err instanceof Error && err.message === "EMAIL_TAKEN") {
      return { error: "این ایمیل قبلاً ثبت شده است." };
    }
    if (err instanceof Error && err.message === "STORAGE_ERROR") {
      return {
        error:
          "ذخیره کاربر ممکن نیست. روی سرور آنلاین باید دیتابیس وصل شود؛ فعلاً روی localhost تست کنید.",
      };
    }
    console.error("register createUser failed:", err);
    return { error: "خطا در ثبت‌نام. دوباره تلاش کنید." };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    });
  } catch (err) {
    if (isRedirectError(err)) {
      throw err;
    }
    if (err instanceof AuthError) {
      return {
        error:
          "حساب ساخته شد ولی ورود خودکار نشد. از صفحه ورود وارد شوید.",
      };
    }
    throw err;
  }
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
    if (isRedirectError(err)) {
      throw err;
    }
    if (err instanceof AuthError) {
      return { error: "ایمیل یا رمز عبور اشتباه است." };
    }
    throw err;
  }
}

export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: "/login" });
}
