import Image from "next/image";
import Link from "next/link";
import { brand, creatorNavItems, navItems } from "@/lib/site";

export function Header() {
  return (
    <header className="site-header viewer-header">
      <Link className="brand-mark" href="/" aria-label="Homepage Modelle Webcam">
        <Image
          src="/images/modelle-webcam-logo.png"
          alt={brand}
          width={420}
          height={140}
          priority
          sizes="(max-width: 480px) 220px, (max-width: 760px) 260px, (max-width: 1120px) 340px, 420px"
        />
      </Link>
      <nav className="desktop-nav" aria-label="Navigazione principale">
        {navItems.map((item) => (
          <Link href={item.href} key={`${item.href}-${item.label}`}>
            {item.label}
          </Link>
        ))}
      </nav>
      <Link className="header-cta" href="/diventare-webcam-model/">
        Diventa webcam model
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
          <Link className="mobile-cta" href="/diventare-webcam-model/">
            Diventa webcam model
          </Link>
        </div>
      </details>
    </header>
  );
}

export function CreatorHeader() {
  return (
    <header className="site-header creator-header">
      <Link className="brand-mark" href="/diventare-webcam-model/" aria-label="Percorso creator Modelle Webcam">
        <Image
          src="/images/modelle-webcam-logo.png"
          alt={brand}
          width={420}
          height={140}
          priority
          sizes="(max-width: 480px) 220px, (max-width: 760px) 260px, (max-width: 1120px) 340px, 330px"
        />
      </Link>
      <nav className="desktop-nav creator-nav" aria-label="Navigazione guide creator">
        {creatorNavItems.map((item) => (
          <Link className={item.cta ? "header-cta creator-header-cta" : undefined} href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
      <span className="header-age">18+</span>
      <details className="mobile-nav creator-mobile-nav">
        <summary aria-label="Apri menu creator">Menu</summary>
        <div className="mobile-nav-panel">
          {creatorNavItems.map((item) => (
            <Link className={item.cta ? "mobile-cta" : undefined} href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
      </details>
    </header>
  );
}
