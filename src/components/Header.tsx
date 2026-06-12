import Link from "next/link";
import { brand, navItems } from "@/lib/site";

export function Header() {
  return (
    <header className="site-header">
      <Link className="brand-mark" href="/" aria-label="Homepage Modelle Webcam">
        <span>MW</span>
        <strong>{brand}</strong>
      </Link>
      <nav className="desktop-nav" aria-label="Navigazione principale">
        {navItems.map((item) => (
          <Link href={item.href} key={`${item.href}-${item.label}`}>
            {item.label}
          </Link>
        ))}
      </nav>
      <Link className="header-cta" href="/go/model-signup">
        Diventa model
      </Link>
      <span className="header-age">18+</span>
      <details className="mobile-nav">
        <summary aria-label="Apri menu">Menu</summary>
        <div className="mobile-nav-panel">
          {navItems.map((item) => (
            <Link href={item.href} key={`${item.href}-${item.label}`}>
              {item.label}
            </Link>
          ))}
          <Link className="mobile-cta" href="/go/model-signup">
            Diventa model
          </Link>
        </div>
      </details>
    </header>
  );
}
