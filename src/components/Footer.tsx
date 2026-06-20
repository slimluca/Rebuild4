import Image from "next/image";
import Link from "next/link";
import { academyLinks, brand, navItems } from "@/lib/site";

export function Footer() {
  const friendSites = [
    { href: "https://webcamsex.site", label: "Webcam Sex" },
    { href: "https://sessochat.net", label: "Sesso Chat" },
    { href: "https://webcamsex.me", label: "Cam Sex" },
  ];

  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <Image className="footer-logo" src="/images/modelle-webcam-logo.png" alt={brand} width={260} height={87} />
        <p>Discovery live e percorso creator in un ambiente 18+ curato.</p>
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
      <div className="footer-column friend-sites">
        <strong>Siti amici</strong>
        {friendSites.map((site) => (
          <a href={site.href} key={site.href} target="_blank" rel="noopener noreferrer">
            {site.label}
          </a>
        ))}
      </div>
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
