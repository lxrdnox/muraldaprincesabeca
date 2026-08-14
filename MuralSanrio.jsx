import { useState } from "react";

// ─── GOOGLE FONTS ────────────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Inter:wght@400;500;600&family=Space+Mono:wght@400;700&display=swap";
document.head.appendChild(fontLink);

// ─── DADOS ───────────────────────────────────────────────────────────────────
// ✏️ Para adicionar uma nova entrada, copie o modelo abaixo e preencha os campos.
const entries = [
  {
    id: 1,
    date: "2025-08-14",
    weekday: "quinta-feira",
    dateStr: "14 ago 2025",
    title: "Primeiro dia do mural 🎀",
    message:
      "Hoje resolvi criar esse cantinho especial pra você. Cada dia aqui vai ser uma lembrança nossa, guardada com muito carinho. Você merece ter um lugar só seu, cheio de amor. Te amo demais.",
    mood: "apaixonado",
    theme: "hk",
    emoji: "🌸",
    pinned: true,
    isNew: true,
    ago: "hoje",
    num: 1,
  },
  {
    id: 2,
    date: "2025-08-13",
    weekday: "quarta-feira",
    dateStr: "13 ago 2025",
    title: "Você sorriu hoje",
    message:
      "Vi você sorrir e esqueci tudo que estava pensando. É sério, você tem esse poder absurdo sobre mim.",
    mood: "apaixonado",
    theme: "mm",
    emoji: "💕",
    pinned: false,
    isNew: false,
    ago: "ontem",
    num: 2,
  },
  {
    id: 3,
    date: "2025-08-12",
    weekday: "terça-feira",
    dateStr: "12 ago 2025",
    title: "Até a saudade é boa",
    message:
      "Longe de você hoje. Mas até a saudade tem um gosto bom, porque me lembra que tenho algo muito especial pra voltar.",
    mood: "saudade",
    theme: "ku",
    emoji: "🖤",
    pinned: false,
    isNew: false,
    ago: "2 dias atrás",
    num: 3,
  },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const themeAccent = { hk: "#ff4d80", ku: "#7b4fa6", mm: "#f472b6" };
const themeGradient = {
  hk: "linear-gradient(to right,#ff4d80,#ffb7c5)",
  ku: "linear-gradient(to right,#7b4fa6,#c084fc)",
  mm: "linear-gradient(to right,#f472b6,#f9a8c9)",
};
const themeName = { hk: "Hello Kitty", ku: "Kuromi", mm: "My Melody" };
const moodStyle = {
  apaixonado: { bg: "#fff0f5", color: "#c0366a", label: "💖 apaixonado" },
  saudade:    { bg: "#f3e8ff", color: "#6b21a8", label: "💜 saudade"    },
  feliz:      { bg: "#fefce8", color: "#854d0e", label: "✨ feliz"      },
  animado:    { bg: "#f0fdf4", color: "#166534", label: "🌟 animado"    },
};

// ─── ESTILOS INLINE BASE ───────────────────────────────────────────────────────
const s = {
  body: {
    fontFamily: "'Inter', sans-serif",
    background: "#fdf4f8",
    color: "#1a0a14",
    minHeight: "100vh",
    margin: 0,
  },

  // topnav
  topnav: {
    background: "#fff",
    borderBottom: "1px solid #f0d6e4",
    padding: "0 28px",
    height: 52,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  navBrand: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 900,
    fontSize: 15,
    color: "#3d1b30",
    letterSpacing: "-0.3px",
  },
  navLinks: { display: "flex", alignItems: "center", gap: 4 },
  navBadge: {
    background: "linear-gradient(135deg,#ff6fa8,#a855f7)",
    color: "#fff",
    fontSize: 10,
    fontFamily: "'Space Mono', monospace",
    padding: "3px 10px",
    borderRadius: 50,
    fontWeight: 700,
  },

  // hero
  hero: {
    background: "#fff",
    borderBottom: "1px solid #f0d6e4",
    padding: "36px 28px 28px",
    display: "flex",
    alignItems: "flex-start",
    gap: 32,
    flexWrap: "wrap",
  },
  heroLeft: { flex: 1, minWidth: 220 },
  heroEyebrow: {
    fontFamily: "'Space Mono', monospace",
    fontSize: 10,
    color: "#c0366a",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    marginBottom: 8,
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  heroEyebrowLine: {
    display: "inline-block",
    width: 16,
    height: 1.5,
    background: "#c0366a",
    borderRadius: 2,
  },
  heroH1: {
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 900,
    fontSize: 28,
    color: "#1a0a14",
    lineHeight: 1.2,
    letterSpacing: "-0.5px",
    marginBottom: 8,
    margin: "0 0 8px 0",
  },
  heroSpan: { color: "#c0366a" },
  heroSub: {
    fontSize: 13,
    color: "#7a4060",
    lineHeight: 1.6,
    maxWidth: 400,
    marginBottom: 18,
    margin: "0 0 18px 0",
  },
  heroStats: { display: "flex", gap: 20, alignItems: "center" },
  statNum: {
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 900,
    fontSize: 22,
    color: "#1a0a14",
    lineHeight: 1,
  },
  statLabel: {
    fontFamily: "'Space Mono', monospace",
    fontSize: 10,
    color: "#b07090",
    letterSpacing: "0.5px",
  },
  statDivider: { width: 1, height: 32, background: "#f0d6e4" },

  // char pills
  charPillBase: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    padding: "5px 12px 5px 8px",
    borderRadius: 50,
    fontSize: 11,
    fontWeight: 600,
    border: "1px solid",
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "transform 0.15s",
  },
  charDot: { width: 8, height: 8, borderRadius: "50%", display: "inline-block" },

  // filter bar
  filterbar: {
    padding: "12px 28px",
    display: "flex",
    alignItems: "center",
    gap: 8,
    borderBottom: "1px solid #f0d6e4",
    background: "#fff",
    flexWrap: "wrap",
  },
  filterLabel: {
    fontFamily: "'Space Mono', monospace",
    fontSize: 10,
    color: "#b07090",
    letterSpacing: "0.5px",
    marginRight: 4,
  },

  // layout
  layout: { display: "flex", minHeight: "calc(100vh - 200px)" },

  // sidebar
  sidebar: {
    width: 200,
    flexShrink: 0,
    padding: "20px 0",
    borderRight: "1px solid #f0d6e4",
    background: "#fff",
  },
  sidebarSection: { padding: "0 16px", marginBottom: 20 },
  sidebarTitle: {
    fontFamily: "'Space Mono', monospace",
    fontSize: 9,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "#c0a0b4",
    marginBottom: 8,
    paddingBottom: 6,
    borderBottom: "1px solid #f8edf4",
  },
  sidebarNum: {
    marginLeft: "auto",
    fontFamily: "'Space Mono', monospace",
    fontSize: 9,
    color: "#d4a0bc",
  },

  // content
  content: { flex: 1, padding: "24px", minWidth: 0 },

  // month header
  monthHeader: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
    marginTop: 4,
  },
  monthTitle: {
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 800,
    fontSize: 13,
    color: "#3d1b30",
    letterSpacing: "-0.2px",
    whiteSpace: "nowrap",
  },
  monthLine: {
    flex: 1,
    height: 1,
    background: "linear-gradient(to right,#f0d6e4,transparent)",
  },
  monthCount: {
    fontFamily: "'Space Mono', monospace",
    fontSize: 9,
    color: "#d4a0bc",
    whiteSpace: "nowrap",
  },

  // cards grid
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: 12,
    marginBottom: 28,
  },

  // footer
  pageFooter: {
    textAlign: "center",
    padding: 20,
    fontFamily: "'Space Mono', monospace",
    fontSize: 10,
    color: "#d4a0bc",
    borderTop: "1px solid #f0d6e4",
    letterSpacing: "0.5px",
    background: "#fff",
  },
};

