import "server-only";
import { promises as fs } from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import type { TeachingLevel } from "./teaching-levels";
import { isTeachingLevel } from "./teaching-levels";

export type { TeachingLevel } from "./teaching-levels";
export {
  teachingLevelLabels,
  teachingLevelOptions,
  isTeachingLevel,
} from "./teaching-levels";

export type StoredUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  teachingLevel?: TeachingLevel;
  isAdmin?: boolean;
  createdAt: string;
};

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  teachingLevel?: TeachingLevel;
  isAdmin?: boolean;
};

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

async function readUsers(): Promise<StoredUser[]> {
  try {
    const raw = await fs.readFile(USERS_FILE, "utf-8");
    return JSON.parse(raw) as StoredUser[];
  } catch {
    return [];
  }
}

async function writeUsers(users: StoredUser[]): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
  } catch (err) {
    console.error("writeUsers failed:", err);
    throw new Error("STORAGE_ERROR");
  }
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function getUserByEmail(
  email: string
): Promise<StoredUser | undefined> {
  const users = await readUsers();
  const target = normalizeEmail(email);
  return users.find((u) => u.email === target);
}

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
  teachingLevel: TeachingLevel;
}): Promise<PublicUser> {
  const users = await readUsers();
  const email = normalizeEmail(input.email);

  if (users.some((u) => u.email === email)) {
    throw new Error("EMAIL_TAKEN");
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const user: StoredUser = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    email,
    passwordHash,
    teachingLevel: input.teachingLevel,
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  await writeUsers(users);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    teachingLevel: user.teachingLevel,
    isAdmin: user.isAdmin === true,
  };
}

function toPublicUser(user: StoredUser): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    teachingLevel:
      user.teachingLevel && isTeachingLevel(user.teachingLevel)
        ? user.teachingLevel
        : undefined,
    isAdmin: user.isAdmin === true,
  };
}

export async function verifyCredentials(
  email: string,
  password: string
): Promise<PublicUser | null> {
  const user = await getUserByEmail(email);
  if (!user) return null;

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;

  return toPublicUser(user);
}

/** ساخت یا به‌روزرسانی کاربر ادمین از متغیر محیطی / مقادیر پیش‌فرض */
export async function ensureAdminUser(): Promise<PublicUser> {
  const email = normalizeEmail(
    process.env.ADMIN_EMAIL?.trim() || "admin@dastyar.ir"
  );
  const password = process.env.ADMIN_PASSWORD?.trim() || "Admin@123456";
  const name = process.env.ADMIN_NAME?.trim() || "مدیر سایت";
  const forcePassword =
    process.env.ADMIN_PASSWORD_FORCE?.trim() === "1" ||
    process.env.ADMIN_PASSWORD_FORCE?.trim() === "true";

  const users = await readUsers();
  const existing = users.find((u) => u.email === email);

  if (existing) {
    existing.isAdmin = true;
    existing.name = name;
    if (forcePassword) {
      existing.passwordHash = await bcrypt.hash(password, 10);
    }
    await writeUsers(users);
    return toPublicUser(existing);
  }

  const user: StoredUser = {
    id: crypto.randomUUID(),
    name,
    email,
    passwordHash: await bcrypt.hash(password, 10),
    isAdmin: true,
    teachingLevel: "elementary",
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  await writeUsers(users);
  return toPublicUser(user);
}

export async function isUserAdmin(userId: string): Promise<boolean> {
  const users = await readUsers();
  return users.some((u) => u.id === userId && u.isAdmin === true);
}
