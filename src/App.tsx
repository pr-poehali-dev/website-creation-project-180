import { useState } from "react";
import Icon from "@/components/ui/icon";

/* ─── DATA ─────────────────────────────────────────────── */
type Tag = "Битрикс" | "Битрикс24" | "Laravel" | "PHP";

interface Article {
  id: number;
  title: string;
  excerpt: string;
  tag: Tag;
  date: string;
  readTime: number;
  views: number;
  comments: number;
  category: string;
  content: string;
}

interface Comment {
  id: number;
  articleId: number;
  author: string;
  text: string;
  date: string;
  role: string;
}

const ARTICLES: Article[] = [
  {
    id: 1,
    title: "Ошибка «Invalid token» при OAuth авторизации в Битрикс24",
    excerpt: "Разбираем частую проблему с токенами при интеграции сторонних приложений через REST API Битрикс24 и находим рабочее решение.",
    tag: "Битрикс24",
    date: "12 мая 2026",
    readTime: 7,
    views: 3241,
    comments: 14,
    category: "Авторизация",
    content: `Проблема возникает при истечении срока действия access_token. Битрикс24 возвращает код 401 с телом {"error":"invalid_token"}.

Причина в том, что access_token живёт всего 1 час. Если приложение не обновляет токен автоматически — авторизация ломается.

**Решение — автообновление через refresh_token:**

\`\`\`php
$result = CRest::call('auth.refresh', [
    'grant_type' => 'refresh_token',
    'client_id' => CLIENT_ID,
    'client_secret' => CLIENT_SECRET,
    'refresh_token' => $refreshToken
]);
\`\`\`

Храните время истечения токена и обновляйте за 5 минут до его конца. Это поможет избежать разрывов в работе интеграции.`,
  },
  {
    id: 2,
    title: "Laravel: N+1 проблема в Eloquent и как её победить",
    excerpt: "Детальный разбор N+1 query problem в Laravel с примерами eager loading через with() и реальными метриками производительности.",
    tag: "Laravel",
    date: "9 мая 2026",
    readTime: 10,
    views: 5812,
    comments: 28,
    category: "Производительность",
    content: `N+1 проблема — одна из самых распространённых причин медленной работы Laravel приложений.

**Плохой код (запрос на каждую итерацию):**

\`\`\`php
$posts = Post::all();
foreach ($posts as $post) {
    echo $post->author->name;
}
\`\`\`

**Решение с eager loading:**

\`\`\`php
$posts = Post::with('author')->get();
foreach ($posts as $post) {
    echo $post->author->name;
}
\`\`\`

Используйте Laravel Debugbar для отслеживания количества запросов в реальном времени. Разница может быть от 100+ запросов до 2.`,
  },
  {
    id: 3,
    title: "PHP 8.2: deprecated Dynamic Properties — как мигрировать",
    excerpt: "В PHP 8.2 динамические свойства устарели и вызывают предупреждения. Объясняем, как правильно обновить код без потери функциональности.",
    tag: "PHP",
    date: "5 мая 2026",
    readTime: 6,
    views: 2190,
    comments: 9,
    category: "Миграция",
    content: `PHP 8.2 объявил динамические свойства устаревшими. В PHP 9.0 они будут полностью удалены.

**Старый код (вызывает Deprecated notice):**

\`\`\`php
class User {
    public function setData() {
        $this->name = 'John';
    }
}
\`\`\`

**Правильное исправление:**

\`\`\`php
class User {
    public string $name = '';

    public function setData() {
        $this->name = 'John';
    }
}
\`\`\`

Или используйте атрибут #[AllowDynamicProperties] как временное решение при работе со старым легаси-кодом.`,
  },
  {
    id: 4,
    title: "Битрикс: кеш не сбрасывается после обновления данных",
    excerpt: "Классическая ловушка разработчика — данные обновились в базе, но на сайте всё равно показывается старое. Разбираем работу кеша Битрикс.",
    tag: "Битрикс",
    date: "2 мая 2026",
    readTime: 8,
    views: 4103,
    comments: 22,
    category: "Кеширование",
    content: `Битрикс использует многоуровневое кеширование. При обновлении данных нужно явно указывать теги кеша для корректного сброса.

**Запись с тегом кеша:**

\`\`\`php
$cache = Cache::createInstance();
if ($cache->initCache(3600, 'my_cache_id', '/my/path')) {
    $data = $cache->getVars();
} else {
    $cache->startDataCache();
    $GLOBALS["CACHE_MANAGER"]->RegisterTag("my_tag");
    $data = getDataFromDB();
    $cache->endDataCache($data);
}
\`\`\`

**Сброс кеша по тегу:**

\`\`\`php
BXClearCache(true, "my_tag");
\`\`\`

Без тегов вы будете вынуждены сбрасывать весь кеш сайта, что негативно влияет на производительность.`,
  },
  {
    id: 5,
    title: "Laravel Queues: задача не выполняется — типичные ошибки",
    excerpt: "Почему задачи зависают в статусе pending или падают с ошибками. Диагностика и исправление проблем с очередями в Laravel.",
    tag: "Laravel",
    date: "28 апр 2026",
    readTime: 12,
    views: 6740,
    comments: 35,
    category: "Очереди",
    content: `Самые частые причины проблем с очередями в Laravel — от банального до неочевидного.

**1. Worker не запущен:**

\`\`\`bash
php artisan queue:work --daemon
\`\`\`

**2. Смотрите failed jobs:**

\`\`\`bash
php artisan queue:failed
php artisan queue:retry all
\`\`\`

**3. Увеличьте таймаут задачи:**

\`\`\`php
public $timeout = 120;
\`\`\`

Используйте Laravel Horizon для мониторинга очередей в реальном времени — он наглядно показывает throughput, failed jobs и нагрузку.`,
  },
  {
    id: 6,
    title: "Битрикс24: REST API возвращает 400 Bad Request",
    excerpt: "Разбираем коды ошибок REST API Битрикс24 и типичные причины 400 Bad Request при вызове методов через webhook.",
    tag: "Битрикс24",
    date: "25 апр 2026",
    readTime: 5,
    views: 1890,
    comments: 7,
    category: "REST API",
    content: `400 Bad Request в Битрикс24 REST API чаще всего означает неверные параметры запроса, а не проблему с авторизацией.

**Частые причины:**
- Неправильный формат даты (используйте ISO 8601)
- Передача ID как строки вместо числа
- Неверные системные коды полей

**Правильный запрос создания сделки:**

\`\`\`php
$result = CRest::call('crm.deal.add', [
    'fields' => [
        'TITLE' => 'Новая сделка',
        'STAGE_ID' => 'NEW',
        'OPENED' => 'Y',
        'ASSIGNED_BY_ID' => 1
    ]
]);
\`\`\`

Всегда проверяйте ответ на наличие поля error и логируйте error_description для диагностики.`,
  },
];

