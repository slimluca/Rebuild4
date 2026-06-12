import Image from "next/image";
import Link from "next/link";
import type { GuidePage, GuideSection, LiveModel } from "@/lib/site";

const filterLabels = ["Online ora", "Italiano", "Nuove", "Popolari", "Private", "HD"];

const previewSlots = Array.from({ length: 20 }, (_, index) => ({
  id: `slot-${index + 1}`,
  label: `Slot live ${String(index + 1).padStart(2, "0")}`,
  tag: index % 3 === 0 ? "Feed in attesa" : index % 3 === 1 ? "HD pronto" : "Profilo riservato",
  tone: ["rose", "violet", "gold", "blue", "wine", "graphite"][index % 6],
}));

export function ButtonRow({
  primaryHref = "/go/model-signup",
  primaryLabel = "Diventa webcam model",
  secondaryHref = "/modelle-webcam/",
  secondaryLabel = "Guarda modelle online",
}: {
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <div className="button-row">
      <Link className="btn btn-primary" href={primaryHref}>
        {primaryLabel}
      </Link>
      <Link className="btn btn-secondary" href={secondaryHref}>
        {secondaryLabel}
      </Link>
    </div>
  );
}

export function PlatformTabs() {
  const tabs = [
    ["Live", "/modelle-webcam/"],
    ["Modelle", "/modelle-webcam/"],
    ["Diventa model", "/diventare-webcam-model/"],
    ["Privacy", "/privacy-webcam-model/"],
    ["Guadagni", "/guadagni-webcam-model/"],
    ["FAQ", "/faq/"],
  ];

  return (
    <nav className="platform-tabs" aria-label="Navigazione piattaforma">
      {tabs.map(([label, href]) => (
        <Link href={href} key={`${label}-${href}`}>
          {label}
        </Link>
      ))}
      <span>18+</span>
    </nav>
  );
}

export function FilterBar({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "filter-bar compact" : "filter-bar"} aria-label="Filtri visivi">
      {filterLabels.map((label, index) => (
        <span className={index === 0 ? "active" : ""} key={label}>
          {label}
        </span>
      ))}
    </div>
  );
}

export function Hero() {
  return (
    <section className="platform-hero">
      <div className="hero-orbit" aria-hidden="true">
        <div className="orbit-card main">
          <Image src="/images/modelle-webcam-hero.jpg" alt="" fill priority sizes="(max-width: 980px) 92vw, 46vw" />
          <span className="live-badge">Modelle Webcam</span>
        </div>
        <div className="orbit-card mini top">18+ verificato</div>
        <div className="orbit-card mini bottom">Studio pronto</div>
      </div>
      <div className="hero-copy">
        <p className="eyebrow">Piattaforma webcam premium</p>
        <h1>Modelle live e creator onboarding in un solo spazio 18+</h1>
        <p>
          Sfoglia modelle webcam online e valuta come diventare webcam model con privacy,
          attrezzatura essenziale, controllo del profilo e guadagni spiegati senza promesse.
        </p>
        <ButtonRow />
      </div>
    </section>
  );
}

function ModelPlaceholder({ label, tag, tone }: { label: string; tag: string; tone: string }) {
  return (
    <Link className={`model-card preview-card ${tone}`} href="/go/live">
      <span className="model-visual">
        <span className="avatar-glow" />
        <span className="preview-name">{label.slice(-2)}</span>
      </span>
      <span className="model-overlay">
        <span className="status-dot">Live</span>
        <strong>{label}</strong>
        <small>{tag}</small>
      </span>
    </Link>
  );
}

