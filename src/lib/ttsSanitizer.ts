/**
 * Phonetic pre-processing for Vietnamese mechanical engineering terminology & formulas.
 * Turns LaTeX, technical abbreviations, and symbols into natural sounding Vietnamese prose.
 */
export function sanitizeMechanicalText(raw: string): string {
  if (!raw) return "";

  let text = raw;

  // 1. Remove Markdown formatting
  text = text.replace(/[*_#`~[\]]/g, " ");

  // 2. Technical engineering abbreviations
  text = text.replace(/\bEDM\b/gi, "E-D-M");
  text = text.replace(/\bLBM\b/gi, "L-B-M");
  text = text.replace(/\bECM\b/gi, "E-C-M");
  text = text.replace(/\bUSM\b/gi, "U-S-M");
  text = text.replace(/\bAJM\b/gi, "A-J-M");
  text = text.replace(/\bAWJ\b/gi, "A-W-J");
  text = text.replace(/\bTIG\b/gi, "Tíc");
  text = text.replace(/\bMIG\b/gi, "Míc");
  text = text.replace(/\bMAG\b/gi, "Mác");
  text = text.replace(/\bSMAW\b/gi, "hồ quang tay S-M-A-W");
  text = text.replace(/\bJIT\b/gi, "J-I-T");
  text = text.replace(/\bTPS\b/gi, "T-P-S");
  text = text.replace(/\bOEE\b/gi, "O-E-E");

  // 3. Lean / Industrial terms pronunciation
  text = text.replace(/\bTakt time\b/gi, "Tác time");
  text = text.replace(/\bLead time\b/gi, "Lít time");
  text = text.replace(/\bCycle time\b/gi, "Xai-cồ time");
  text = text.replace(/\bPoka-yoke\b/gi, "Pô-ka yô-kê");
  text = text.replace(/\bJidoka\b/gi, "Ji-đô-ka");
  text = text.replace(/\bKanban\b/gi, "Can-ban");
  text = text.replace(/\bKaizen\b/gi, "Cai-zen");
  text = text.replace(/\bAndon\b/gi, "An-đon");
  text = text.replace(/\bMuda\b/gi, "Mu-đa");

  // 4. Tolerances & surface finish symbols
  text = text.replace(/\\?\$?Ra\\?\$?/gi, "R a");
  text = text.replace(/\\?\$?Rz\\?\$?/gi, "R z");
  text = text.replace(/\\?\$?ES\\?\$?/g, "E S");
  text = text.replace(/\\?\$?EI\\?\$?/g, "E I");
  text = text.replace(/\\?\$?es\\?\$?/g, "e s nhỏ");
  text = text.replace(/\\?\$?ei\\?\$?/g, "e i nhỏ");
  text = text.replace(/\\?(?:Phi|phi|\$?\\Phi\$?|\$?\\phi\$?|Φ|φ)/g, "phi");

  // 5. Units & Dimensions
  text = text.replace(/(\d+)\s*(?:mm|mi-li-mét)\b/gi, "$1 mi-li-mét");
  text = text.replace(/(\d+)\s*(?:µm|um|micromet)\b/gi, "$1 mi-crô-mét");
  text = text.replace(/(\d+)\s*m\/phút\b/gi, "$1 mét trên phút");
  text = text.replace(/(\d+)\s*mm\/vòng\b/gi, "$1 mi-li-mét trên vòng");
  text = text.replace(/(\d+)\s*vòng\/phút\b/gi, "$1 vòng trên phút");
  text = text.replace(/(\d+)\s*(?:°C|ºC|do C)\b/gi, "$1 độ C");
  text = text.replace(/(\d+)\s*(?:°|º)\b/g, "$1 độ");
  text = text.replace(/(\d+)\s*-\s*(\d+)\s*độ\b/gi, "từ $1 đến $2 độ");

  // 6. Chemical formulas
  text = text.replace(/\bO2\b/gi, "Ô-xi");
  text = text.replace(/\bC2H2\b/gi, "A-xê-ti-len");
  text = text.replace(/\bCO2\b/gi, "C-O-2");

  // 7. Accuracy grades
  text = text.replace(/\bIT([0-9]{1,2})\b/gi, "cấp chính xác I-T $1");

  // 8. Clean leftover LaTeX and extra whitespace
  text = text.replace(/[{}\\]/g, " ");
  text = text.replace(/\s+/g, " ").trim();

  return text;
}

/**
 * Maps speed string (e.g. "1.0x", "1.25x", "0.8x") to Edge TTS rate percent
 */
export function mapSpeedToRate(speed?: string): string {
  if (!speed) return "default";
  if (speed.startsWith("+") || speed.startsWith("-")) return speed;

  switch (speed) {
    case "0.8x":
      return "-20%";
    case "1.0x":
      return "default";
    case "1.25x":
      return "+25%";
    case "1.5x":
      return "+50%";
    default:
      return "default";
  }
}