// ─── SUB-COMPONENTES ──────────────────────────────────────────────────────────

function NavLink({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontSize: 12,
        fontWeight: 500,
        color: active ? "#c0366a" : "#7a4060",
        padding: "5px 10px",
        borderRadius: 6,
        cursor: "pointer",
        border: "none",
        background: active ? "#ffe0f0" : "none",
        transition: "background 0.15s",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {children}
    </button>
  );
}

function CharPill({ theme }) {
  const styles = {
    hk: { background: "#fff0f5", borderColor: "#ffc0d4", color: "#9b2447", dot: "#ff4d80" },
    ku: { background: "#f5f0ff", borderColor: "#c4a8f0", color: "#5b2d96", dot: "#7b4fa6" },
    mm: { background: "#fff0f8", borderColor: "#f8b0d8", color: "#9b1a6a", dot: "#f472b6" },
  }[theme];
  return (
    <div style={{ ...s.charPillBase, background: styles.background, borderColor: styles.borderColor, color: styles.color }}>
      <span style={{ ...s.charDot, background: styles.dot }} />
      {themeName[theme]}
    </div>
  );
}

function FilterBtn({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontSize: 11,
        fontWeight: 600,
        padding: "4px 12px",
        borderRadius: 50,
        border: `1px solid ${active ? "#f472b6" : "#f0d6e4"}`,
        background: active ? "#ffe0f0" : "none",
        color: active ? "#c0366a" : "#7a4060",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 5,
        fontFamily: "'Inter', sans-serif",
        transition: "all 0.15s",
      }}
    >
      {children}
    </button>
  );
}

