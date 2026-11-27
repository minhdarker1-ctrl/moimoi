import React from "react";

export interface PageHeaderProps {
  badge?: string;
  title: string;
  description?: string;
  rightSlot?: React.ReactNode;
}

export default function PageHeader({
  badge,
  title,
  description,
  rightSlot,
}: PageHeaderProps) {
  return (
    <header className="pro-page-header">
      <div className="pro-page-header-main">
        {badge && <span className="pro-eyebrow-badge">{badge}</span>}
        <h1 className="pro-page-title">{title}</h1>
        {description && <p className="pro-page-desc">{description}</p>}
      </div>
      {rightSlot && <div className="pro-page-header-right">{rightSlot}</div>}
    </header>
  );
}
