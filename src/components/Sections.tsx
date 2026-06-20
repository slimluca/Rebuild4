import Image from "next/image";
import Link from "next/link";
import { ModelCardImage } from "@/components/ModelCardImage";
import type { GuidePage, GuideSection, LiveModel } from "@/lib/site";
import type { ModelCategory } from "@/lib/model-categories";
import { categories } from "@/lib/model-categories";
import { categoryInfoSections, guideInfoSections, type InfoSectionContent } from "@/lib/info-sections";

const filterLabels = ["Online ora", "Italiano", "Nuove", "Popolari", "Private", "HD"];

const discoveryShellItems = [
  "Online ora",
  "HD",
  "Italiane",
  "Nuove",
  "Private",
  "Mature",
  "Bionde",
  "Asiatiche",
];

const railSlugs = [
  "modelle-online-ora",
  "modelle-disponibili-adesso",
  "nuove-modelle-webcam",
  "modelle-hd",
  "modelle-popolari",
  "modelle-private",
  "modelle-italiane",
  "modelle-bionde",
  "modelle-asiatiche",
];

const hubRailGroups = [
  {
    title: "Live ora",
    slugs: [
      "modelle-online-ora",
      "modelle-disponibili-adesso",
      "modelle-hd",
      "nuove-modelle-webcam",
      "modelle-popolari",
      "modelle-private",
    ],
  },
  {
    title: "Categorie",
    slugs: [
      "modelle-bionde",
      "modelle-brune",
      "modelle-asiatiche",
      "modelle-latine",
      "modelle-italiane",
      "modelle-prosperose",
      "modelle-curvy",
      "modelle-tattoo",
      "modelle-lingerie",
      "modelle-cosplay",
    ],
  },
  {
    title: "Paesi e lingue",
    slugs: [
      "modelle-italiane",
      "modelle-europee",
      "modelle-latine",
      "modelle-brasiliane",
      "modelle-colombiane",
      "modelle-spagnole",
      "modelle-francesi",
      "modelle-inglesi",
      "modelle-multilingue",
    ],
  },
];

const homeCategorySlugs = [
  "modelle-online-ora",
  "modelle-hd",
  "nuove-modelle-webcam",
  "modelle-popolari",
  "modelle-bionde",
  "modelle-brune",
  "modelle-asiatiche",
  "modelle-italiane",
  "modelle-prosperose",
  "modelle-curvy",
  "modelle-tattoo",
  "modelle-lingerie",
];

const categoryDiscoveryGroups = [
  {
    title: "Live ora",
    slugs: [
      "modelle-online-ora",
      "modelle-hd",
      "nuove-modelle-webcam",
      "modelle-popolari",
      "modelle-private",
      "modelle-in-chat-pubblica",
      "modelle-in-gruppo",
    ],
  },
  {
    title: "Categorie popolari",
    slugs: [
      "modelle-webcam",
      "ragazze-live",
      "camgirl-online",
      "modelle-con-preview-live",
      "modelle-live-cam",
      "coppie-webcam",
      "modelle-trans",
    ],
  },
  {
    title: "Aspetto e stile",
    slugs: [
      "modelle-bionde",
      "modelle-brune",
      "modelle-prosperose",
      "modelle-curvy",
      "modelle-tattoo",
      "modelle-lingerie",
      "modelle-mature",
      "modelle-petite",
    ],
  },
  {
    title: "Paesi e lingue",
    slugs: [
      "modelle-italiane",
      "modelle-europee",
      "modelle-asiatiche",
      "modelle-latine",
      "modelle-brasiliane",
      "modelle-colombiane",
      "modelle-spagnole",
      "modelle-inglesi",
    ],
  },
  {
    title: "Esperienze live",
    slugs: [
      "modelle-glamour",
      "modelle-eleganti",
      "modelle-premium",
      "modelle-cosplay",
      "modelle-cosplay-live",
      "modelle-bdsm",
      "modelle-roleplay",
      "modelle-gaming",
    ],
  },
];

