/**
 * ایجاد / به‌روزرسانی کاربر ادمین
 * اجرا: npm run seed:admin
 */
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const email = (process.env.ADMIN_EMAIL || "admin@dastyar.ir").trim().toLowerCase();
const password = (process.env.ADMIN_PASSWORD || "Admin@123456").trim();
const name = (process.env.ADMIN_NAME || "مدیر سایت").trim();
const force =
  process.env.ADMIN_PASSWORD_FORCE === "1" ||
  process.env.ADMIN_PASSWORD_FORCE === "true";

const dir = path.join(process.cwd(), "data");
const file = path.join(dir, "users.json");

fs.mkdirSync(dir, { recursive: true });

let users = [];
try {
  users = JSON.parse(fs.readFileSync(file, "utf8"));
} catch {
  users = [];
}

const hash = bcrypt.hashSync(password, 10);
const i = users.findIndex((u) => u.email === email);

if (i >= 0) {
  users[i].isAdmin = true;
  users[i].name = name;
  if (force || !users[i].passwordHash) {
    users[i].passwordHash = hash;
  }
} else {
  users.push({
    id: crypto.randomUUID(),
    name,
    email,
    passwordHash: hash,
    isAdmin: true,
    teachingLevel: "elementary",
    createdAt: new Date().toISOString(),
  });
}

fs.writeFileSync(file, JSON.stringify(users, null, 2));
console.log("Admin ready:", email);
console.log("Password:", password);
console.log("Login at /login");
