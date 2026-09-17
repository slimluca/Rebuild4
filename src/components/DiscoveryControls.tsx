"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export type DiscoveryItem = {
  href: string;
  label: string;
  strategic: boolean;
  active?: boolean;
};

export function DiscoveryControls({
  groups,
  compact = false,
}: {
  groups: { title: string; items: DiscoveryItem[] }[];
  compact?: boolean;
}) {
  const router = useRouter();

  return (
    <section className={compact ? "category-panel compact" : "category-panel"} aria-label="Filtri modelle">
      {groups.map((group) => (
        <div className="category-panel-group" key={group.title}>
          <h3>{group.title}</h3>
          <div className="category-panel-links">
            {group.items.map((item) =>
              item.strategic ? (
                <Link className={item.active ? "active" : ""} href={item.href} key={item.href}>
                  {item.label}
                </Link>
              ) : (
                <button
                  className={item.active ? "active" : ""}
                  key={item.href}
                  type="button"
                  onClick={() => router.push(item.href)}
                >
                  {item.label}
                </button>
              )
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
