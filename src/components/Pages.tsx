import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Article, ARTICLES, CATEGORIES } from "@/data/blog";
import { ArticleCard } from "@/components/ArticleViews";

/* ─── HomePage ──────────────────────────────────────────── */
export function HomePage({ onArticleClick, onNavigate }: { onArticleClick: (a: Article) => void; onNavigate: (p: string) => void }) {
  return (
    <div>
      {/* Hero */}
      <section className="relative py-16 md:py-24 overflow-hidden mb-12 rounded-2xl px-8 md:px-12">
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <img
            src="https://cdn.poehali.dev/projects/089f4faf-4af0-4a10-8d3d-7904ddec402e/files/75641f00-1679-4001-8fed-09cd05a2f986.jpg"
            alt="hero"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(13,17,23,0.97) 0%, rgba(13,17,23,0.75) 100%)" }} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-5 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-xs text-white/40 font-mono uppercase tracking-widest">Live — новые статьи каждую неделю</span>
          </div>
          <h1 style={{ fontFamily: "Oswald, sans-serif", fontSize: "clamp(36px, 6vw, 68px)", lineHeight: "1.05", letterSpacing: "-0.01em" }}
            className="text-white font-bold mb-5 animate-fade-in-up stagger-1">
            Разбираем <span className="gradient-text">ошибки</span><br />
            в Битрикс, Laravel<br />
            и PHP
          </h1>
          <p className="text-white/50 text-base md:text-lg max-w-xl leading-relaxed animate-fade-in-up stagger-2 mb-8">
            Реальные решения реальных проблем. Без воды — только рабочий код и объяснение почему это происходит.
          </p>
          <div className="flex flex-wrap gap-3 animate-fade-in-up stagger-3">
            <button
              onClick={() => onNavigate("articles")}
              className="px-6 py-3 rounded-lg font-semibold text-sm transition-all hover:scale-105 hover:brightness-110"
              style={{ background: "var(--neon-orange)", color: "#0d1117", fontFamily: "Oswald", fontSize: "15px" }}>
              Все статьи
            </button>
            <button
              onClick={() => onNavigate("categories")}
              className="px-6 py-3 rounded-lg font-semibold text-sm border border-white/15 text-white/70 hover:border-orange-400/40 hover:text-white transition-all"
              style={{ fontFamily: "Oswald", fontSize: "15px" }}>
              По категориям
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { val: "238", label: "Статей", icon: "FileText" },
          { val: "14.2K", label: "Читателей", icon: "Users" },
          { val: "847", label: "Комментариев", icon: "MessageSquare" },
          { val: "4", label: "Технологии", icon: "Code2" },
        ].map((s, i) => (
          <div key={s.label} className={`animate-fade-in-up stagger-${i + 1} rounded-xl border border-white/5 p-4 text-center`} style={{ background: "var(--surface-2)" }}>
            <Icon name={s.icon} size={20} className="mx-auto mb-2 text-orange-400" />
            <div style={{ fontFamily: "Oswald", fontSize: "26px" }} className="text-white font-bold">{s.val}</div>
            <div className="text-xs text-white/35 font-mono mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Latest articles */}
      <div className="flex items-center justify-between mb-6">
        <h2 style={{ fontFamily: "Oswald, sans-serif", fontSize: "24px" }} className="text-white font-semibold">
          Свежие статьи
        </h2>
        <button onClick={() => onNavigate("articles")} className="text-sm text-orange-400 hover:text-orange-300 transition-colors font-mono flex items-center gap-1">
          Все <Icon name="ChevronRight" size={14} />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        {ARTICLES.slice(0, 4).map((a, i) => (
          <ArticleCard key={a.id} article={a} onClick={() => onArticleClick(a)} delay={i + 1} />
        ))}
      </div>

      {/* Popular tags */}
      <h2 style={{ fontFamily: "Oswald, sans-serif", fontSize: "24px" }} className="text-white font-semibold mb-4">
        Популярные темы
      </h2>
      <div className="flex flex-wrap gap-2">
        {["Авторизация", "N+1 проблема", "Кеш", "REST API", "Очереди", "PHP 8.2", "Webhook", "ORM", "Миграции", "Debug"].map(t => (
          <button key={t} onClick={() => onNavigate("search")}
            className="px-3 py-1.5 rounded-lg text-sm border border-white/8 text-white/50 hover:border-orange-400/40 hover:text-orange-400 transition-all font-mono">
            #{t}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── ArticlesPage ──────────────────────────────────────── */
export function ArticlesPage({ onArticleClick }: { onArticleClick: (a: Article) => void }) {
  const [filter, setFilter] = useState<string>("Все");
  const tags = ["Все", "Битрикс", "Битрикс24", "Laravel", "PHP"];
  const filtered = filter === "Все" ? ARTICLES : ARTICLES.filter(a => a.tag === filter);

  return (
    <div>
      <h1 style={{ fontFamily: "Oswald, sans-serif", fontSize: "clamp(28px, 4vw, 40px)" }} className="text-white font-bold mb-2">
        Все статьи
      </h1>
      <p className="text-white/40 text-sm font-mono mb-6">{ARTICLES.length} материалов</p>

      <div className="flex gap-2 flex-wrap mb-8">
        {tags.map(t => (
          <button key={t}
            onClick={() => setFilter(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filter === t ? "text-[#0d1117]" : "border border-white/10 text-white/50 hover:border-orange-400/30 hover:text-white"}`}
            style={filter === t ? { background: "var(--neon-orange)", fontFamily: "Oswald" } : { fontFamily: "Oswald" }}>
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((a, i) => (
          <ArticleCard key={a.id} article={a} onClick={() => onArticleClick(a)} delay={i + 1} />
        ))}
      </div>
    </div>
  );
}

/* ─── CategoriesPage ────────────────────────────────────── */
export function CategoriesPage({ onNavigate }: { onNavigate: (p: string) => void }) {
  return (
    <div>
      <h1 style={{ fontFamily: "Oswald, sans-serif", fontSize: "clamp(28px, 4vw, 40px)" }} className="text-white font-bold mb-2">
        Категории
      </h1>
      <p className="text-white/40 text-sm font-mono mb-8">Найди статью по технологии или теме</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {CATEGORIES.slice(0, 4).map((cat, i) => (
          <div key={cat.name}
            className={`card-hover animate-fade-in-up stagger-${i + 1} cursor-pointer rounded-xl border border-white/5 p-6 text-center`}
            style={{ background: "var(--surface-2)" }}
            onClick={() => onNavigate("articles")}>
            <Icon name={cat.icon} size={32} className="mx-auto mb-3 text-orange-400" />
            <div style={{ fontFamily: "Oswald", fontSize: "22px" }} className="text-white font-bold mb-1">{cat.name}</div>
            <div className="text-sm text-white/30 font-mono">{cat.count} статей</div>
          </div>
        ))}
      </div>

      <h2 style={{ fontFamily: "Oswald", fontSize: "22px" }} className="text-white font-semibold mb-4">Темы</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CATEGORIES.slice(4).map((cat) => (
          <div key={cat.name}
            className="card-hover cursor-pointer flex items-center justify-between rounded-xl border border-white/5 px-5 py-4"
            style={{ background: "var(--surface-2)" }}
            onClick={() => onNavigate("articles")}>
            <div className="flex items-center gap-3">
              <Icon name={cat.icon} size={18} className="text-white/40" />
              <span className="text-white/80 font-medium">{cat.name}</span>
            </div>
            <span className="text-xs text-white/30 font-mono">{cat.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── SearchPage ────────────────────────────────────────── */
export function SearchPage({ onArticleClick }: { onArticleClick: (a: Article) => void }) {
  const [query, setQuery] = useState("");
  const results = query.length > 1
    ? ARTICLES.filter(a =>
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.excerpt.toLowerCase().includes(query.toLowerCase()) ||
        a.tag.toLowerCase().includes(query.toLowerCase()) ||
        a.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div>
      <h1 style={{ fontFamily: "Oswald, sans-serif", fontSize: "clamp(28px, 4vw, 40px)" }} className="text-white font-bold mb-2">
        Поиск
      </h1>
      <p className="text-white/40 text-sm font-mono mb-6">Ищи по заголовку, тегу или теме</p>

      <div className="relative mb-8">
        <Icon name="Search" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Например: N+1, токен, очередь, кеш..."
          className="search-glow w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-5 py-4 text-base text-white placeholder-white/20 outline-none transition-all"
          autoFocus
        />
        {query && (
          <button onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
            <Icon name="X" size={16} />
          </button>
        )}
      </div>

      {query.length > 1 && (
        <p className="text-sm text-white/30 font-mono mb-4">
          {results.length > 0 ? `Найдено: ${results.length}` : "Ничего не найдено"}
        </p>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map((a, i) => (
            <ArticleCard key={a.id} article={a} onClick={() => onArticleClick(a)} delay={i + 1} />
          ))}
        </div>
      )}

      {query.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Search" size={48} className="mx-auto mb-4 text-white/10" />
          <p className="text-white/25 font-mono text-sm">Начни вводить запрос</p>
        </div>
      )}

      {query.length > 1 && results.length === 0 && (
        <div className="text-center py-12">
          <Icon name="SearchX" size={48} className="mx-auto mb-4 text-white/10" />
          <p className="text-white/40 mb-1">Ничего не найдено</p>
          <p className="text-white/20 text-sm font-mono">Попробуй другой запрос</p>
        </div>
      )}
    </div>
  );
}
