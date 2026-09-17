import Image from "next/image";
import Link from "next/link";
import { academyLinks, brand, creatorNavItems, navItems } from "@/lib/site";

export function Footer() {
  const friendSites = [
    { href: "https://webcamsex.site/", label: "Webcam Sex Live" },
    { href: "https://webcamsex.me/", label: "Webcam Sex" },
    { href: "https://sessochat.net/", label: "Sesso Chat" },
    { href: "https://webcamsex.co.za/", label: "Webcam Sex South Africa" },
    { href: "https://livecamitalia.it/", label: "Live Cam Italia" },
    { href: "https://webcamsex.africa/", label: "Webcam Sex Africa" },
  ];

  return (
    <footer className="site-footer viewer-footer">
      <div className="footer-brand">
        <Image className="footer-logo" src="/images/modelle-webcam-logo.png" alt={brand} width={260} height={87} />
        <p>Profili live e percorso creator in un ambiente 18+ curato.</p>
      </div>
      <div className="footer-column footer-main-links">
        <strong>Esplora</strong>
        {navItems.map((item) => (
          <Link href={item.href} key={`${item.href}-${item.label}`}>
            {item.label}
          </Link>
        ))}
      </div>
      <div className="footer-column footer-creator-links">
        <strong>Creator</strong>
        {academyLinks.slice(0, 4).map((item) => (
          <Link href={item.href} key={`${item.href}-${item.label}`}>
            {item.label}
          </Link>
        ))}
      </div>
      <nav className="footer-column friend-sites" aria-label="Siti amici">
        <strong>Siti amici</strong>
        <ul>
          {friendSites.map((site) => (
            <li key={site.href}>
              <a href={site.href} target="_blank" rel="nofollow noopener noreferrer">
                {site.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="footer-column footer-legal">
        <strong>Solo adulti 18+</strong>
        <Link href="/privacy-policy/">Privacy</Link>
        <Link href="/termini/">Termini</Link>
        <Link href="/disclaimer/">Disclaimer</Link>
        <Link href="/contatti/">Contatti</Link>
      </div>
    </footer>
  );
}

export function CreatorFooter() {
  return (
    <footer className="site-footer creator-footer">
      <div className="footer-brand">
        <Link href="/diventare-webcam-model/" aria-label="Percorso creator Modelle Webcam">
          <Image className="footer-logo" src="/images/modelle-webcam-logo.png" alt={brand} width={260} height={87} />
        </Link>
        <p>Guide pratiche per preparare un percorso creator 18+ consapevole, privato e sostenibile.</p>
      </div>
      <nav className="footer-column creator-footer-guides" aria-label="Guide creator">
        <strong>Percorso creator</strong>
        {creatorNavItems.map((item) => (
          <Link href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
      <nav className="footer-column footer-legal" aria-label="Informazioni legali">
        <strong>Informazioni e 18+</strong>
        <Link href="/privacy-policy/">Privacy policy</Link>
        <Link href="/termini/">Termini</Link>
        <Link href="/disclaimer/">Disclaimer</Link>
        <Link href="/contatti/">Contatti</Link>
      </nav>
    </footer>
  );
}