export function ModelDiscovery({
  models,
  compact = false,
  page = false,
}: {
  models: LiveModel[];
  compact?: boolean;
  page?: boolean;
}) {
  const targetCount = page ? 20 : 16;
  const visibleModels = models.slice(0, targetCount);
  const hasLiveFeed = visibleModels.length > 0;
  const informationalSlots = hasLiveFeed ? 0 : 1;
  const slots = previewSlots.slice(0, Math.max(0, targetCount - visibleModels.length - informationalSlots));

  return (
    <section className={page ? "model-discovery page-discovery" : "model-discovery"}>
      <div className="discovery-head">
        <div>
          <p className="eyebrow">Scoperta live</p>
          <h2>{page ? "Sfoglia modelle webcam online" : "Modelle live subito in evidenza"}</h2>
        </div>
        <Link className="text-link" href="/modelle-webcam/">
          Apri la pagina modelle
        </Link>
      </div>
      <FilterBar compact={compact} />
      <div className={hasLiveFeed ? "model-grid" : "model-grid empty-shell"}>
        {visibleModels.map((model) => (
          <Link className="model-card real" href={`/go/model?id=${encodeURIComponent(model.id)}`} key={model.id}>
            <span className="model-visual">
              {model.image ? (
                <Image src={model.image} alt="" fill sizes="(max-width: 700px) 48vw, 280px" />
              ) : (
                <span className="preview-name">{model.name.slice(0, 1)}</span>
              )}
            </span>
            <span className="model-overlay">
              <span className="status-dot">{model.status ?? "Online"}</span>
              <strong>{model.name}</strong>
              <small>{model.country ? `${model.country} · HD` : "HD · stanza privata"}</small>
            </span>
          </Link>
        ))}
        {slots.map((slot) => (
          <ModelPlaceholder key={slot.id} label={slot.label} tag={slot.tag} tone={slot.tone} />
        ))}
        {!hasLiveFeed ? (
          <div className="unavailable-panel">
            <span>Anteprima live</span>
            <h3>Anteprima live non disponibile</h3>
            <p>
              Il feed esterno non sta restituendo profili in questo momento. La griglia resta pronta,
              con filtri, accesso live e percorsi interni già configurati.
            </p>
            <Link className="btn btn-primary" href="/go/live">
              Apri area live
            </Link>
          </div>
        ) : null}
      </div>
      {page ? (
        <div className="show-more-row">
          <Link className="btn btn-secondary" href="/go/live">
            Mostra altre modelle
          </Link>
        </div>
      ) : null}
    </section>
  );
}

export function RecruitmentStrip() {
  return (
    <section className="recruit-strip">
      <div>
        <p className="eyebrow">Candidatura creator</p>
        <h2>Candidati come model con uno studio pronto e confini chiari</h2>
      </div>
      <div className="recruit-copy">
        <p>
          Se vuoi diventare webcam model o diventare camgirl, parti da una presenza separata dalla
          vita privata: profilo dedicato, studio ordinato, privacy controllata e limiti chiari prima
          della live.
        </p>
        <span>Profilo</span>
        <span>Studio</span>
        <span>Privacy</span>
        <span>Live</span>
      </div>
      <ButtonRow primaryLabel="Diventa webcam model" secondaryHref="/diventare-camgirl/" secondaryLabel="Scopri come iniziare" />
    </section>
  );
}

