import Image from "next/image";
import Link from "next/link";
import { ModelCardImage } from "@/components/ModelCardImage";
import { DiscoveryControls, type DiscoveryItem } from "@/components/DiscoveryControls";
import { LocalChecklist } from "@/components/LocalChecklist";
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
  "modelle-webcam",
  "modelle-hd",
  "nuove-modelle-webcam",
  "modelle-italiane",
  "modelle-prosperose",
  "modelle-tattoo",
];

const strategicCategorySlugs = new Set([
  "modelle-webcam",
  "modelle-hd",
  "nuove-modelle-webcam",
  "modelle-tattoo",
  "modelle-prosperose",
  "modelle-italiane",
]);

const categoryDiscoveryGroups = [
  {
    title: "In evidenza",
    slugs: [
      "modelle-online-ora",
      "modelle-hd",
      "nuove-modelle-webcam",
      "modelle-popolari",
      "modelle-private",
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
    ],
  },
  {
    title: "Paesi e lingue",
    slugs: [
      "modelle-italiane",
      "modelle-europee",
      "modelle-asiatiche",
      "modelle-latine",
    ],
  },
  {
    title: "Esperienze live",
    slugs: [
      "coppie-webcam",
      "modelle-trans",
      "modelle-cosplay",
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
  const seen = new Set<string>();
  return slugs
    .map((slug) => categories.find((category) => category.slug === slug))
    .filter((category): category is ModelCategory => {
      if (!category || seen.has(category.canonicalPath)) return false;
      seen.add(category.canonicalPath);
      return true;
    });
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
      <Link className="btn btn-primary" href={primaryHref} prefetch={!primaryHref.startsWith("/go/")}>
        {primaryLabel}
      </Link>
      <Link className="btn btn-secondary" href={secondaryHref} prefetch={!secondaryHref.startsWith("/go/")}>
        {secondaryLabel}
      </Link>
    </div>
  );
}

export function PlatformTabs() {
  const tabs = [
    ["Online ora", "/modelle-webcam/#online"],
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

  const items: DiscoveryItem[] = visibleCategories.map((category) => ({
    href: category.canonicalPath === "/modelle-online-ora/" ? "/modelle-webcam/#online" : category.canonicalPath,
    label: categoryLabel(category),
    strategic: strategicCategorySlugs.has(category.slug) || category.slug === "modelle-online-ora",
    active: category.slug === activeSlug,
  }));

  return <DiscoveryControls compact groups={[{ title: "Categorie correlate", items }]} />;
}

export function CategoryGroupPanel({ activeSlug, compact = false }: { activeSlug?: string; compact?: boolean }) {
  const groups = categoryDiscoveryGroups.map((group) => ({
    title: group.title,
    items: categoriesFromSlugs(group.slugs).map((category) => ({
      href: category.canonicalPath === "/modelle-online-ora/" ? "/modelle-webcam/#online" : category.canonicalPath,
      label: categoryLabel(category),
      strategic: strategicCategorySlugs.has(category.slug) || category.slug === "modelle-online-ora",
      active: category.slug === activeSlug,
    })),
  }));

  return (
    <DiscoveryControls compact={compact} groups={groups} />
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
        <p className="eyebrow">Cam live per adulti</p>
        <h1>Modelle webcam live online</h1>
        <p>
          Sfoglia modelle cam online con anteprime aggiornate, profili HD e categorie utili.
          Se vuoi lavorare davanti alla camera, trovi anche un percorso dedicato con privacy e preparazione pratica.
        </p>
        <ButtonRow
          primaryHref="/modelle-webcam/"
          primaryLabel="Guarda modelle online"
          secondaryHref="/diventare-webcam-model/"
          secondaryLabel="Diventa webcam model"
        />
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
  return parts.length ? parts.join(", ") : "Profilo live 18+";
}

function modelStatusLabel(model: LiveModel): string {
  const status = model.status?.toLowerCase();
  if (status === "private") return "Privata";
  if (status === "group") return "Gruppo";
  if (status === "public") return "Live";
  if (model.isOnline === false) return "Profilo";
  return "Live";
}

function modelHref(model: LiveModel, track: string): string {
  const modelParam = model.performerId ?? model.id;
  const params = new URLSearchParams();
  if (model.provider) params.set("provider", model.provider);
  params.set("track", track);
  if (model.provider === "chaturbate") {
    params.set("username", modelParam);
  } else {
    params.set("performerId", modelParam);
  }
  return `/go/model?${params.toString()}`;
}

export function ModelTile({ model, priority = false, track }: { model: LiveModel; priority?: boolean; track: string }) {
  const image = getModelImage(model);
  if (!image) return null;

  return (
    <Link className="model-card real" href={modelHref(model, track)} prefetch={false}>
      <span className="model-visual">
        <ModelCardImage src={image} name={model.name} priority={priority} />
      </span>
      <span className="model-badges">
        <span>{modelStatusLabel(model)}</span>
        {model.isHd ? <span>HD</span> : null}
        {model.isNew ? <span>Nuova</span> : null}
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
  track,
  compact = false,
  page = false,
  showCategories = false,
}: {
  models: LiveModel[];
  track: string;
  compact?: boolean;
  page?: boolean;
  showCategories?: boolean;
}) {
  const targetCount = 20;
  const visibleModels = models.filter((model) => Boolean(getModelImage(model))).slice(0, targetCount);
  const hasLiveFeed = visibleModels.length > 0;
  const shellItems = hasLiveFeed ? [] : discoveryShellItems;

  return (
    <section className={page ? "model-discovery page-discovery" : "model-discovery"} id="online">
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
      <div className={hasLiveFeed ? "model-grid" : "model-grid empty-shell"} data-nosnippet>
        {visibleModels.map((model, index) => (
          <Link className="model-card real" href={modelHref(model, track)} prefetch={false} key={model.id}>
            <span className="model-visual">
              <ModelCardImage src={getModelImage(model) as string} name={model.name} priority={index < 4} />
            </span>
            <span className="model-badges">
              <span>{modelStatusLabel(model)}</span>
              {model.isHd ? <span>HD</span> : null}
              {model.isNew ? <span>Nuova</span> : null}
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
            <span>Disponibilità live</span>
            <h3>Profili live non disponibili ora</h3>
            <p>
              La piattaforma non riempie la griglia con profili casuali. Quando sono disponibili
              modelle webcam coerenti, la discovery torna popolata con risultati reali.
            </p>
            <Link className="btn btn-primary" href={`/go/live?track=${track}`} prefetch={false}>
              Apri area live
            </Link>
          </div>
        ) : null}
      </div>
      {page ? (
        <div className="show-more-row">
          <Link className="btn btn-secondary" href={`/go/live?track=${track}`} prefetch={false}>
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
            <small>{category.badges.slice(0, 2).join(", ")}</small>
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
          <Link className="text-link" href="/modelle-webcam/#online">
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
                  <small>{category.badges.slice(0, 2).join(", ")}</small>
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
          const badges = category.badges.slice(0, 2).join(", ");

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
    ["Cerco modelle online ora", "/modelle-webcam/#online"],
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
        <p className="eyebrow">Percorso creator</p>
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
        primaryHref="/diventare-webcam-model/"
        primaryLabel="Scopri il percorso creator"
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
        <p className="eyebrow">Preparazione dello studio</p>
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
        <p className="eyebrow">Aspettative realistiche</p>
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

export function CategoryDiscovery({ category, models, track }: { category: ModelCategory; models: LiveModel[]; track: string }) {
  const hasModels = models.length > 0;
  const hasLowInventory = hasModels && models.length < category.minimumModelCount;
  const visibleModels = models.slice(0, 20);

  return (
    <>
      <section className="category-hero">
        <div>
          <p className="eyebrow">Categoria live 18+</p>
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
                Poche stanze corrispondono in questo momento. Mostriamo solo profili coerenti con la categoria,
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
          <div className="model-grid category-grid" data-nosnippet>
            {visibleModels.map((model, index) => (
              <ModelTile model={model} priority={index < 4} track={track} key={model.id} />
            ))}
          </div>
        ) : (
          <div className="premium-empty">
            <span>Dati live in aggiornamento</span>
            <h2>Nessun profilo coerente disponibile ora</h2>
            <p>
              Questa categoria non viene riempita con modelle generiche. Quando sono disponibili profili
              con caratteristiche coerenti, la griglia torna automaticamente popolata.
            </p>
            <div className="button-row">
              <Link className="btn btn-primary" href="/modelle-webcam/">
                Esplora le categorie
              </Link>
              <Link className="btn btn-secondary" href={`/go/live?track=${track}`} prefetch={false}>
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

export function FinalCta({ track }: { track?: string }) {
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
      <ButtonRow primaryHref={track ? `/go/model-signup?track=${track}` : "/diventare-webcam-model/"} />
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
  const showPrivacyChecklist = page.slug === "privacy-webcam-model";
  const creatorTracks: Record<string, string> = {
    "diventare-webcam-model": "mw_creator_model",
    "diventare-camgirl": "mw_creator_camgirl",
    "lavorare-in-webcam": "mw_creator_work",
    "privacy-webcam-model": "mw_creator_privacy",
    "attrezzatura-webcam-model": "mw_creator_setup",
    "guadagni-webcam-model": "mw_creator_earnings",
  };
  const creatorTrack = creatorTracks[page.slug];
  const primaryHref = page.ctaHref?.startsWith("/go/model-signup") && creatorTrack
    ? `/go/model-signup?track=${creatorTrack}`
    : page.ctaHref;

  return (
    <main>
      <PlatformTabs />
      <section className={isAcademy ? "guide-hero academy" : "guide-hero"}>
        <div>
          <p className="eyebrow">{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <p>{page.intro}</p>
          {page.updated ? <p className="guide-updated">Ultimo aggiornamento {page.updated}</p> : null}
          {page.ctaHref && page.ctaLabel ? (
            <ButtonRow
              primaryHref={primaryHref}
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
      {showPrivacyChecklist ? (
        <LocalChecklist
          title="Checklist privacy webcam model"
          description="Un controllo pratico da completare prima di aprire o aggiornare il profilo pubblico."
          items={[
            "Ho scelto un nome d'arte separato",
            "Uso un indirizzo email dedicato",
            "I social pubblici sono separati da quelli personali",
            "Ho controllato lo sfondo per dettagli identificativi",
            "La posizione non è visibile o deducibile",
            "I documenti personali sono fuori dall'inquadratura",
            "Ho rivisto le impostazioni regionali di privacy",
            "Uso l'autenticazione a due fattori dove disponibile",
          ]}
          privacyNote="I dati della checklist restano nel tuo browser e non vengono inviati."
        />
      ) : null}
      {showStudio ? (
        <LocalChecklist
          title="Controllo preparazione studio"
          description="La percentuale indica soltanto quanti controlli pratici hai completato. Non è una certificazione ufficiale."
          items={[
            "Camera testata",
            "Illuminazione uniforme",
            "Audio controllato",
            "Connessione stabile",
            "Sfondo verificato",
            "Cavi fissati in sicurezza",
            "Privacy dell'inquadratura controllata",
            "Postazione comoda",
            "Connessione di riserva disponibile",
          ]}
          privacyNote="Le risposte restano in questa pagina e non vengono raccolte o inviate."
        />
      ) : null}
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
      {page.sources?.length ? (
        <section className="guide-sources" aria-labelledby="guide-sources-title">
          <h2 id="guide-sources-title">Fonti ufficiali consultate</h2>
          <div>
            {page.sources.map((source) => (
              <a href={source.href} target="_blank" rel="noopener noreferrer" key={source.href}>
                {source.label}
              </a>
            ))}
          </div>
        </section>
      ) : null}
      {page.faqs ? <FaqSection faqs={page.faqs.slice(0, isAcademy ? 6 : 4)} /> : null}
      <FinalCta track={creatorTrack} />
    </main>
  );
}
