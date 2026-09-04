import assert from "node:assert/strict";
import { test } from "node:test";
import { PROVIDERS, getProvider, isProvider } from "./shorteners.ts";

/**
 * Test hợp đồng chung: mọi cổng, cả cổng thêm sau này, đều phải thoả.
 * Thêm cổng mới mà quên encode URL hay sai tên field là fail ở đây.
 */
const TARGET = "https://site.com/hop/abc?step=1&x=2";

test("mọi cổng có id CHỮ IN và label không rỗng", () => {
  for (const p of PROVIDERS) {
    assert.equal(p.id, p.id.toUpperCase(), `id phải chữ in: ${p.id}`);
    assert.ok(p.label.length > 0, `${p.id} thiếu label`);
    assert.ok(p.dailyLimit >= 0, `${p.id} dailyLimit âm`);
  }
});

test("id không trùng nhau", () => {
  const ids = PROVIDERS.map((p) => p.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("mọi cổng encode url đích — không mất query param", () => {
  for (const p of PROVIDERS) {
    const url = p.build({ token: "TOK", url: TARGET });
    assert.ok(
      url.includes(encodeURIComponent(TARGET)),
      `${p.id} không encode url đích: ${url}`,
    );
    // Link đích chứa &x=2. Nếu chưa encode, nó thành param của chính API rút gọn.
    assert.ok(!url.includes("&x=2"), `${p.id} để lọt query param của link đích`);
  }
});

test("mọi cổng build ra URL https hợp lệ", () => {
  for (const p of PROVIDERS) {
    const url = p.build({ token: "TOK", url: TARGET });
    assert.doesNotThrow(() => new URL(url), `${p.id} build ra URL không parse được`);
    assert.ok(url.startsWith("https://"), `${p.id} không dùng https`);
    assert.ok(url.includes("TOK"), `${p.id} thiếu token trong URL`);
  }
});

test("cổng có supportsFallback thì thêm fallback_url, cổng không thì bỏ qua", () => {
  const fb = "https://site.com/hop/abc/1";
  for (const p of PROVIDERS) {
    const withFb = p.build({ token: "T", url: TARGET, fallback: fb });
    if (p.supportsFallback) {
      assert.ok(withFb.includes("fallback_url="), `${p.id} khai supportsFallback mà không gắn`);
    } else {
      assert.ok(!withFb.includes("fallback_url="), `${p.id} không hỗ trợ mà vẫn gắn fallback`);
    }
  }
});

test("mọi cổng throw khi response rỗng hoặc rác", () => {
  for (const p of PROVIDERS) {
    assert.throws(() => p.parse(""), `${p.id} không throw với body rỗng`);
    assert.throws(() => p.parse("<html>502 Bad Gateway</html>"), `${p.id} không throw với HTML`);
  }
});

test("mọi cổng parse thành công trả về URL https", () => {
  // Response mẫu theo từng định dạng đã biết.
  const samples: Record<string, string> = {
    TRAFFIC4K: JSON.stringify({ status: "success", shortenedUrl: "https://traffic4k.com/aB3" }),
    TRAFFICVN: JSON.stringify({ status: "success", shortenedUrl: "https://trafficvn.com/aB3" }),
    ONTOPS: JSON.stringify({ id: "xY9" }),
    GTRAFFIC: JSON.stringify({ id: "xY9" }),
    VUOTNHANH: "https://vuotnhanh.com/x1",
  };

  for (const p of PROVIDERS) {
    const body = samples[p.id];
    assert.ok(body !== undefined, `Thiếu response mẫu cho cổng mới ${p.id} — thêm vào test này`);
    const out = p.parse(body);
    assert.match(out, /^https:\/\/\S+$/, `${p.id} parse ra không phải URL: ${out}`);
  }
});

test("getProvider throw với id không tồn tại", () => {
  assert.throws(() => getProvider("KHONG_TON_TAI"), /không tồn tại/);
  assert.ok(!isProvider("khong_ton_tai"));
});
