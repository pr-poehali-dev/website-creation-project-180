import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Article, Comment, INITIAL_COMMENTS } from "@/data/blog";
import { ArticleDetail } from "@/components/ArticleViews";
import { HomePage, ArticlesPage, CategoriesPage, SearchPage } from "@/components/Pages";

const NAV_ITEMS = [
  { id: "home", label: "Главная", icon: "Home" },
  { id: "articles", label: "Статьи", icon: "FileText" },
  { id: "categories", label: "Категории", icon: "Grid3X3" },
  { id: "search", label: "Поиск", icon: "Search" },
];

export default function App() {
  const [page, setPage] = useState("home");
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [allComments, setAllComments] = useState<Comment[]>(INITIAL_COMMENTS);

  const handleArticleClick = (a: Article) => {
    setActiveArticle(a);
    setPage("article");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigate = (p: string) => {
    setPage(p);
    setActiveArticle(null);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen relative z-10">
      {/* NAV */}
      <nav className="sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl" style={{ background: "rgba(13,17,23,0.85)" }}>
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <button onClick={() => handleNavigate("home")} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--neon-orange)" }}>
              <Icon name="Bug" size={16} className="text-[#0d1117]" />
            </div>
            <span style={{ fontFamily: "Oswald, sans-serif", fontSize: "20px", letterSpacing: "0.02em" }} className="text-white font-bold">
              Dev<span style={{ color: "var(--neon-orange)" }}>Bug</span>
            </span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(n => (
              <button key={n.id} onClick={() => handleNavigate(n.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all hover:text-white relative ${page === n.id || (page === "article" && n.id === "articles") ? "nav-active text-orange-400" : "text-white/50"}`}>
                {n.label}
              </button>
            ))}
          </div>

          <button className="md:hidden text-white/60 hover:text-white transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Icon name={mobileMenuOpen ? "X" : "Menu"} size={22} />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/5 animate-fade-in-up" style={{ background: "rgba(13,17,23,0.97)" }}>
            {NAV_ITEMS.map(n => (
              <button key={n.id} onClick={() => handleNavigate(n.id)}
                className={`flex items-center gap-3 w-full px-6 py-3 text-sm transition-all ${page === n.id ? "text-orange-400" : "text-white/60"}`}>
                <Icon name={n.icon} size={16} />
                {n.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* MAIN */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-10">
        {page === "home" && <HomePage onArticleClick={handleArticleClick} onNavigate={handleNavigate} />}
        {page === "articles" && <ArticlesPage onArticleClick={handleArticleClick} />}
        {page === "categories" && <CategoriesPage onNavigate={handleNavigate} />}
        {page === "search" && <SearchPage onArticleClick={handleArticleClick} />}
        {page === "article" && activeArticle && (
          <ArticleDetail
            article={activeArticle}
            onBack={() => handleNavigate("articles")}
            allComments={allComments}
            setAllComments={setAllComments}
          />
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 mt-16" style={{ background: "var(--surface-2)" }}>
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: "var(--neon-orange)" }}>
              <Icon name="Bug" size={12} className="text-[#0d1117]" />
            </div>
            <span style={{ fontFamily: "Oswald", fontSize: "15px" }} className="text-white/60">DevBug</span>
          </div>
          <p className="text-xs text-white/20 font-mono text-center">Блог по ошибкам в Битрикс, Laravel, PHP — реальный опыт разработчиков</p>
          <div className="flex gap-3">
            {["Telegram", "GitHub"].map(s => (
              <button key={s} className="text-xs text-white/25 hover:text-orange-400 transition-colors font-mono">{s}</button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
