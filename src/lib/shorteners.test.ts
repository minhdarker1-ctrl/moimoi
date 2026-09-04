import assert from "node:assert/strict";
import { test } from "node:test";
import { buildApiUrl, parseResponse, PROVIDERS, isProvider } from "./shorteners.ts";

const TARGET = "https://site.com/hop/abc?step=1&x=2";

test("encode url để không mất query param của link đích", () => {
  const url = buildApiUrl("TRAFFIC4K", "TOK", TARGET);
  // Nếu thiếu encode, "&x=2" sẽ thành param của chính API rút gọn.
  assert.ok(url.includes(encodeURIComponent(TARGET)));
  assert.equal(url.split("&").length, 2); // chỉ api= và url=
});

test("mỗi cổng dùng đúng tên param token", () => {
  assert.match(buildApiUrl("TRAFFIC4K", "T", TARGET), /[?&]api=T/);
  assert.match(buildApiUrl("TRAFFICVN", "T", TARGET), /[?&]api=T/);
  assert.match(buildApiUrl("ONTOPS", "T", TARGET), /[?&]apikey=T/);
  assert.match(buildApiUrl("GTRAFFIC", "T", TARGET), /[?&]apikey=T/);
  assert.match(buildApiUrl("VUOTNHANH", "T", TARGET), /[?&]api=T/);
});

test("fallback_url chỉ gắn khi được truyền", () => {
  const fb = "https://site.com/hop/abc/1";
  assert.ok(buildApiUrl("TRAFFIC4K", "T", TARGET, fb).includes("fallback_url="));
  assert.ok(!buildApiUrl("TRAFFIC4K", "T", TARGET).includes("fallback_url="));
});

test("parse response JSON của Traffic4K/TrafficVN", () => {
  const body = JSON.stringify({ status: "success", shortenedUrl: "https://traffic4k.com/aB3" });
  assert.equal(parseResponse("TRAFFIC4K", body), "https://traffic4k.com/aB3");
  assert.equal(parseResponse("TRAFFICVN", body), "https://traffic4k.com/aB3");
});

test("parse response ghép domain cho Ontops và GTraffic", () => {
  assert.equal(parseResponse("ONTOPS", JSON.stringify({ id: "xY9" })), "https://ontops.link/xY9");
  assert.equal(parseResponse("GTRAFFIC", JSON.stringify({ id: "xY9" })), "https://gtraffic.io/xY9");
});

test("Vượt Nhanh nhận cả text thuần và JSON", () => {
  assert.equal(parseResponse("VUOTNHANH", "https://vuotnhanh.com/x1\n"), "https://vuotnhanh.com/x1");
  assert.equal(
    parseResponse("VUOTNHANH", JSON.stringify({ status: "success", shortenedUrl: "https://v.com/a" })),
    "https://v.com/a",
  );
});

test("cổng trả lỗi thì throw để caller nhảy cổng khác", () => {
  const err = JSON.stringify({ status: "error", message: "Token sai" });
  assert.throws(() => parseResponse("TRAFFIC4K", err), /Token sai/);
  assert.throws(() => parseResponse("ONTOPS", JSON.stringify({})), /không trả mã/);
  assert.throws(() => parseResponse("VUOTNHANH", "loi roi"), /không phải URL/);
});

test("isProvider chặn giá trị lạ từ form admin", () => {
  assert.ok(isProvider("ONTOPS"));
  assert.ok(!isProvider("ontops"));
  assert.ok(!isProvider("HACKER"));
  // Không assert số lượng cố định: thêm cổng mới không được làm fail test.
  assert.ok(PROVIDERS.length >= 5);
});
