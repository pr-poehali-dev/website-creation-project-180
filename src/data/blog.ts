export type Tag = "Битрикс" | "Битрикс24" | "Laravel" | "PHP";

export interface Article {
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

export interface Comment {
  id: number;
  articleId: number;
  author: string;
  text: string;
  date: string;
  role: string;
}

export const ARTICLES: Article[] = [
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

export const INITIAL_COMMENTS: Comment[] = [
  { id: 1, articleId: 1, author: "Алексей М.", text: "Спасибо! Именно с этим и мучился неделю. Теперь работает.", date: "13 мая", role: "Backend Dev" },
  { id: 2, articleId: 1, author: "Inna_code", text: "А как быть если refresh_token тоже истёк? У меня такая ситуация.", date: "13 мая", role: "Fullstack" },
  { id: 3, articleId: 1, author: "DevBug", text: "Если оба токена истекли — нужна повторная авторизация пользователя. Можно поймать это исключение и редиректить на OAuth.", date: "13 мая", role: "Редактор" },
  { id: 4, articleId: 2, author: "Roman_ph", text: "Отличный разбор! Добавлю: для больших проектов стоит смотреть на chunk при lazy loading.", date: "10 мая", role: "Senior Dev" },
  { id: 5, articleId: 2, author: "КатяФронт", text: "А для many-to-many то же самое работает? Через pivot?", date: "10 мая", role: "Developer" },
  { id: 6, articleId: 3, author: "php_enjoyer", text: "Проверил у себя — да, 8.2 ругается. Добавил атрибут пока.", date: "6 мая", role: "PHP Dev" },
  { id: 7, articleId: 4, author: "BitrixPain", text: "НАКОНЕЦ-ТО! Искал это решение 3 часа. Всё работает, спасибо огромное!", date: "3 мая", role: "CMS Dev" },
  { id: 8, articleId: 5, author: "queue_master", text: "Horizon реально спасает. Советую сразу настраивать в новых проектах.", date: "29 апр", role: "DevOps" },
];

export const CATEGORIES = [
  { name: "Битрикс", count: 42, icon: "Layers", color: "tag-bitrix" },
  { name: "Битрикс24", count: 38, icon: "Building2", color: "tag-b24" },
  { name: "Laravel", count: 67, icon: "Code2", color: "tag-laravel" },
  { name: "PHP", count: 91, icon: "Terminal", color: "tag-php" },
  { name: "Авторизация", count: 18, icon: "Shield", color: "" },
  { name: "Производительность", count: 29, icon: "Zap", color: "" },
  { name: "REST API", count: 24, icon: "Globe", color: "" },
  { name: "Кеширование", count: 15, icon: "Database", color: "" },
];

export const TAG_STYLE: Record<string, string> = {
  "Битрикс": "tag-bitrix",
  "Битрикс24": "tag-b24",
  "Laravel": "tag-laravel",
  "PHP": "tag-php",
};
