import fs from "fs";
import readline from "readline";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const sourceFile = "C:\\tmdev\\accttx\\GARENA.txt";
  if (!fs.existsSync(sourceFile)) {
    console.error(`File không tồn tại: ${sourceFile}`);
    process.exit(1);
  }

  console.log(`Đang đọc dữ liệu từ: ${sourceFile}...`);

  // Xóa 250 tài khoản mẫu ban đầu để nạp mới toàn bộ từ đầu
  console.log("Dọn dẹp các tài khoản cũ trong DB...");
  await prisma.gameAccount.deleteMany({ where: { game: "AOV" } });

  const fileStream = fs.createReadStream(sourceFile, { encoding: "utf-8" });
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const BATCH_SIZE = 2500;
  let batch: {
    game: string;
    username: string;
    password: string;
    rank: string;
    skins: number;
    champs: number;
    status: string;
    notes: string;
  }[] = [];

  let totalProcessed = 0;
  let totalInserted = 0;
  const startTime = Date.now();

  const ranks = ["Tinh Anh", "Kim Cương", "Bạch Kim", "Cao Thủ", "Vàng", "Trắng Thông Tin"];

  for await (const line of rl) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const parts = trimmed.split("|");
    if (parts.length >= 2) {
      const username = parts[0].trim();
      const password = parts.slice(1).join("|").trim();

      if (username && password) {
        batch.push({
          game: "AOV",
          username,
          password,
          rank: ranks[totalProcessed % ranks.length],
          skins: (totalProcessed % 40) + 10,
          champs: (totalProcessed % 50) + 15,
          status: "AVAILABLE",
          notes: "100% Trắng thông tin Garena",
        });
        totalProcessed++;

        if (batch.length >= BATCH_SIZE) {
          const res = await prisma.gameAccount.createMany({
            data: batch,
          });
          totalInserted += res.count;
          batch = [];

          const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(1);
          console.log(`Đã nạp: ${totalInserted.toLocaleString()} acc (${elapsedSec}s)...`);
        }
      }
    }
  }

  // Nạp mảng còn dư cuối cùng
  if (batch.length > 0) {
    const res = await prisma.gameAccount.createMany({
      data: batch,
    });
    totalInserted += res.count;
  }

  const totalTimeSec = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n🎉 HOÀN THÀNH: Đã nạp thành công ${totalInserted.toLocaleString()} tài khoản AOV vào cơ sở dữ liệu trong ${totalTimeSec}s!`);
}

main()
  .catch((e) => {
    console.error("Lỗi khi nạp dữ liệu:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