export function SignupFlow() {
  const steps = [
    ["01", "Apri il tuo profilo", "Nome d'arte, email dedicata, documenti pronti."],
    ["02", "Prepara il tuo studio", "Luce, audio, sfondo e connessione sotto controllo."],
    ["03", "Vai online con controllo", "Limiti chiari, privacy protetta, ritmo sostenibile."],
  ];

  return (
    <section className="signup-flow editorial-flow">
      <div className="section-title">
        <p className="eyebrow">Percorso iniziale</p>
        <h2>Tre passaggi, zero improvvisazione</h2>
      </div>
      <p className="section-paragraph">
        Lavorare in webcam richiede una preparazione concreta: identità separata, attrezzatura
        affidabile, regole personali e una routine che non invada la vita privata.
      </p>
      <div className="flow-rail">
        {steps.map(([number, title, body]) => (
          <article key={number}>
            <span>{number}</span>
            <h3>{title}</h3>
            <p>{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function SafetyDashboard() {
  const checks = ["Nome d'arte", "Email separata", "Sfondo pulito", "Limiti scritti"];

  return (
    <section className="dashboard-module safety">
      <div>
        <p className="eyebrow">Console privacy</p>
        <h2>Controlli essenziali prima della live</h2>
        <p>
          La presenza online funziona meglio quando vita privata e profilo creator restano separati.
          Prima di andare live controlla scena, account, dati personali e canali di contatto.
        </p>
      </div>
      <div className="mini-checks">
        {checks.map((check) => (
          <span key={check}>✓ {check}</span>
        ))}
      </div>
    </section>
  );
}

export function EarningsConsole() {
  return (
    <section className="earnings-console">
      <div>
        <p className="eyebrow">Aspettative</p>
        <h2>Guadagni variabili, lettura prudente</h2>
      </div>
      <p className="earnings-copy">
        I guadagni di una webcam model dipendono da tempo online, qualità del profilo, lingua,
        comunicazione, piattaforma e costanza. Nessuna cifra è garantita.
      </p>
      <div className="console-panel">
        <div>
          <span>Tempo</span>
          <strong>Variabile</strong>
        </div>
        <div>
          <span>Setup</span>
          <strong>Incide</strong>
        </div>
        <div>
          <span>Risultati</span>
          <strong>Non garantiti</strong>
        </div>
      </div>
      <Link className="btn btn-secondary" href="/guadagni-webcam-model/">
        Vedi guadagni
      </Link>
    </section>
  );
}

export function FaqSection({ faqs }: { faqs: { question: string; answer: string }[] }) {
  return (
    <section className="faq-section">
      <div className="section-title">
        <p className="eyebrow">FAQ</p>
        <h2>Risposte rapide per decidere meglio</h2>
      </div>
      <div className="faq-list">
        {faqs.map((faq) => (
          <details key={faq.question}>
            <summary>{faq.question}</summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="final-cta">
      <div>
        <p className="eyebrow">Piattaforma 18+</p>
        <h2>Entra come viewer o candidati come creator</h2>
      </div>
      <p>
        Guarda modelle live oppure apri il percorso per diventare webcam model con privacy,
        attrezzatura e aspettative realistiche.
      </p>
      <ButtonRow />
    </section>
  );
}

function GuideNav({ sections }: { sections: GuideSection[] }) {
  return (
    <nav className="module-nav" aria-label="Moduli">
      {sections.map((section, index) => (
        <a href={`#section-${index + 1}`} key={`${section.title}-${index}`}>
          {section.kicker ?? `Modulo ${index + 1}`}
        </a>
      ))}
    </nav>
  );
}

export function GuideTemplate({ page }: { page: GuidePage }) {
  const isAcademy = page.slug === "academy";

  return (
    <main>
      <PlatformTabs />
      <section className={isAcademy ? "guide-hero academy" : "guide-hero"}>
        <div>
          <p className="eyebrow">{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <p>{page.intro}</p>
          {page.ctaHref && page.ctaLabel ? (
            <ButtonRow
              primaryHref={page.ctaHref}
              primaryLabel={page.ctaLabel}
              secondaryHref={isAcademy ? "/modelle-webcam/" : "/academy/"}
              secondaryLabel={isAcademy ? "Apri la pagina modelle" : "Apri academy"}
            />
          ) : null}
        </div>
        <div className="progress-widget">
          <span>18+</span>
          <strong>{isAcademy ? "Academy dashboard" : "Creator module"}</strong>
          <p>{page.sections.length} moduli compatti</p>
        </div>
      </section>
      <GuideNav sections={page.sections} />
      <section className="guide-dashboard">
        {page.sections.map((section, index) => (
          <article className="guide-module" id={`section-${index + 1}`} key={`${section.title}-${index}`}>
            <div className="module-index">
              <span>{String(index + 1).padStart(2, "0")}</span>
              {section.kicker ? <p className="eyebrow">{section.kicker}</p> : null}
            </div>
            <div>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </div>
            {section.points ? (
              <ul>
                {section.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </section>
      {page.faqs ? <FaqSection faqs={page.faqs.slice(0, isAcademy ? 6 : 4)} /> : null}
      <FinalCta />
    </main>
  );
}