function FilterCount({ active, children }) {
  return (
    <span style={{
      background: active ? "#f472b6" : "#f0d6e4",
      color: active ? "#fff" : "#9b3060",
      fontFamily: "'Space Mono', monospace",
      fontSize: 9,
      padding: "1px 5px",
      borderRadius: 50,
    }}>
      {children}
    </span>
  );
}

function SidebarItem({ icon, label, count, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        padding: "6px 8px",
        borderRadius: 6,
        fontSize: 12,
        color: active ? "#c0366a" : "#7a4060",
        background: active ? "#ffe0f0" : "none",
        fontWeight: active ? 600 : 400,
        cursor: "pointer",
        marginBottom: 1,
        transition: "background 0.12s",
      }}
    >
      {icon && <span style={{ fontSize: 13 }}>{icon}</span>}
      {label}
      <span style={s.sidebarNum}>{count}</span>
    </div>
  );
}

function MoodTag({ mood }) {
  const m = moodStyle[mood] || moodStyle.apaixonado;
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      fontSize: 10,
      fontWeight: 600,
      padding: "2px 8px",
      borderRadius: 50,
      background: m.bg,
      color: m.color,
      fontFamily: "'Inter', sans-serif",
    }}>
      {m.label}
    </span>
  );
}

function CardAccent({ theme }) {
  return <div style={{ height: 3, width: "100%", background: themeGradient[theme] }} />;
}

