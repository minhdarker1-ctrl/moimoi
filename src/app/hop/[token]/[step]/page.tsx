import { headers } from "next/headers";
import { db } from "@/lib/db";
import { fingerprint } from "@/lib/crypto";
import { canHop, HOP_MESSAGES } from "@/lib/hop";
import { clientIp } from "@/lib/guard";
import HopClient from "./HopClient";

export const dynamic = "force-dynamic";

export default async function HopPage({
  params,
}: {
  params: Promise<{ token: string; step: string }>;
}) {
  const { token, step: stepRaw } = await params;
  const step = Number(stepRaw);

  if (!Number.isInteger(step) || step < 1) {
    return <HopClient type="error" message="Bước xác thực không hợp lệ." />;
  }

  const s = await db.keySession.findUnique({
    where: { token },
    include: { keyType: true, app: true },
  });
  if (!s) {
    return (
      <HopClient
        type="error"
        message="Phiên vượt link không tồn tại hoặc đã hết hạn. Vui lòng quay lại lấy key mới."
      />
    );
  }

  const h = await headers();
  const ip = clientIp(h);
  if (s.ipHash !== fingerprint(ip)) {
    return (
      <HopClient
        type="error"
        message="Thiết bị không trùng khớp với phiên ban đầu. Vui lòng quay lại lấy key trên chính thiết bị này."
      />
    );
  }

  let stepAt: number[] = [];
  try {
    const p = JSON.parse(s.stepAt);
    if (Array.isArray(p)) stepAt = p.filter((x): x is number => typeof x === "number");
  } catch {
    stepAt = [];
  }

  let hopUrls: string[] = [];
  try {
    const p = JSON.parse(s.hopUrls);
    if (Array.isArray(p)) hopUrls = p.filter((x): x is string => typeof x === "string");
  } catch {
    hopUrls = [];
  }

  const totalSteps = hopUrls.length;
  const now = Date.now();
  const lastAt = stepAt.at(-1) ?? 0;

  // Nếu user đã vượt qua bước này rồi (ví dụ bấm F5 hoặc back lại)
  if (s.step >= step) {
    const nextUrl = hopUrls[step];
    if (nextUrl) {
      return (
        <HopClient
          type="success"
          nextUrl={nextUrl}
          step={step}
          totalSteps={totalSteps}
          appName={s.app?.name || "Ứng dụng"}
        />
      );
    }
  }

  const check = canHop(
    {
      step: s.step,
      lastAt,
      expiresAt: s.expiresAt.getTime(),
      doneAt: s.doneAt ? s.doneAt.getTime() : null,
    },
    step,
    s.keyType.minSeconds,
    now,
  );

  if (!check.ok) {
    if (check.reason === "tooFast") {
      const elapsed = Math.max(0, now - lastAt);
      const remainingSeconds = Math.max(1, Math.ceil((s.keyType.minSeconds * 1000 - elapsed) / 1000));
      return (
        <HopClient
          type="too_fast"
          remainingSeconds={remainingSeconds}
          step={step}
          totalSteps={totalSteps}
          appName={s.app?.name || "Ứng dụng"}
        />
      );
    }
    return <HopClient type="error" message={HOP_MESSAGES[check.reason]} />;
  }

  const nextUrl = hopUrls[step];
  if (!nextUrl) {
    return <HopClient type="error" message="Không tìm thấy bước tiếp theo trong phiên." />;
  }

  // Cập nhật session đã qua bước này
  await db.keySession.update({
    where: { id: s.id },
    data: {
      step,
      stepAt: JSON.stringify([...stepAt, now]),
    },
  });

  return (
    <HopClient
      type="success"
      nextUrl={nextUrl}
      step={step}
      totalSteps={totalSteps}
      appName={s.app?.name || "Ứng dụng"}
    />
  );
}
