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
        <p>Interfaccia 18+ per modelle live, discovery e candidatura creator.</p>
      </div>
      <div className="footer-links">
        {[...navItems.slice(0, 5), ...academyLinks.slice(0, 3)].map((item) => (
          <Link href={item.href} key={`${item.href}-${item.label}`}>
            {item.label}
          </Link>
        ))}
      </div>
      <div className="friend-sites">
        <span>Siti amici</span>
        {friendSites.map((site) => (
          <a href={site.href} key={site.href} target="_blank" rel="noopener noreferrer">
            {site.label}
          </a>
        ))}
      </div>
      <div className="footer-legal">
        <span>Solo adulti 18+</span>
        <Link href="/privacy-policy/">Privacy</Link>
        <Link href="/termini/">Termini</Link>
        <Link href="/disclaimer/">Disclaimer</Link>
        <Link href="/contatti/">Contatti</Link>
      </div>
    </footer>
  );
}
