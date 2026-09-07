import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const tracks = await db.musicTrack.findMany({
    where: { visible: true },
    orderBy: { order: "asc" },
    select: { id: true, youtubeId: true, title: true, artist: true },
  });
  return NextResponse.json(tracks);
}