const INITIAL_COMMENTS: Comment[] = [
  { id: 1, articleId: 1, author: "Алексей М.", text: "Спасибо! Именно с этим и мучился неделю. Теперь работает.", date: "13 мая", role: "Backend Dev" },
  { id: 2, articleId: 1, author: "Inna_code", text: "А как быть если refresh_token тоже истёк? У меня такая ситуация.", date: "13 мая", role: "Fullstack" },
  { id: 3, articleId: 1, author: "DevBug", text: "Если оба токена истекли — нужна повторная авторизация пользователя. Можно поймать это исключение и редиректить на OAuth.", date: "13 мая", role: "Редактор" },
  { id: 4, articleId: 2, author: "Roman_ph", text: "Отличный разбор! Добавлю: для больших проектов стоит смотреть на chunk при lazy loading.", date: "10 мая", role: "Senior Dev" },
  { id: 5, articleId: 2, author: "КатяФронт", text: "А для many-to-many то же самое работает? Через pivot?", date: "10 мая", role: "Developer" },
  { id: 6, articleId: 3, author: "php_enjoyer", text: "Проверил у себя — да, 8.2 ругается. Добавил атрибут пока.", date: "6 мая", role: "PHP Dev" },
  { id: 7, articleId: 4, author: "BitrixPain", text: "НАКОНЕЦ-ТО! Искал это решение 3 часа. Всё работает, спасибо огромное!", date: "3 мая", role: "CMS Dev" },
  { id: 8, articleId: 5, author: "queue_master", text: "Horizon реально спасает. Советую сразу настраивать в новых проектах.", date: "29 апр", role: "DevOps" },
];

const CATEGORIES = [
  { name: "Битрикс", count: 42, icon: "Layers", color: "tag-bitrix" },
  { name: "Битрикс24", count: 38, icon: "Building2", color: "tag-b24" },
  { name: "Laravel", count: 67, icon: "Code2", color: "tag-laravel" },
  { name: "PHP", count: 91, icon: "Terminal", color: "tag-php" },
  { name: "Авторизация", count: 18, icon: "Shield", color: "" },
  { name: "Производительность", count: 29, icon: "Zap", color: "" },
  { name: "REST API", count: 24, icon: "Globe", color: "" },
  { name: "Кеширование", count: 15, icon: "Database", color: "" },
];

const TAG_STYLE: Record<string, string> = {
  "Битрикс": "tag-bitrix",
  "Битрикс24": "tag-b24",
  "Laravel": "tag-laravel",
  "PHP": "tag-php",
};

/* ─── COMPONENTS ────────────────────────────────────────── */
function ArticleCard({ article, onClick, delay = 1 }: { article: Article; onClick: () => void; delay?: number }) {
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

function CommentSection({ articleId, allComments, setAllComments }: {
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

function ArticleDetail({ article, onBack, allComments, setAllComments }: {
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

/* ─── PAGES ─────────────────────────────────────────────── */
function HomePage({ onArticleClick, onNavigate }: { onArticleClick: (a: Article) => void; onNavigate: (p: string) => void }) {
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

function ArticlesPage({ onArticleClick }: { onArticleClick: (a: Article) => void }) {
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

function CategoriesPage({ onNavigate }: { onNavigate: (p: string) => void }) {
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

function SearchPage({ onArticleClick }: { onArticleClick: (a: Article) => void }) {
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

/* ─── APP ───────────────────────────────────────────────── */
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

  const navItems = [
    { id: "home", label: "Главная", icon: "Home" },
    { id: "articles", label: "Статьи", icon: "FileText" },
    { id: "categories", label: "Категории", icon: "Grid3X3" },
    { id: "search", label: "Поиск", icon: "Search" },
  ];

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
            {navItems.map(n => (
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
            {navItems.map(n => (
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