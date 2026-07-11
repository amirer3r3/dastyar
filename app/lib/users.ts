import "server-only";
import { promises as fs } from "fs";
import path from "path";
import bcrypt from "bcryptjs";

export type StoredUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

export type PublicUser = Pick<StoredUser, "id" | "name" | "email">;

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
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
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
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  await writeUsers(users);

  return { id: user.id, name: user.name, email: user.email };
}

export async function verifyCredentials(
  email: string,
  password: string
): Promise<PublicUser | null> {
  const user = await getUserByEmail(email);
  if (!user) return null;

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;

  return { id: user.id, name: user.name, email: user.email };
}
