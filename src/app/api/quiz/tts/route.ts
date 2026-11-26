import { NextRequest, NextResponse } from "next/server";
import { sanitizeMechanicalText } from "@/lib/ttsSanitizer";
import { synthesizeWithGoogleTTS } from "@/lib/googleTts";

export const runtime = "nodejs";

function buildAudioResponse(buffer: Buffer) {
  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "audio/mpeg",
      "Content-Length": buffer.byteLength.toString(),
      "X-TTS-Provider": "google-tts",
      "Cache-Control": "public, max-age=604800, s-maxage=604800, stale-while-revalidate=86400, immutable",
    },
  });
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawText = searchParams.get("text") || "";

    if (!rawText.trim()) {
      return NextResponse.json({ error: "Missing text parameter" }, { status: 400 });
    }

    const cleanText = sanitizeMechanicalText(rawText);
    if (!cleanText) {
      return NextResponse.json({ error: "Text contains no readable content" }, { status: 400 });
    }

    const buffer = await synthesizeWithGoogleTTS(cleanText.slice(0, 1500));
    return buildAudioResponse(buffer);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal TTS synthesis error";
    console.error("[TTS API GET Error]:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawText = typeof body?.text === "string" ? body.text : "";

    if (!rawText.trim()) {
      return NextResponse.json({ error: "Missing text in body" }, { status: 400 });
    }

    const cleanText = sanitizeMechanicalText(rawText);
    if (!cleanText) {
      return NextResponse.json({ error: "Text contains no readable content" }, { status: 400 });
    }

    const buffer = await synthesizeWithGoogleTTS(cleanText.slice(0, 1500));
    return buildAudioResponse(buffer);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal TTS synthesis error";
    console.error("[TTS API POST Error]:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
