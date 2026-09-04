import { db } from "@/lib/db";
import AdminNav from "../AdminNav";
import { saveApp, deleteApp } from "../actions";

export const dynamic = "force-dynamic";

function arr(json: string): string[] {
  try {
    const v = JSON.parse(json);
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

type Group = { id: number; title: string };
type KeyType = { id: number; name: string };

function Fields({
  groups,
  keyTypes,
  app,
  nextOrder,
}: {
  groups: Group[];
  keyTypes: KeyType[];
  app?: {
    groupId: number;
    name: string;
    desc: string;
    iconUrl: string;
    bannerUrl: string;
    previewUrls: string;
    platforms: string;
    downloadUrl: string;
    getKeyUrl: string;
    keyTypeId: number | null;
    order: number;
    visible: boolean;
  };
  nextOrder?: number;
}) {
  const platforms = arr(app?.platforms ?? "[]");
  return (
    <>
      <div className="vt-row">
        <label className="vt-field">
          <span>Tên ứng dụng</span>
          <input type="text" name="name" defaultValue={app?.name ?? ""} required />
        </label>
        <label className="vt-field">
          <span>Mô tả</span>
          <input type="text" name="desc" defaultValue={app?.desc ?? ""} />
        </label>
      </div>

      <div className="vt-row">
        <label className="vt-field">
          <span>Nhóm</span>
          <select name="groupId" defaultValue={app?.groupId ?? groups[0]?.id} required>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.title}
              </option>
            ))}
          </select>
        </label>
        <label className="vt-field">
          <span>Thứ tự</span>
          <input type="number" name="order" defaultValue={app?.order ?? nextOrder ?? 0} />
        </label>
      </div>

      <div className="vt-row">
        <label className="vt-field">
          <span>URL icon</span>
          <input type="url" name="iconUrl" defaultValue={app?.iconUrl ?? ""} />
        </label>
        <label className="vt-field">
          <span>URL banner</span>
          <input type="url" name="bannerUrl" defaultValue={app?.bannerUrl ?? ""} />
        </label>
      </div>

      <label className="vt-field">
        <span>Ảnh preview — mỗi dòng 1 URL (tối đa 12)</span>
        <textarea name="previewUrls" defaultValue={arr(app?.previewUrls ?? "[]").join("\n")} />
      </label>

      <div className="vt-row">
        <label className="vt-check">
          <input type="checkbox" name="ios" defaultChecked={platforms.includes("ios")} />
          iOS
        </label>
        <label className="vt-check">
          <input type="checkbox" name="android" defaultChecked={platforms.includes("android")} />
          Android
        </label>
        <label className="vt-check">
          <input type="checkbox" name="visible" defaultChecked={app?.visible ?? true} />
          Hiện
        </label>
      </div>

      <label className="vt-field">
        <span>Link tải</span>
        <input type="url" name="downloadUrl" defaultValue={app?.downloadUrl ?? ""} />
      </label>

      <label className="vt-field">
        <span>Loại key</span>
        <select name="keyTypeId" defaultValue={app?.keyTypeId ?? 0}>
          <option value={0}>Không cần key (tải trực tiếp)</option>
          {keyTypes.map((k) => (
            <option key={k.id} value={k.id}>
              {k.name}
            </option>
          ))}
        </select>
      </label>

      <label className="vt-field">
        <span>Link Get Key ngoài — chỉ dùng khi chọn &quot;Không cần key&quot;</span>
        <input type="url" name="getKeyUrl" defaultValue={app?.getKeyUrl ?? ""} />
      </label>
    </>
  );
}

export default async function AppsPage() {
  const [groups, keyTypes, apps] = await Promise.all([
    db.group.findMany({ orderBy: { order: "asc" } }),
    db.keyType.findMany({ orderBy: { id: "asc" } }),
    db.app.findMany({ orderBy: [{ groupId: "asc" }, { order: "asc" }] }),
  ]);

  if (groups.length === 0) {
    return (
      <div className="vt-admin">
        <AdminNav current="/admin/apps" />
        <div className="vt-card">
          <p className="vt-hint">
            Chưa có nhóm nào. Tạo nhóm ở <a href="/admin/groups">Nhóm</a> trước.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="vt-admin">
      <AdminNav current="/admin/apps" />

      <div className="vt-card">
        <h2 style={{ fontSize: 15, marginTop: 0 }}>Thêm ứng dụng</h2>
        <form action={saveApp} className="vt-form">
          <Fields groups={groups} keyTypes={keyTypes} nextOrder={apps.length} />
          <button className="vt-btn-primary" type="submit">
            Thêm
          </button>
        </form>
      </div>

      {apps.map((a) => (
        <div key={a.id} className="vt-card">
          <form action={saveApp} className="vt-form">
            <input type="hidden" name="id" value={a.id} />
            <Fields groups={groups} keyTypes={keyTypes} app={a} />
            <div className="vt-actions">
              <button className="vt-btn-sm" type="submit">
                Lưu
              </button>
            </div>
          </form>
          <form action={deleteApp} style={{ marginTop: 8 }}>
            <input type="hidden" name="id" value={a.id} />
            <button className="vt-btn-sm vt-btn-danger" type="submit">
              Xoá {a.name}
            </button>
          </form>
        </div>
      ))}
    </div>
  );
}
