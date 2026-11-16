import { NextRequest, NextResponse } from "next/server";
import { EdgeTTS } from "node-edge-tts";
import { sanitizeMechanicalText, mapSpeedToRate } from "@/lib/ttsSanitizer";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawText = searchParams.get("text") || "";
    const voice = searchParams.get("voice") || "vi-VN-HoaiMyNeural";
    const speed = searchParams.get("speed") || searchParams.get("rate") || "1.0x";

    if (!rawText.trim()) {
      return NextResponse.json({ error: "Missing text parameter" }, { status: 400 });
    }

    const cleanText = sanitizeMechanicalText(rawText);
    if (!cleanText) {
      return NextResponse.json({ error: "Text contains no readable content" }, { status: 400 });
    }

    // Truncate to reasonable max length (1500 chars) to prevent abuse
    const textToSynthesize = cleanText.slice(0, 1500);
    const rate = mapSpeedToRate(speed);

    // Initialize EdgeTTS
    const tts = new EdgeTTS({
      voice: voice === "vi-VN-NamMinhNeural" ? "vi-VN-NamMinhNeural" : "vi-VN-HoaiMyNeural",
      lang: "vi-VN",
      outputFormat: "audio-24khz-48kbitrate-mono-mp3",
      rate,
      timeout: 10000,
    });

    const chunks: Buffer[] = [];
    for await (const chunk of tts.streamAudio(textToSynthesize)) {
      if (Buffer.isBuffer(chunk)) {
        chunks.push(chunk);
      }
    }

    if (chunks.length === 0) {
      return NextResponse.json({ error: "No audio stream generated" }, { status: 502 });
    }

    const audioBuffer = Buffer.concat(chunks);

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString(),
        // Cache synthesized audio on CDN & Browser for 7 days
        "Cache-Control": "public, max-age=604800, s-maxage=604800, stale-while-revalidate=86400, immutable",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal TTS synthesis error";
    console.error("[TTS API Error]:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawText = body.text || "";
    const voice = body.voice || "vi-VN-HoaiMyNeural";
    const speed = body.speed || body.rate || "1.0x";

    if (!rawText.trim()) {
      return NextResponse.json({ error: "Missing text in body" }, { status: 400 });
    }

    const cleanText = sanitizeMechanicalText(rawText);
    const textToSynthesize = cleanText.slice(0, 1500);
    const rate = mapSpeedToRate(speed);

    const tts = new EdgeTTS({
      voice: voice === "vi-VN-NamMinhNeural" ? "vi-VN-NamMinhNeural" : "vi-VN-HoaiMyNeural",
      lang: "vi-VN",
      outputFormat: "audio-24khz-48kbitrate-mono-mp3",
      rate,
      timeout: 10000,
    });

    const chunks: Buffer[] = [];
    for await (const chunk of tts.streamAudio(textToSynthesize)) {
      if (Buffer.isBuffer(chunk)) {
        chunks.push(chunk);
      }
    }

    if (chunks.length === 0) {
      return NextResponse.json({ error: "No audio stream generated" }, { status: 502 });
    }

    const audioBuffer = Buffer.concat(chunks);

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString(),
        "Cache-Control": "public, max-age=604800, s-maxage=604800, stale-while-revalidate=86400, immutable",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal TTS synthesis error";
    console.error("[TTS API Error]:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
