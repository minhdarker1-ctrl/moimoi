import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const U = "https://vthangios.xyz";

async function main() {
  await db.site.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: "Văn Thắng iOS",
      iam: "Hi, i am",
      verified: true,
      avatarUrl: `${U}/uploads/intro/1785225956_f40be83fd24a69c4.jpeg`,
      avatarFrameUrl: `${U}/uploads/intro/1787761701_27566707d8893895.png`,
      typedLines: JSON.stringify(["Developer.", "Designer.", "Creator.", "Gamer."]),
      seoTitle: "Văn Thắng iOS",
      seoDescription:
        "Nền tảng cung cấp giải pháp công nghệ ios 5.0 giúp game thủ leo rank an toàn và hiệu quả.",
      seoKeywords: "vthangios, văn thắng ios",
      faviconUrl: `${U}/uploads/intro/1785223665_087e144254b7ed32.png`,
      ytChannelUrl: "https://youtube.com/@vthangios",
      ytBannerOn: true,
      footerText: "© Designer by Văn Thắng iOS 2026",
    },
  });

  await db.counter.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, total: 0 },
  });

  const socials = [
    { iconUrl: `${U}/uploads/social/1785226212_aaa04016c5aa7392.png`, url: "https://discord.gg/mUA5vf7mzT", order: 0 },
    { iconUrl: `${U}/uploads/social/1785226222_d9d79e31dfb0b49d.png`, url: "https://t.me/vthangios", order: 1 },
    { iconUrl: `${U}/uploads/social/1785226233_576f35dc9945948f.png`, url: "https://youtube.com/@vthangios", order: 2 },
  ];
  for (const s of socials) {
    const found = await db.social.findFirst({ where: { url: s.url } });
    if (!found) await db.social.create({ data: s });
  }

  let group = await db.group.findFirst({ where: { title: "APP" } });
  if (!group) group = await db.group.create({ data: { title: "APP", order: 0 } });

  const apps = [
    {
      name: "MENU AOV MAP V1",
      desc: "Cập Nhật Ngày 15/8",
      iconUrl: `${U}/uploads/apps/1785224151_22760a5eab01424b.jpeg`,
      bannerUrl: `${U}/uploads/previews/1785337074_943e1e8c0be1667c.jpeg`,
      platforms: ["ios"],
      downloadUrl: "https://tasksub.io/3adBaHe",
      getKeyUrl: "https://tasksub.io/UAh272",
    },
    {
      name: "MENU AOV MOD V2",
      desc: "Cập Nhật Ngày 17/8",
      iconUrl: `${U}/uploads/apps/1785228134_3e17a04f549f80df.jpeg`,
      bannerUrl: `${U}/uploads/previews/1786901061_e622aac119c7a413.jpeg`,
      platforms: ["ios"],
      downloadUrl: "https://tasksub.io/Rg7Mtif",
      getKeyUrl: "https://tasksub.io/Ojc4R",
    },
    {
      name: "MENU AOV MAP ADR",
      desc: "Cập Nhật Ngày 21/8",
      iconUrl: `${U}/uploads/apps/1787278805_050439021e9c26f6.jpeg`,
      bannerUrl: `${U}/uploads/previews/1787278805_0ac6e731799178c4.jpeg`,
      platforms: ["android"],
      downloadUrl: "https://tasksub.io/g6UV",
      getKeyUrl: "https://tasksub.io/YvONv",
    },
    {
      name: "HACK FREE FIRE VGAME 2",
      desc: "Hỗ Trợ iOS > 26.0 - 27.4",
      iconUrl: `${U}/uploads/apps/1787472840_dbe6940a0c883606.png`,
      bannerUrl: `${U}/uploads/previews/1787472941_b0413034221f1e05.jpeg`,
      platforms: ["ios"],
      downloadUrl: "https://tasksub.io/RyBBJ",
      getKeyUrl:
        "https://v5.ppapikey.xyz/get-api-link?tokenID=285&package_id=48359&username=zackaov",
    },
    {
      name: "MENU 8 BALL POOL",
      desc: "Cập Nhật Ngày 25/8",
      iconUrl: `${U}/uploads/apps/1787593860_1f9fac8e04af8db0.png`,
      bannerUrl: `${U}/uploads/previews/1787593860_4d963c3d60a9f8ab.jpeg`,
      platforms: ["ios"],
      downloadUrl: "https://tasksub.io/EOxIRwb",
      getKeyUrl: "https://authtool.app/get-key?code=687e2e90-e27b-411c-b810-26ff9f54d448",
    },
  ];

  for (const [i, a] of apps.entries()) {
    const found = await db.app.findFirst({ where: { name: a.name } });
    if (found) continue;
    await db.app.create({
      data: {
        groupId: group.id,
        name: a.name,
        desc: a.desc,
        iconUrl: a.iconUrl,
        bannerUrl: a.bannerUrl,
        previewUrls: JSON.stringify([a.bannerUrl]),
        platforms: JSON.stringify(a.platforms),
        downloadUrl: a.downloadUrl,
        getKeyUrl: a.getKeyUrl,
        order: i,
      },
    });
  }

  // Loại key mẫu: chưa gán cổng nào, admin tự thêm token rồi chọn thứ tự.
  const kt = await db.keyType.findFirst({ where: { name: "Key 24h" } });
  if (!kt) {
    await db.keyType.create({
      data: { name: "Key 24h", steps: 2, providerIds: "[]", ttlHours: 24, minSeconds: 8, maxUses: 1 },
    });
  }

  console.log("Seed xong.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
