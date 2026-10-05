import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Checking AovConfig...");
  const existingConfig = await prisma.aovConfig.findUnique({ where: { id: 1 } });
  if (!existingConfig) {
    const defaultKeyType = await prisma.keyType.findFirst({ where: { enabled: true } });
    await prisma.aovConfig.create({
      data: {
        id: 1,
        title: "Tặng Nick Liên Quân Mobile Miễn Phí",
        description: "Kho tài khoản Liên Quân Garena trắng thông tin, cập nhật liên tục hàng ngày.",
        notice: "Mỗi người nhận 1 acc/lượt vượt link. Vui lòng đổi mật khẩu sau khi nhận.",
        requireKey: true,
        keyTypeId: defaultKeyType ? defaultKeyType.id : null,
        blindBoxEnabled: true,
      },
    });
    console.log("✅ Created default AovConfig.");
  }

  const existingCount = await prisma.gameAccount.count({ where: { game: "AOV" } });
  console.log(`Current AOV accounts count in DB: ${existingCount}`);

  if (existingCount >= 50) {
    console.log("DB already has enough accounts. Skipping initial seed.");
    return;
  }

  const sourceFile = "C:\\tmdev\\accttx\\GARENA.txt";
  if (!fs.existsSync(sourceFile)) {
    console.log(`Source file ${sourceFile} not found.`);
    return;
  }

  console.log(`Reading source file ${sourceFile}...`);
  const content = fs.readFileSync(sourceFile, "utf-8");
  const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);

  console.log(`Found ${lines.length} lines in file. Taking first 250 accounts...`);
  const sampleLines = lines.slice(0, 250);

  const ranks = ["Tinh Anh", "Kim Cương", "Bạch Kim", "Cao Thủ", "Vàng", "Trắng Thông Tin"];

  let inserted = 0;
  for (let i = 0; i < sampleLines.length; i++) {
    const line = sampleLines[i];
    const parts = line.split("|");
    if (parts.length >= 2) {
      const username = parts[0].trim();
      const password = parts.slice(1).join("|").trim();
      if (username && password) {
        const rank = ranks[i % ranks.length];
        const skins = Math.floor(Math.random() * 45) + 5;
        const champs = Math.floor(Math.random() * 50) + 10;
        await prisma.gameAccount.create({
          data: {
            game: "AOV",
            username,
            password,
            rank,
            skins,
            champs,
            status: "AVAILABLE",
            notes: "100% Trắng thông tin Garena",
          },
        });
        inserted++;
      }
    }
  }

  console.log(`✅ Successfully seeded ${inserted} AOV accounts into database!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
