#!/usr/bin/env node
// Sinh bcrypt hash cho ADMIN_PASSWORD_HASH.
// Dùng: node scripts/hash-password.mjs "mat-khau"
import bcrypt from "bcryptjs";

const pw = process.argv[2];
if (!pw || pw.length < 8) {
  console.error("Cần mật khẩu >= 8 ký tự.\nDùng: node scripts/hash-password.mjs \"mat-khau\"");
  process.exit(1);
}
const hash = bcrypt.hashSync(pw, 12);

// File .env chạy qua dotenv-expand: "$2b$12$" bị hiểu là biến môi trường và bị xoá,
// nên phải escape. Vercel dashboard KHÔNG qua dotenv — dán bản escape vào đó sẽ sai.
console.log("\n[1] File .env dưới máy — dán nguyên dòng này:\n");
console.log(`ADMIN_PASSWORD_HASH="${hash.replace(/\$/g, "\\$")}"`);
console.log("\n[2] Vercel / Neon / dashboard — dán đúng giá trị này, KHÔNG có dấu \\:\n");
console.log(hash);
console.log("");

