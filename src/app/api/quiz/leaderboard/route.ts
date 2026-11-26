import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/guard";
import { LeaderboardSubmitPayload } from "@/types/leaderboard";
import { sanitizeUserName, validateLeaderboardPayload } from "@/lib/leaderboardUtils";
import { QUIZ_TOPICS } from "@/data/quizBank";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("mode") || "exam";
    const topicId = searchParams.get("topicId") || "all";
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "50", 10), 1), 100);

    const where: Record<string, string> = {};
    if (mode && mode !== "all") {
      where.mode = mode;
    }
    if (topicId && topicId !== "all") {
      where.topicId = topicId;
    }

    const [records, totalCount] = await Promise.all([
      db.quizLeaderboard.findMany({
        where,
        orderBy: [
          { scorePercentage: "desc" },
          { timeSpentSeconds: "asc" },
          { createdAt: "desc" },
        ],
        take: limit,
      }),
      db.quizLeaderboard.count({ where }),
    ]);

    const formattedRecords = records.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    }));

    return NextResponse.json(
      {
        success: true,
        records: formattedRecords,
        totalCount,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=10, stale-while-revalidate=30",
        },
      }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Database fetch error";
    console.error("[Leaderboard GET Error]:", message);
    return NextResponse.json(
      {
        success: false,
        records: [],
        totalCount: 0,
        error: message,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req);
    if (await rateLimit("quiz-leaderboard", ip, 15, 60_000)) {
      return NextResponse.json(
        { success: false, error: "Bạn gửi kết quả quá nhanh, vui lòng thử lại sau." },
        { status: 429 }
      );
    }

    const body: LeaderboardSubmitPayload = await req.json().catch(() => ({}));
    const validation = validateLeaderboardPayload(body);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error || "Dữ liệu không hợp lệ" },
        { status: 400 }
      );
    }

    const cleanName = sanitizeUserName(body.userName);
    const total = Math.min(Math.max(Math.round(Number(body.totalQuestions)), 1), 500);
    const correct = Math.min(Math.max(Math.round(Number(body.correctCount)), 0), total);
    const scorePct = Math.round((correct / total) * 100);
    const timeSpent = Math.min(Math.max(Math.round(Number(body.timeSpentSeconds)), 1), 86_400);
    const mode = ["exam", "practice", "flashcard"].includes(body.mode) ? body.mode : "exam";

    const rawTopicId = typeof body.topicId === "string" ? body.topicId : "all";
    const matchedTopic = QUIZ_TOPICS.find((t) => t.id === rawTopicId);
    const specialTopics: Record<string, string> = {
      all: "Toàn Bộ Ngân Hàng",
      bookmarks: "Câu Hỏi Đánh Dấu",
      mistakes: "Sổ Tay Lỗi Sai",
    };
    const topicId = matchedTopic ? matchedTopic.id : rawTopicId in specialTopics ? rawTopicId : "all";
    const topicTitle = matchedTopic?.title || specialTopics[topicId] || "Toàn Bộ Ngân Hàng";

    // Insert record into Neon PostgreSQL
    const newRecord = await db.quizLeaderboard.create({
      data: {
        userName: cleanName,
        scorePercentage: scorePct,
        correctCount: correct,
        totalQuestions: total,
        timeSpentSeconds: timeSpent,
        mode,
        topicId,
        topicTitle,
      },
    });

    // Calculate current rank in this mode & topic
    const whereScope: Record<string, string> = { mode };
    if (topicId !== "all") {
      whereScope.topicId = topicId;
    }

    const betterCount = await db.quizLeaderboard.count({
      where: {
        ...whereScope,
        OR: [
          { scorePercentage: { gt: scorePct } },
          {
            scorePercentage: scorePct,
            timeSpentSeconds: { lt: timeSpent },
          },
          {
            scorePercentage: scorePct,
            timeSpentSeconds: timeSpent,
            createdAt: { lt: newRecord.createdAt },
          },
        ],
      },
    });

    const rank = betterCount + 1;
    const formattedRecord = {
      ...newRecord,
      rank,
      createdAt: newRecord.createdAt.toISOString(),
    };

    return NextResponse.json({
      success: true,
      rank,
      entry: formattedRecord,
      record: formattedRecord,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Database save error";
    console.error("[Leaderboard POST Error]:", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