function titleCaseFirst(value: string): string {
  if (!value) return value;
  return value.charAt(0).toLocaleUpperCase("it-IT") + value.slice(1);
}

function categoryLabel(category: ModelCategory): string {
  const explicitLabels: Record<string, string> = {
    "modelle-webcam": "Modelle webcam",
    "modelle-online-ora": "Online ora",
    "modelle-hd": "HD",
    "nuove-modelle-webcam": "Nuove modelle",
    "modelle-18-plus": "18 Plus",
    "modelle-20-plus": "20 Plus",
    "modelle-30-plus": "30 Plus",
    "modelle-40-plus": "40 Plus",
    "modelle-50-plus": "50 Plus",
    "modelle-bdsm": "BDSM",
  };
  if (explicitLabels[category.slug]) return explicitLabels[category.slug];
  const shortened = category.title.replace(/^Modelle webcam\s+/i, "").replace(/^Modelle\s+/i, "");
  return titleCaseFirst(shortened.replace(/\bplus\b/g, "Plus"));
}

function categoriesFromSlugs(slugs: string[]): ModelCategory[] {
  return slugs
    .map((slug) => categories.find((category) => category.slug === slug))
    .filter((category): category is ModelCategory => Boolean(category));
}

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
    ["Online ora", "/modelle-online-ora/"],
    ["Categorie", "/modelle-webcam/"],
    ["Diventa model", "/diventare-webcam-model/"],
    ["Privacy", "/privacy-webcam-model/"],
    ["Guadagni", "/guadagni-webcam-model/"],
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

export function CategoryChips({
  activeSlug,
  limit,
  slugs,
}: {
  activeSlug?: string;
  limit?: number;
  slugs?: string[];
}) {
  const sourceCategories = slugs ? categoriesFromSlugs(slugs) : categories;
  const visibleCategories = typeof limit === "number" ? sourceCategories.slice(0, limit) : sourceCategories;

  return (
    <nav className="category-chips" aria-label="Categorie modelle">
      {visibleCategories.map((category) => (
        <Link className={category.slug === activeSlug ? "active" : ""} href={category.canonicalPath} key={category.slug}>
          {categoryLabel(category)}
        </Link>
      ))}
    </nav>
  );
}

