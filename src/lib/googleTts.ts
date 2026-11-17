import https from "node:https";

/**
 * Split text into chunks fitting Google Translate TTS limits (~160 chars)
 * Prioritizes sentence boundaries (., !, ?, ;, newline followed by space), then commas, then word breaks.
 * Does not split decimal numbers like 0.5 or 1.25.
 */
export function splitTextIntoChunks(text: string, maxLen = 160): string[] {
  if (!text || !text.trim()) return [];

  const trimmed = text.trim();
  if (trimmed.length <= maxLen) {
    return [trimmed];
  }

  // Split by sentence terminators that are followed by whitespace or line breaks
  const rawSentences = trimmed.split(/(?<=[.!?;\n])\s+/);
  const chunks: string[] = [];
  let current = "";

  for (const raw of rawSentences) {
    const s = raw.trim();
    if (!s) continue;

    if (!current) {
      if (s.length <= maxLen) {
        current = s;
      } else {
        // Single sentence longer than maxLen -> split by comma or words
        const words = s.split(/\s+/);
        let sub = "";
        for (const w of words) {
          if ((sub + " " + w).trim().length <= maxLen) {
            sub = (sub ? sub + " " : "") + w;
          } else {
            if (sub.trim()) chunks.push(sub.trim());
            sub = w;
          }
        }
        if (sub.trim()) current = sub.trim();
      }
    } else {
      if ((current + " " + s).length <= maxLen) {
        current += " " + s;
      } else {
        chunks.push(current);
        if (s.length <= maxLen) {
          current = s;
        } else {
          // Split long sentence by words
          const words = s.split(/\s+/);
          let sub = "";
          for (const w of words) {
            if ((sub + " " + w).trim().length <= maxLen) {
              sub = (sub ? sub + " " : "") + w;
            } else {
              if (sub.trim()) chunks.push(sub.trim());
              sub = w;
            }
          }
          current = sub.trim();
        }
      }
    }
  }

  if (current.trim()) {
    chunks.push(current.trim());
  }

  return chunks;
}

/**
 * Fetch a single MP3 audio chunk from Google Translate TTS (vi)
 */
export function fetchGoogleTTSChunk(chunkText: string, lang = "vi"): Promise<Buffer> {
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
    chunkText
  )}&tl=${lang}&client=tw-ob`;

  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "*/*",
        },
        timeout: 5000,
      },
      (res) => {
        if (res.statusCode !== 200) {
          return reject(new Error(`Google TTS responded with status ${res.statusCode}`));
        }

        const dataChunks: Buffer[] = [];
        res.on("data", (c) => dataChunks.push(c));
        res.on("end", () => resolve(Buffer.concat(dataChunks)));
      }
    );

    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Google TTS request timed out"));
    });
  });
}

/**
 * Full synthesis using Google Translate TTS with automatic chunking & concatenation
 */
export async function synthesizeWithGoogleTTS(text: string): Promise<Buffer> {
  const chunks = splitTextIntoChunks(text);
  if (chunks.length === 0) {
    throw new Error("Text contains no speakable content");
  }

  const audioBuffers = await Promise.all(chunks.map((c) => fetchGoogleTTSChunk(c, "vi")));
  return Buffer.concat(audioBuffers);
}
