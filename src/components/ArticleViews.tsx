import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Article, Comment, TAG_STYLE } from "@/data/blog";

/* ─── ArticleCard ───────────────────────────────────────── */
export function ArticleCard({ article, onClick, delay = 1 }: { article: Article; onClick: () => void; delay?: number }) {
  return (
    <div
      className={`card-hover animate-fade-in-up stagger-${Math.min(delay, 5)} cursor-pointer rounded-xl border border-white/5 p-6`}
      style={{ background: "var(--surface-2)" }}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className={`tag-badge ${TAG_STYLE[article.tag]}`}>{article.tag}</span>
        <span className="text-xs text-white/30 font-mono">{article.date}</span>
      </div>
      <h3 className="font-semibold leading-snug mb-2 text-white/90 hover:text-white transition-colors"
        style={{ fontFamily: "Oswald, sans-serif", fontSize: "18px", lineHeight: "1.3" }}>
        {article.title}
      </h3>
      <p className="text-sm text-white/50 leading-relaxed mb-4 line-clamp-2">{article.excerpt}</p>
      <div className="flex items-center gap-4 text-xs text-white/30 font-mono">
        <span className="flex items-center gap-1"><Icon name="Eye" size={12} /> {article.views.toLocaleString()}</span>
        <span className="flex items-center gap-1"><Icon name="MessageSquare" size={12} /> {article.comments}</span>
        <span className="flex items-center gap-1"><Icon name="Clock" size={12} /> {article.readTime} мин</span>
        <span className="ml-auto text-white/20">{article.category}</span>
      </div>
    </div>
  );
}

/* ─── CommentSection ────────────────────────────────────── */
export function CommentSection({ articleId, allComments, setAllComments }: {
  articleId: number;
  allComments: Comment[];
  setAllComments: React.Dispatch<React.SetStateAction<Comment[]>>;
}) {
  const comments = allComments.filter(c => c.articleId === articleId);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    const newComment: Comment = {
      id: Date.now(),
      articleId,
      author: name,
      text,
      date: "только что",
      role: "Читатель",
    };
    setAllComments(prev => [...prev, newComment]);
    setName("");
    setText("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="mt-10">
      <div className="flex items-center gap-3 mb-6">
        <Icon name="MessageSquare" size={20} className="text-orange-400" />
        <h3 style={{ fontFamily: "Oswald, sans-serif", fontSize: "22px" }} className="text-white font-semibold">
          Обсуждение <span className="text-white/30 text-base font-normal">({comments.length})</span>
        </h3>
      </div>

      {comments.length > 0 && (
        <div className="space-y-4 mb-8">
          {comments.map((c) => (
            <div key={c.id} className="comment-thread">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: "rgba(255,107,26,0.2)", color: "var(--neon-orange)", fontFamily: "Oswald" }}>
                  {c.author[0].toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-white/80">{c.author}</span>
                <span className="text-xs px-2 py-0.5 rounded text-white/30 bg-white/5">{c.role}</span>
                <span className="text-xs text-white/25 ml-auto font-mono">{c.date}</span>
              </div>
              <p className="text-sm text-white/60 leading-relaxed pl-9">{c.text}</p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-xl border border-white/8 p-5 space-y-3" style={{ background: "var(--surface-2)" }}>
        <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider font-mono">Оставить комментарий</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Ваше имя"
            className="search-glow rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none transition-all"
          />
          <input placeholder="Ваша роль (необязательно)"
            className="search-glow rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none transition-all" />
        </div>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Опишите опыт, задайте вопрос или поделитесь решением..."
          rows={3}
          className="search-glow w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none transition-all resize-none"
        />
        <div className="flex items-center justify-between">
          {submitted
            ? <span className="text-sm text-green-400 flex items-center gap-1"><Icon name="CheckCircle" size={14} /> Комментарий добавлен!</span>
            : <span />
          }
          <button
            type="submit"
            className="px-5 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 hover:brightness-110"
            style={{ background: "var(--neon-orange)", color: "#0d1117", fontFamily: "Oswald" }}>
            Отправить
          </button>
        </div>
      </form>
    </div>
  );
}

/* ─── ArticleDetail ─────────────────────────────────────── */
export function ArticleDetail({ article, onBack, allComments, setAllComments }: {
  article: Article;
  onBack: () => void;
  allComments: Comment[];
  setAllComments: React.Dispatch<React.SetStateAction<Comment[]>>;
}) {
  return (
    <div className="animate-fade-in-up max-w-3xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-white/40 hover:text-orange-400 transition-colors mb-8 font-mono">
        <Icon name="ArrowLeft" size={16} /> Назад к статьям
      </button>

      <div className="mb-4 flex items-center gap-3 flex-wrap">
        <span className={`tag-badge ${TAG_STYLE[article.tag]}`}>{article.tag}</span>
        <span className="text-xs text-white/30 font-mono">{article.category}</span>
        <span className="text-xs text-white/20 font-mono ml-auto">{article.date}</span>
      </div>

      <h1 style={{ fontFamily: "Oswald, sans-serif", fontSize: "clamp(26px, 4vw, 38px)", lineHeight: "1.15" }} className="text-white font-bold mb-4">
        {article.title}
      </h1>

      <div className="hero-line mb-6" />

      <div className="flex items-center gap-6 text-xs text-white/30 font-mono mb-8">
        <span className="flex items-center gap-1"><Icon name="Eye" size={12} /> {article.views.toLocaleString()} просмотров</span>
        <span className="flex items-center gap-1"><Icon name="Clock" size={12} /> {article.readTime} мин чтения</span>
        <span className="flex items-center gap-1"><Icon name="MessageSquare" size={12} /> {article.comments} комментариев</span>
      </div>

      <p className="text-white/60 text-base leading-relaxed mb-8 p-4 rounded-lg border-l-2 border-orange-400/40" style={{ background: "rgba(255,107,26,0.05)" }}>
        {article.excerpt}
      </p>

      <div className="space-y-4 text-white/70 leading-relaxed">
        {article.content.split('\n\n').map((block, i) => {
          if (block.startsWith('```')) {
            const code = block.replace(/```[a-z]*\n?/, '').replace(/```$/, '');
            return <div key={i} className="code-snippet">{code}</div>;
          }
          if (block.startsWith('**') && block.endsWith(':**')) {
            return <p key={i} className="font-semibold text-white/90 mt-6">{block.replace(/\*\*/g, '')}</p>;
          }
          return <p key={i}>{block}</p>;
        })}
      </div>

      <CommentSection articleId={article.id} allComments={allComments} setAllComments={setAllComments} />
    </div>
  );
}
