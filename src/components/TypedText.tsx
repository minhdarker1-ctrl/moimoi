"use client";

import { useEffect, useRef, useState } from "react";

export default function TypedText({ lines }: { lines: string[] }) {
  const [text, setText] = useState("");
  const state = useRef({ i: 0, c: 0, del: false });

  useEffect(() => {
    if (lines.length === 0) return;
    let timer: ReturnType<typeof setTimeout>;

    function tick() {
      const s = state.current;
      const line = lines[s.i % lines.length];

      if (!s.del) {
        s.c++;
        setText(line.slice(0, s.c));
        if (s.c === line.length) {
          s.del = true;
          timer = setTimeout(tick, 2000); // dừng đọc xong 1 dòng
          return;
        }
      } else {
        s.c--;
        setText(line.slice(0, s.c));
        if (s.c === 0) {
          s.del = false;
          s.i++;
        }
      }
      timer = setTimeout(tick, s.del ? 50 : 100);
    }

    timer = setTimeout(tick, 100);
    return () => clearTimeout(timer);
  }, [lines]);

  return <span className="vthangios-gradient-text">{text}</span>;
}
