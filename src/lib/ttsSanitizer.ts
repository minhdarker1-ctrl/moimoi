/**
 * Phonetic pre-processing for Vietnamese mechanical engineering terminology & formulas.
 * Turns LaTeX, technical abbreviations, and symbols into natural sounding Vietnamese prose.
 */
export function sanitizeMechanicalText(raw: string): string {
  if (!raw) return "";

  let text = raw;

  // 1. Remove Markdown formatting
  text = text.replace(/[*_#`~[\]]/g, " ");

  // 2. Technical engineering abbreviations (Unicode word boundaries so accented Vietnamese words stay safe)
  text = text.replace(/(?<![\p{L}\p{N}_])EDM(?![\p{L}\p{N}_])/giu, "E-D-M");
  text = text.replace(/(?<![\p{L}\p{N}_])LBM(?![\p{L}\p{N}_])/giu, "L-B-M");
  text = text.replace(/(?<![\p{L}\p{N}_])ECM(?![\p{L}\p{N}_])/giu, "E-C-M");
  text = text.replace(/(?<![\p{L}\p{N}_])USM(?![\p{L}\p{N}_])/giu, "U-S-M");
  text = text.replace(/(?<![\p{L}\p{N}_])AJM(?![\p{L}\p{N}_])/giu, "A-J-M");
  text = text.replace(/(?<![\p{L}\p{N}_])AWJ(?![\p{L}\p{N}_])/giu, "A-W-J");
  text = text.replace(/(?<![\p{L}\p{N}_])TIG(?![\p{L}\p{N}_])/giu, "Tíc");
  text = text.replace(/(?<![\p{L}\p{N}_])MIG(?![\p{L}\p{N}_])/giu, "Míc");
  text = text.replace(/(?<![\p{L}\p{N}_])MAG(?![\p{L}\p{N}_])/giu, "Mác");
  text = text.replace(/(?<![\p{L}\p{N}_])SMAW(?![\p{L}\p{N}_])/giu, "hồ quang tay S-M-A-W");
  text = text.replace(/(?<![\p{L}\p{N}_])JIT(?![\p{L}\p{N}_])/giu, "J-I-T");
  text = text.replace(/(?<![\p{L}\p{N}_])TPS(?![\p{L}\p{N}_])/giu, "T-P-S");
  text = text.replace(/(?<![\p{L}\p{N}_])OEE(?![\p{L}\p{N}_])/giu, "O-E-E");

  // 3. Lean / Industrial terms pronunciation
  text = text.replace(/(?<![\p{L}\p{N}_])Takt time(?![\p{L}\p{N}_])/giu, "Tác time");
  text = text.replace(/(?<![\p{L}\p{N}_])Lead time(?![\p{L}\p{N}_])/giu, "Lít time");
  text = text.replace(/(?<![\p{L}\p{N}_])Cycle time(?![\p{L}\p{N}_])/giu, "Xai-cồ time");
  text = text.replace(/(?<![\p{L}\p{N}_])Poka-yoke(?![\p{L}\p{N}_])/giu, "Pô-ka yô-kê");
  text = text.replace(/(?<![\p{L}\p{N}_])Jidoka(?![\p{L}\p{N}_])/giu, "Ji-đô-ka");
  text = text.replace(/(?<![\p{L}\p{N}_])Kanban(?![\p{L}\p{N}_])/giu, "Can-ban");
  text = text.replace(/(?<![\p{L}\p{N}_])Kaizen(?![\p{L}\p{N}_])/giu, "Cai-zen");
  text = text.replace(/(?<![\p{L}\p{N}_])Andon(?![\p{L}\p{N}_])/giu, "An-đon");
  text = text.replace(/(?<![\p{L}\p{N}_])Muda(?![\p{L}\p{N}_])/giu, "Mu-đa");

  // 4. Tolerances & surface finish symbols (case-sensitive + Unicode boundaries so "tạo ra", "kiểm tra" are preserved)
  text = text.replace(/(?<![\p{L}\p{N}_])\\?\$?Ra\\?\$?(?![\p{L}\p{N}_])/gu, "R a");
  text = text.replace(/(?<![\p{L}\p{N}_])\\?\$?Rz\\?\$?(?![\p{L}\p{N}_])/gu, "R z");
  text = text.replace(/(?<![\p{L}\p{N}_])\\?\$?ES\\?\$?(?![\p{L}\p{N}_])/gu, "E S");
  text = text.replace(/(?<![\p{L}\p{N}_])\\?\$?EI\\?\$?(?![\p{L}\p{N}_])/gu, "E I");
  text = text.replace(/(?<![\p{L}\p{N}_])\\?\$?es\\?\$?(?![\p{L}\p{N}_])/gu, "e s nhỏ");
  text = text.replace(/(?<![\p{L}\p{N}_])\\?\$?ei\\?\$?(?![\p{L}\p{N}_])/gu, "e i nhỏ");
  text = text.replace(/\$?\\(?:Phi|phi)\$?|[Φφ]|(?<![\p{L}\p{N}_])\\?\$?[Pp]hi\\?\$?(?![\p{L}\p{N}_])/gu, "phi ");

  // 5. Units & Dimensions
  text = text.replace(/(\d+)\s*(?:mm|mi-li-mét)(?![\p{L}\p{N}_])/giu, "$1 mi-li-mét");
  text = text.replace(/(\d+)\s*(?:µm|um|micromet)(?![\p{L}\p{N}_])/giu, "$1 mi-crô-mét");
  text = text.replace(/(\d+)\s*m\/phút(?![\p{L}\p{N}_])/giu, "$1 mét trên phút");
  text = text.replace(/(\d+)\s*mm\/vòng(?![\p{L}\p{N}_])/giu, "$1 mi-li-mét trên vòng");
  text = text.replace(/(\d+)\s*vòng\/phút(?![\p{L}\p{N}_])/giu, "$1 vòng trên phút");
  text = text.replace(/(\d+)\s*(?:°C|ºC|do C)(?![\p{L}\p{N}_])/giu, "$1 độ C");
  text = text.replace(/(\d+)\s*(?:°|º)/gu, "$1 độ");
  text = text.replace(/(\d+)\s*-\s*(\d+)\s*độ(?![\p{L}\p{N}_])/giu, "từ $1 đến $2 độ");

  // 6. Chemical formulas
  text = text.replace(/(?<![\p{L}\p{N}_])O2(?![\p{L}\p{N}_])/giu, "Ô-xi");
  text = text.replace(/(?<![\p{L}\p{N}_])C2H2(?![\p{L}\p{N}_])/giu, "A-xê-ti-len");
  text = text.replace(/(?<![\p{L}\p{N}_])CO2(?![\p{L}\p{N}_])/giu, "C-O-2");

  // 7. Accuracy grades
  text = text.replace(/(?<![\p{L}\p{N}_])IT([0-9]{1,2})(?![\p{L}\p{N}_])/giu, "cấp chính xác I-T $1");

  // 8. Clean leftover LaTeX and extra whitespace
  text = text.replace(/[{}\\$]/g, " ");
  text = text.replace(/\s+/g, " ").trim();

  return text;
}
