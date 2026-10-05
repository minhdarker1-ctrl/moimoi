import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const revalidate = 3600; // Cache 1 giờ ở Edge CDN

export async function GET() {
  const tracks = await db.musicTrack.findMany({
    where: { visible: true },
    orderBy: { order: "asc" },
    select: { id: true, youtubeId: true, title: true, artist: true },
  });
  return NextResponse.json(tracks, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