export function CategoryGroupPanel({ activeSlug, compact = false }: { activeSlug?: string; compact?: boolean }) {
  return (
    <section className={compact ? "category-panel compact" : "category-panel"} aria-label="Categorie modelle">
      {categoryDiscoveryGroups.map((group) => (
        <div className="category-panel-group" key={group.title}>
          <h3>{group.title}</h3>
          <div className="category-panel-links">
            {categoriesFromSlugs(group.slugs).map((category) => (
              <Link className={category.slug === activeSlug ? "active" : ""} href={category.canonicalPath} key={category.slug}>
                {categoryLabel(category)}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </section>
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

function DiscoveryShellItem({ label, index }: { label: string; index: number }) {
  return (
    <div className="discovery-shell-item">
      <span>{String(index + 1).padStart(2, "0")}</span>
      <strong>{label}</strong>
      <small>In attesa di profili coerenti</small>
    </div>
  );
}

function getModelImage(model: LiveModel): string | undefined {
  return model.previewImage ?? model.image ?? model.thumbnail;
}

function modelMeta(model: LiveModel): string {
  const parts = [model.country, model.isHd ? "HD" : undefined, model.isPrivate ? "Privata" : undefined].filter(Boolean);
  return parts.length ? parts.join(" · ") : "Profilo 18+ dai dati live";
}

function modelStatusLabel(model: LiveModel): string {
  const status = model.status?.toLowerCase();
  if (status === "private") return "Privata";
  if (status === "group") return "Gruppo";
  if (status === "public") return "Live";
  if (model.isOnline === false) return "Profilo";
  return "Live";
}

function modelHref(model: LiveModel): string {
  const modelParam = model.performerId ?? model.id;
  const params = new URLSearchParams();
  if (model.provider) params.set("provider", model.provider);
  if (model.provider === "chaturbate") {
    params.set("username", modelParam);
  } else {
    params.set("performerId", modelParam);
  }
  return `/go/model?${params.toString()}`;
}

export function ModelTile({ model }: { model: LiveModel }) {
  const image = getModelImage(model);
  if (!image) return null;

  return (
    <Link className="model-card real" href={modelHref(model)}>
      <span className="model-visual">
        <ModelCardImage src={image} name={model.name} />
      </span>
      <span className="model-badges">
        <span>{modelStatusLabel(model)}</span>
        {model.isHd ? <span>HD</span> : null}
        {model.isNew ? <span>New</span> : null}
      </span>
      <span className="model-summary">
        <strong>{model.name}</strong>
        <small>{modelMeta(model)}</small>
      </span>
    </Link>
  );
}

export function ModelDiscovery({
  models,
  compact = false,
  page = false,
  showCategories = false,
}: {
  models: LiveModel[];
  compact?: boolean;
  page?: boolean;
  showCategories?: boolean;
}) {
  const targetCount = 20;
  const visibleModels = models.filter((model) => Boolean(getModelImage(model))).slice(0, targetCount);
  const hasLiveFeed = visibleModels.length > 0;
  const shellItems = hasLiveFeed ? [] : discoveryShellItems;

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
      {showCategories ? <CategoryGroupPanel compact /> : <FilterBar compact={compact} />}
      <div className={hasLiveFeed ? "model-grid" : "model-grid empty-shell"}>
        {visibleModels.map((model) => (
          <Link className="model-card real" href={modelHref(model)} key={model.id}>
            <span className="model-visual">
              <ModelCardImage src={getModelImage(model) as string} name={model.name} />
            </span>
            <span className="model-badges">
              <span>{modelStatusLabel(model)}</span>
              {model.isHd ? <span>HD</span> : null}
              {model.isNew ? <span>New</span> : null}
            </span>
            <span className="model-summary">
              <strong>{model.name}</strong>
              <small>{modelMeta(model)}</small>
            </span>
          </Link>
        ))}
        {shellItems.map((label, index) => (
          <DiscoveryShellItem key={label} label={label} index={index} />
        ))}
        {!hasLiveFeed ? (
          <div className="unavailable-panel">
            <span>Discovery live</span>
            <h3>Profili live non disponibili ora</h3>
            <p>
              La piattaforma non riempie la griglia con profili casuali. Quando sono disponibili
              modelle webcam coerenti, la discovery torna popolata con risultati reali.
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

export function SmartDiscoveryRails() {
  const rails = railSlugs
    .map((slug) => categories.find((category) => category.slug === slug))
    .filter((category): category is ModelCategory => Boolean(category));

  return (
    <section className="smart-rails">
      <div className="rail-head">
        <div>
          <p className="eyebrow">Percorsi live</p>
          <h2>Scopri per stile, disponibilità e formato</h2>
        </div>
        <Link className="text-link" href="/modelle-webcam/">
          Tutte le modelle
        </Link>
      </div>
      <div className="rail-track">
        {rails.map((category, index) => (
          <Link className="rail-pill" href={category.canonicalPath} key={category.slug}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{categoryLabel(category)}</strong>
            <small>{category.badges.slice(0, 2).join(" • ")}</small>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function HubCategoryRails() {
  return (
    <section className="smart-rails hub-rails">
      <div className="rail-head">
        <div>
          <p className="eyebrow">Percorsi live</p>
          <h2>Trova il tuo stile live</h2>
        </div>
        <Link className="text-link" href="/modelle-online-ora/">
          Online ora
        </Link>
      </div>
      {hubRailGroups.map((group) => {
        const items = group.slugs
          .map((slug) => categories.find((category) => category.slug === slug))
          .filter((category): category is ModelCategory => Boolean(category));
        return (
          <div className="hub-rail-group" key={group.title}>
            <h3>{group.title}</h3>
            <div className="rail-track">
              {items.map((category, index) => (
                <Link className="rail-pill" href={category.canonicalPath} key={`${group.title}-${category.slug}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{categoryLabel(category)}</strong>
                  <small>{category.badges.slice(0, 2).join(" • ")}</small>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}

export function HomeCategoryRail() {
  const items = homeCategorySlugs
    .map((slug) => categories.find((category) => category.slug === slug))
    .filter((category): category is ModelCategory => Boolean(category));

  return (
    <section className="smart-rails home-category-rail">
      <div className="rail-head">
        <div>
          <p className="eyebrow">Categorie live</p>
          <h2>Trova il tuo stile live</h2>
        </div>
        <Link className="text-link" href="/modelle-webcam/">
          Tutte le categorie
        </Link>
      </div>
      <div className="rail-track">
        {items.map((category, index) => {
          const badges = category.badges.slice(0, 2).join(" • ");

          return (
            <Link className="rail-pill" href={category.canonicalPath} key={category.slug}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{categoryLabel(category)}</strong>
              <small>{badges}</small>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function FullWidthInfoSection({ content }: { content: InfoSectionContent }) {
  return (
    <section className="full-width-info">
      <h2>{content.heading}</h2>
      <div className="full-width-info-copy">
        {content.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {content.links?.length ? (
        <nav className="full-width-info-links" aria-label="Approfondimenti correlati">
          <span>Esplora anche</span>
          {content.links.map((link) => (
            <Link href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </section>
  );
}

export function MatchFinder() {
  const options = [
    ["Cerco modelle online ora", "/modelle-online-ora/"],
    ["Preferisco profili HD", "/modelle-hd/"],
    ["Voglio scoprire nuove modelle", "/nuove-modelle-webcam/"],
    ["Cerco modelle italiane", "/modelle-italiane/"],
    ["Cerco categorie specifiche", "/modelle-webcam/"],
    ["Voglio candidarmi come model", "/diventare-webcam-model/"],
  ];

  return (
    <section className="match-finder">
      <div>
        <p className="eyebrow">Assistente discovery</p>
        <h2>Trova il tuo stile live</h2>
        <p>
          Scegli un percorso guidato nella piattaforma 18+. I link aprono categorie reali o il percorso
          creator, senza profili consigliati artificialmente.
        </p>
      </div>
      <div className="match-options">
        {options.map(([label, href]) => (
          <Link href={href} key={label}>
            {label}
          </Link>
        ))}
      </div>
    </section>
  );
}

export function AvailabilityPulse() {
  return (
    <section className="availability-pulse">
      <div className="pulse-dot" aria-hidden="true" />
      <p>
        La disponibilità delle modelle webcam cambia durante la giornata. Le categorie sono pensate
        per mostrare profili coerenti quando sono disponibili, senza riempire le pagine con risultati casuali.
      </p>
    </section>
  );
}

export function CreatorBridge() {
  const checks = ["18+", "Privacy", "Profilo", "Studio", "Regole"];

  return (
    <section className="creator-bridge">
      <div>
        <p className="eyebrow">Creator bridge</p>
        <h2>Vuoi diventare webcam model?</h2>
      </div>
      <div className="creator-bridge-copy">
        <p>Prepara profilo, privacy, studio e regole personali prima di andare online.</p>
        <div className="creator-checks" aria-label="Checklist creator">
          {checks.map((check) => (
            <span key={check}>{check}</span>
          ))}
        </div>
      </div>
      <ButtonRow
        primaryHref="/go/model-signup"
        primaryLabel="Diventa webcam model"
        secondaryHref="/diventare-webcam-model/"
        secondaryLabel="Scopri come iniziare"
      />
    </section>
  );
}

export function CreatorReadinessStrip() {
  const checks = ["18+", "Privacy separata", "Nome artistico", "Camera e luce", "Regole personali", "Orari realistici"];

  return (
    <section className="readiness-strip">
      <div>
        <p className="eyebrow">Pronto per iniziare?</p>
        <h2>Checklist essenziale creator</h2>
      </div>
      <div className="readiness-track">
        {checks.map((check) => (
          <span key={check}>{check}</span>
        ))}
      </div>
    </section>
  );
}

export function StudioSetupStrip() {
  const items = ["Camera", "Luce", "Audio", "Sfondo", "Connessione", "Comfort"];

  return (
    <section className="studio-strip">
      <div>
        <p className="eyebrow">Studio setup</p>
        <h2>Attrezzatura essenziale, senza eccessi</h2>
      </div>
      <div className="studio-track">
        {items.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </section>
  );
}

export function EarningsRealityDashboard() {
  const factors = ["Tempo online", "Qualità del profilo", "Comunicazione", "Costanza", "Lingua", "Limiti personali"];

  return (
    <section className="earnings-reality">
      <div>
        <p className="eyebrow">Dashboard aspettative</p>
        <h2>Guadagni variabili, decisioni lucide</h2>
        <p>
          Lavorare in webcam da casa può richiedere tempo, confini e continuità. I risultati cambiano
          in base a preparazione, piattaforma, presenza online e gestione personale.
        </p>
      </div>
      <div className="reality-track">
        {factors.map((factor) => (
          <span key={factor}>{factor}</span>
        ))}
      </div>
    </section>
  );
}

export function CategoryDiscovery({ category, models }: { category: ModelCategory; models: LiveModel[] }) {
  const hasModels = models.length > 0;
  const hasLowInventory = hasModels && models.length < category.minimumModelCount;
  const visibleModels = models.slice(0, 20);

  return (
    <>
      <section className="category-hero">
        <div>
          <p className="eyebrow">Discovery 18+</p>
          <h1>{category.title}</h1>
          <p>{category.intro}</p>
        </div>
      </section>

      <CategoryChips activeSlug={category.slug} slugs={category.related} />

      <section className="category-results">
        <div className="discovery-head">
          <div>
            <h2>{hasModels ? "Profili disponibili" : "Disponibilità limitata"}</h2>
            {hasLowInventory ? (
              <p className="inventory-note">
                Inventario ridotto in questo momento: mostriamo solo profili coerenti con la categoria,
                senza aggiungere risultati generici.
              </p>
            ) : null}
          </div>
          <div className="badge-row">
            {category.badges.map((badge) => (
              <span key={badge}>{badge}</span>
            ))}
          </div>
        </div>
        {hasModels ? (
          <div className="model-grid category-grid">
            {visibleModels.map((model) => (
              <ModelTile model={model} key={model.id} />
            ))}
          </div>
        ) : (
          <div className="premium-empty">
            <span>Dati live in aggiornamento</span>
            <h2>Nessun profilo coerente disponibile ora</h2>
            <p>
              Questa categoria non viene riempita con modelle generiche. Quando sono disponibili profili
              con metadati coerenti, la griglia torna automaticamente popolata.
            </p>
            <div className="button-row">
              <Link className="btn btn-primary" href="/modelle-webcam/">
                Torna alla discovery
              </Link>
              <Link className="btn btn-secondary" href="/go/live">
                Apri area live
              </Link>
            </div>
          </div>
        )}
      </section>

      {categoryInfoSections[category.slug] ? (
        <FullWidthInfoSection content={categoryInfoSections[category.slug]} />
      ) : null}

      <CreatorBridge />
    </>
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
        <h2>Risposte essenziali per decidere meglio</h2>
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
  const showReadiness = page.slug === "diventare-webcam-model";
  const showStudio = page.slug === "attrezzatura-webcam-model";
  const showEarnings = page.slug === "guadagni-webcam-model";

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
      </section>
      {showReadiness ? <CreatorReadinessStrip /> : null}
      {showStudio ? <StudioSetupStrip /> : null}
      {showEarnings ? <EarningsRealityDashboard /> : null}
      <GuideNav sections={page.sections} />
      {guideInfoSections[page.slug] ? <FullWidthInfoSection content={guideInfoSections[page.slug]} /> : null}
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