// Card normal (não featured)
function MuralCard({ entry }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: entry.pinned ? "linear-gradient(to bottom,#fffdf0,#fff)" : "#fff",
        border: `1px solid ${entry.pinned ? (hovered ? "#f0c000" : "#ffd700") : (hovered ? "#f0a0c0" : "#f0d6e4")}`,
        borderRadius: 10,
        overflow: "hidden",
        transition: "border-color 0.18s, transform 0.18s, box-shadow 0.18s",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        transform: hovered ? "translateY(-3px)" : "none",
        boxShadow: hovered ? "0 8px 24px rgba(192,54,106,0.10)" : "none",
      }}
    >
      <CardAccent theme={entry.theme} />
      {entry.pinned && (
        <span style={{
          position: "absolute", top: 11, right: 11,
          fontFamily: "'Space Mono', monospace", fontSize: 8,
          background: "#ffd700", color: "#78350f",
          padding: "2px 6px", borderRadius: 4, letterSpacing: "0.5px", fontWeight: 700,
        }}>
          📌 fixado
        </span>
      )}
      {entry.isNew && (
        <span style={{
          position: "absolute", top: 11, left: 11,
          fontFamily: "'Nunito', sans-serif", fontSize: 9, fontWeight: 800,
          background: "#ff4d80", color: "#fff",
          padding: "2px 7px", borderRadius: 4,
        }}>
          ✨ novo
        </span>
      )}

      {/* body */}
      <div style={{ padding: "14px 16px 12px", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, marginTop: (entry.pinned || entry.isNew) ? 14 : 0 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.8px", color: themeAccent[entry.theme] }}>
              {entry.weekday}
            </span>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#c0a0b4" }}>
              {entry.dateStr}
            </span>
          </div>
          <span style={{ fontSize: 20 }}>{entry.emoji}</span>
        </div>
        <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 14, color: "#1a0a14", lineHeight: 1.3, marginBottom: 6, letterSpacing: "-0.2px" }}>
          {entry.title}
        </div>
        <div style={{ fontSize: 12, color: "#7a4060", lineHeight: 1.65, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {entry.message}
        </div>
      </div>

      {/* footer */}
      <div style={{ padding: "8px 16px 10px", borderTop: "1px solid #fae8f2", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <MoodTag mood={entry.mood} />
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#d4a0bc" }}>{entry.ago}</span>
      </div>
    </div>
  );
}

// Card featured (pinned em destaque — ocupa linha inteira)
function FeaturedCard({ entry }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        gridColumn: "1 / -1",
        background: "linear-gradient(to bottom,#fffdf0,#fff)",
        border: `1px solid ${hovered ? "#f0c000" : "#ffd700"}`,
        borderRadius: 10,
        overflow: "hidden",
        transition: "border-color 0.18s, transform 0.18s, box-shadow 0.18s",
        cursor: "pointer",
        position: "relative",
        transform: hovered ? "translateY(-3px)" : "none",
        boxShadow: hovered ? "0 8px 24px rgba(192,54,106,0.10)" : "none",
      }}
    >
      <CardAccent theme={entry.theme} />
      <span style={{
        position: "absolute", top: 11, right: 11,
        fontFamily: "'Space Mono', monospace", fontSize: 8,
        background: "#ffd700", color: "#78350f",
        padding: "2px 6px", borderRadius: 4, fontWeight: 700,
      }}>
        📌 fixado
      </span>
      {entry.isNew && (
        <span style={{
          position: "absolute", top: 11, left: 11,
          fontFamily: "'Nunito', sans-serif", fontSize: 9, fontWeight: 800,
          background: "#ff4d80", color: "#fff",
          padding: "2px 7px", borderRadius: 4,
        }}>
          ✨ novo
        </span>
      )}

      {/* body em grid */}
      <div style={{ padding: "14px 16px 12px", display: "grid", gridTemplateColumns: "auto 1fr", gap: 16, alignItems: "start", marginTop: 14 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
          <span style={{ fontSize: 36 }}>{entry.emoji}</span>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#c0a0b4", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            {themeName[entry.theme]}
          </span>
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.8px", color: themeAccent[entry.theme] }}>
                {entry.weekday}
              </span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#c0a0b4" }}>
                {entry.dateStr}
              </span>
            </div>
            <MoodTag mood={entry.mood} />
          </div>
          <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 15, color: "#1a0a14", lineHeight: 1.3, marginBottom: 6 }}>
            {entry.title}
          </div>
          <div style={{ fontSize: 12, color: "#7a4060", lineHeight: 1.65 }}>
            {entry.message}
          </div>
        </div>
      </div>

      <div style={{ padding: "8px 16px 10px", borderTop: "1px solid #fae8f2", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#d4a0bc" }}>{entry.ago}</span>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#d4a0bc" }}>entrada #{entry.num}</span>
      </div>
    </div>
  );
}

// ─── APP PRINCIPAL ────────────────────────────────────────────────────────────
export default function App() {
  const [activeFilter, setActiveFilter] = useState("todos");
  const [activeSideMonth, setActiveSideMonth] = useState("ago2025");
  const [activeNav, setActiveNav] = useState("todos");

  // Filtragem
  const filtered = entries.filter((e) => {
    if (activeFilter === "todos") return true;
    if (activeFilter === "apaixonado") return e.mood === "apaixonado";
    if (activeFilter === "saudade") return e.mood === "saudade";
    if (activeFilter === "fixados") return e.pinned;
    return true;
  });

  // Stats
  const total = entries.length;
  const countMood = (m) => entries.filter((e) => e.mood === m).length;
  const countPinned = entries.filter((e) => e.pinned).length;
  const countTheme = (t) => entries.filter((e) => e.theme === t).length;

  return (
    <div style={s.body}>

      {/* ── TOP NAV ── */}
      <nav style={s.topnav}>
        <div style={s.navBrand}>
          <span style={{ fontSize: 18 }}>🎀</span>
          mural da minha vida
        </div>
        <div style={s.navLinks}>
          {["todos", "agosto", "julho"].map((n) => (
            <NavLink key={n} active={activeNav === n} onClick={() => setActiveNav(n)}>
              {n}
            </NavLink>
          ))}
          <span style={s.navBadge}>✨ {total} dias</span>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={s.hero}>
        <div style={s.heroLeft}>
          <div style={s.heroEyebrow}>
            <span style={s.heroEyebrowLine} />
            diário visual
          </div>
          <h1 style={s.heroH1}>
            um cantinho<br />
            <span style={s.heroSpan}>só nosso</span> 🌸
          </h1>
          <p style={s.heroSub}>
            Cada entrada é uma memória guardada com carinho. Um dia de cada vez, pra você.
          </p>
          <div style={s.heroStats}>
            {[
              { num: total, label: "entradas" },
              null,
              { num: total, label: "dias juntos" },
              null,
              { num: "∞", label: "amor" },
            ].map((item, i) =>
              item === null ? (
                <div key={i} style={s.statDivider} />
              ) : (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <span style={s.statNum}>{item.num}</span>
                  <span style={s.statLabel}>{item.label}</span>
                </div>
              )
            )}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {["hk", "ku", "mm"].map((t) => <CharPill key={t} theme={t} />)}
        </div>
      </section>

      {/* ── FILTER BAR ── */}
      <div style={s.filterbar}>
        <span style={s.filterLabel}>filtrar</span>
        {[
          { key: "todos",      label: "Todos",           count: total },
          { key: "apaixonado", label: "💖 apaixonado",   count: countMood("apaixonado") },
          { key: "saudade",    label: "💜 saudade",      count: countMood("saudade") },
          { key: "fixados",    label: "📌 fixados",      count: countPinned },
        ].map(({ key, label, count }) => (
          <FilterBtn key={key} active={activeFilter === key} onClick={() => setActiveFilter(key)}>
            {label}
            <FilterCount active={activeFilter === key}>{count}</FilterCount>
          </FilterBtn>
        ))}
      </div>

      {/* ── LAYOUT ── */}
      <div style={s.layout}>

        {/* ── SIDEBAR ── */}
        <aside style={s.sidebar}>
          <div style={s.sidebarSection}>
            <div style={s.sidebarTitle}>meses</div>
            <SidebarItem icon="🌸" label="agosto 2025" count={total}
              active={activeSideMonth === "ago2025"}
              onClick={() => setActiveSideMonth("ago2025")} />
            <SidebarItem icon="🌷" label="julho 2025" count={0}
              active={activeSideMonth === "jul2025"}
              onClick={() => setActiveSideMonth("jul2025")} />
          </div>

          <div style={s.sidebarSection}>
            <div style={s.sidebarTitle}>personagem</div>
            {[
              { t: "hk", color: "#ff4d80", name: "Hello Kitty" },
              { t: "ku", color: "#7b4fa6", name: "Kuromi" },
              { t: "mm", color: "#f472b6", name: "My Melody" },
            ].map(({ t, color, name }) => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 7, padding: "6px 8px", borderRadius: 6, fontSize: 12, color: "#7a4060", cursor: "default", marginBottom: 1 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block" }} />
                {name}
                <span style={s.sidebarNum}>{countTheme(t)}</span>
              </div>
            ))}
          </div>

          <div style={s.sidebarSection}>
            <div style={s.sidebarTitle}>humor</div>
            {[
              { key: "apaixonado", label: "💖 apaixonado" },
              { key: "saudade",    label: "💜 saudade"    },
              { key: "feliz",      label: "✨ feliz"      },
            ].map(({ key, label }) => (
              <div key={key} style={{ display: "flex", alignItems: "center", gap: 7, padding: "6px 8px", borderRadius: 6, fontSize: 12, color: "#7a4060", cursor: "default", marginBottom: 1 }}>
                {label}
                <span style={s.sidebarNum}>{countMood(key)}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* ── CONTEÚDO ── */}
        <main style={s.content}>
          <div style={s.monthHeader}>
            <span style={s.monthTitle}>🌸 agosto 2025</span>
            <div style={s.monthLine} />
            <span style={s.monthCount}>{filtered.length} entradas</span>
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 0", color: "#c0a0b4", fontFamily: "'Space Mono', monospace", fontSize: 12 }}>
              nenhuma entrada encontrada 🌸
            </div>
          ) : (
            <div style={s.cardsGrid}>
              {filtered.map((entry) =>
                entry.pinned && entry.isNew
                  ? <FeaturedCard key={entry.id} entry={entry} />
                  : <MuralCard key={entry.id} entry={entry} />
              )}
            </div>
          )}
        </main>
      </div>

      {/* ── FOOTER ── */}
      <footer style={s.pageFooter}>
        feito com 💜 pra você, todos os dias
      </footer>
    </div>
  );
}
