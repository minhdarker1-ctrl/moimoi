import { NextRequest, NextResponse } from "next/server";
import { EdgeTTS } from "node-edge-tts";
import { sanitizeMechanicalText, mapSpeedToRate } from "@/lib/ttsSanitizer";
import { synthesizeWithGoogleTTS } from "@/lib/googleTts";

export const runtime = "nodejs";

/**
 * Synthesize with Edge TTS (timeout 4500ms) with seamless fallback to Google Vietnamese TTS
 */
async function synthesizeAudio(
  text: string,
  voice: string,
  speed: string
): Promise<{ buffer: Buffer; provider: "edge-tts" | "google-tts-fallback" }> {
  const rate = mapSpeedToRate(speed);

  try {
    const tts = new EdgeTTS({
      voice: voice === "vi-VN-NamMinhNeural" ? "vi-VN-NamMinhNeural" : "vi-VN-HoaiMyNeural",
      lang: "vi-VN",
      outputFormat: "audio-24khz-48kbitrate-mono-mp3",
      rate,
      timeout: 4500, // 4.5s timeout to prevent serverless function hangs
    });

    const chunks: Buffer[] = [];
    for await (const chunk of tts.streamAudio(text)) {
      if (Buffer.isBuffer(chunk)) {
        chunks.push(chunk);
      }
    }

    if (chunks.length > 0) {
      return {
        buffer: Buffer.concat(chunks),
        provider: "edge-tts",
      };
    }
    throw new Error("Edge TTS returned 0 chunks");
  } catch (edgeError) {
    console.warn(
      "[TTS API] Edge TTS failed or timed out, switching to Google Vietnamese TTS fallback:",
      edgeError instanceof Error ? edgeError.message : edgeError
    );

    // Instant Google Vietnamese TTS fallback
    const googleBuffer = await synthesizeWithGoogleTTS(text);
    return {
      buffer: googleBuffer,
      provider: "google-tts-fallback",
    };
  }
}

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

    const textToSynthesize = cleanText.slice(0, 1500);
    const { buffer, provider } = await synthesizeAudio(textToSynthesize, voice, speed);

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": buffer.byteLength.toString(),
        "X-TTS-Provider": provider,
        // Cache synthesized audio on CDN & Browser for 7 days
        "Cache-Control": "public, max-age=604800, s-maxage=604800, stale-while-revalidate=86400, immutable",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal TTS synthesis error";
    console.error("[TTS API GET Error]:", message);
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
    if (!cleanText) {
      return NextResponse.json({ error: "Text contains no readable content" }, { status: 400 });
    }

    const textToSynthesize = cleanText.slice(0, 1500);
    const { buffer, provider } = await synthesizeAudio(textToSynthesize, voice, speed);

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": buffer.byteLength.toString(),
        "X-TTS-Provider": provider,
        "Cache-Control": "public, max-age=604800, s-maxage=604800, stale-while-revalidate=86400, immutable",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal TTS synthesis error";
    console.error("[TTS API POST Error]:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
