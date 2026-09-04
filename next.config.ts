import type { NextConfig } from "next";

const config: NextConfig = {
  images: {
    // Ảnh seed hotlink từ site gốc; admin dán URL ảnh nên phải cho phép mọi https host.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default config;
