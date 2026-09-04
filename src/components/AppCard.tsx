import PreviewLightbox from "./PreviewLightbox";

export type AppData = {
  id: number;
  name: string;
  desc: string;
  iconUrl: string;
  bannerUrl: string;
  previewUrls: string;
  platforms: string;
  downloadUrl: string;
  getKeyUrl: string;
  keyTypeId: number | null;
};

function parseArr(json: string): string[] {
  try {
    const v = JSON.parse(json);
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export default function AppCard({ app }: { app: AppData }) {
  const previews = parseArr(app.previewUrls);
  const platforms = parseArr(app.platforms);
  const getKeyHref =
    app.keyTypeId !== null ? `/getkey/${app.id}` : (app.getKeyUrl || null);

  const banner = app.bannerUrl && (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element -- URL do admin dán, host tự do */}
      <img src={app.bannerUrl} alt={app.name} loading="lazy" />
      {platforms.length > 0 && (
        <span className="mdarker-app-banner-badges">
          {platforms.includes("ios") && (
            <span className="mdarker-platform-badge">
              <i className="fab fa-apple" aria-hidden="true" /> iOS
            </span>
          )}
          {platforms.includes("android") && (
            <span className="mdarker-platform-badge">
              <i className="bi bi-android2" aria-hidden="true" /> Android
            </span>
          )}
        </span>
      )}
    </>
  );

  return (
    <div className="mdarker-app-item">
      {banner &&
        (previews.length > 0 ? (
          <PreviewLightbox images={previews} title={app.name}>
            {banner}
          </PreviewLightbox>
        ) : (
          <div className="mdarker-app-banner">{banner}</div>
        ))}

      <div className="mdarker-app-info">
        {app.iconUrl && (
          <div className="mdarker-app-icon-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element -- URL do admin dán */}
            <img src={app.iconUrl} alt="" width={60} height={60} loading="lazy" />
          </div>
        )}
        <div className="mdarker-app-text">
          <span className="mdarker-app-name">{app.name}</span>
          {app.desc && <span className="mdarker-app-desc">{app.desc}</span>}
        </div>
      </div>

      {(app.downloadUrl || getKeyHref) && (
        <div className="mdarker-app-actions">
          {app.downloadUrl && (
            <a
              className="mdarker-download-btn"
              href={app.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Tải Xuống</span>
              <i className="bi bi-download" aria-hidden="true" />
            </a>
          )}
          {getKeyHref && (
            <a
              className="mdarker-app-getkey"
              href={getKeyHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fas fa-key" aria-hidden="true" />
              <span>Get Key</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
}
