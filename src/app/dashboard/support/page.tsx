"use client";

import Link from "next/link";
import { ArrowLeft, Headphones } from "lucide-react";
import NovaSupportGrid from "@/components/nova/NovaSupportGrid";

export default function SupportPage() {
  return (
    <div className="nova-page-container">
      <div className="nova-page-header">
        <Link href="/dashboard" className="nova-back-btn">
          <ArrowLeft size={16} />
          <span>Về Dashboard</span>
        </Link>
        <h1 className="nova-page-title">
          <Headphones size={22} className="text-sky-400" />
          <span>Kênh Hỗ Trợ</span>
        </h1>
      </div>

      <div style={{ maxWidth: 540, margin: "0 auto" }}>
        <NovaSupportGrid />
      </div>
    </div>
  );
}
