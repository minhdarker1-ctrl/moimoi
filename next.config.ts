import type { NextConfig } from "next";

const config: NextConfig = {
  compress: true,
  poweredByHeader: false,
  serverExternalPackages: ["@prisma/client", "bcryptjs"],
  outputFileTracingExcludes: {
    "*": [
      "node_modules/@prisma/engines/**",
      "node_modules/prisma/**",
      "node_modules/@swc/**",
      "node_modules/typescript/**",
    ],
  },
  images: {
    // Ảnh seed hotlink từ site gốc; admin dán URL ảnh nên phải cho phép mọi https host.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default config;
