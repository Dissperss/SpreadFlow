# SpreadFlow — визуальный разбор

> Это Markdown-версия разбора: диаграммы ниже отрисовываются в GitHub, GitLab, Obsidian или в VS Code Markdown Preview с поддержкой Mermaid.  
> Полный текстовый вариант без рендера лежит в `response.txt`.

---

## 0. Контекст и стек

SpreadFlow — клиентский SPA-терминал для арбитражных спредов MOEX. Реально работает только MOEX-контур: 11 пар «акция TQBR → фьючерс FORTS», 14 активов для календарных спредов, polling ISS каждые 15 секунд. Вся аналитика считается на клиенте. Бэкенда, БД, WebSocket, авторизации и алертов нет.

| Слой | Технологии |
|---|---|
| UI | React 19, React Router 7, CSS Modules |
| Состояние | TanStack Query 5, Zustand 5 |
| HTTP | Axios |
| Типы/валидация | TypeScript 6 strict, Zod 4 |
| Сборка | Vite 8, `@vitejs/plugin-react`, `vite-plugin-svgr` |
| Стили | CSS-переменные, CSS Modules, тёмная тема, Inter |
| Backend | Нет. README упоминает Node.js, PostgreSQL, Prisma, WebSocket — это цель, а не текущее состояние |

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # tsc -b && vite build
npm run lint
```

`vite.config.ts` поднимает dev-сервер на `3000` и проксирует `/api/moex` → `https://iss.moex.com/iss`. Proxy работает только в `dev`; в production нужен reverse proxy или смена `baseURL`. `.env`-файлов, тестов и CI нет.

---

## 1. Карта проекта: кто кого рендерит

```mermaid
flowchart TD
    App["App"] --> Query["QueryProvider"]
    Query --> Router["RouterProvider"]
    Router --> Layout["MainLayout"]

    Layout --> Header["Header"]
    Layout --> Sidebar["Sidebar"]
    Layout --> Outlet["Outlet — содержимое маршрута"]
    Layout --> Footer["Footer"]

    Outlet --> Home["HomePage — /"]
    Outlet --> Scanner["ScannerPage — /scanner"]
    Outlet --> SF["StockFuturesPage — /stock-futures"]
    Outlet --> Cal["CalendarSpreadsPage — /calendar-spreads"]
    Outlet --> Crypto["CryptoArbitragePage — /crypto-arbitrage"]
    Outlet --> Watch["WatchlistPage — /watchlist"]
    Outlet --> Settings["SettingsPage — /settings"]
    Outlet --> NotFound["NotFoundPage — *"]
```

`MainLayout` — общий каркас: sticky-header, sidebar 240px, скроллящийся `main` с `Outlet` и footer. Все страницы — дети одного layout-маршрута `/`.

---

## 2. FSD-слои: как должно быть и как есть

### 2.1 Идеальное направление зависимостей

```mermaid
flowchart TD
    subgraph AppLayer [app]
        A["App / Router / Layout"]
    end

    subgraph PagesLayer [pages]
        P["HomePage / ScannerPage / StockFuturesPage / ..."]
    end

    subgraph WidgetsLayer [widgets]
        W["Header / Sidebar / ArbitrageTable / StatisticsSection / ..."]
    end

    subgraph FeaturesLayer [features]
        F["quotes / last-updated"]
    end

    subgraph EntitiesLayer [entities]
        E["instrument / spread"]
    end

    subgraph SharedLayer [shared]
        S["api / config / lib / ui"]
    end

    A --> P
    P --> W
    W --> F
    F --> E
    E --> S
    F --> S
    P --> E
    P --> S
    W --> S
```

Правило: нижний слой не должен импортировать верхний. `shared` — фундамент, `app` — вершина.

### 2.2 Фактические нарушения

```mermaid
flowchart LR
    subgraph Shared [shared]
        API["shared/api/iss<br/>moexIssProvider.ts"]
    end

    subgraph Entities [entities]
        ENT["instrument + spread<br/>типы и расчёты"]
    end

    subgraph Widgets [widgets]
        WS["watchlist-section"]
    end

    subgraph Pages [pages]
        HP["home/lib/mock.ts"]
    end

    API -.->|"импортирует модели и расчёты"| ENT
    WS -.->|"импортирует мок"| HP
    HP -->|"рендерит"| WS
```

| Нарушение | Где | Почему плохо |
|---|---|---|
| `shared → entities` | `shared/api/iss/moexIssProvider.ts` | `shared` перестаёт быть независимым фундаментом; провайдер знает доменные типы и вызывает `buildCashAndCarrySignal` |
| `widgets → pages` | `widgets/watchlist-section` → `pages/home/lib/mock` | Архитектурный цикл `page → widget → page`; виджет нельзя переиспользовать без страницы |
| `pages → pages` | `pages/watchlist` → `pages/home/lib/mock` | Межстраничная зависимость и дублирование витрины watchlist |

Ещё мёртвый код: `HeroSection`, `NewsSection`, `HeatmapSection`, `shared/ui/Section`, `shared/ui/Container`, `arbitrageSignals` из мока.

---

## 3. Доменные модели

```mermaid
classDiagram
    class Instrument {
        +string secid
        +string type
        +number lastPrice
        +number volume
        +number openInterest
        +string board
        +number lotSize
        +string assetCode
        +string expirationDate
    }

    class SpotInstrument {
        +string type
    }

    class FutureContract {
        +string assetCode
        +string expirationDate
        +number daysToExpiry
    }

    class ArbSignal {
        +string ticker
        +number spot
        +number future
        +number spread
        +number fairValue
        +number expectedProfit
        +number impliedRepo
        +string signal
        +string liquidity
    }

    class CalendarSpread {
        +string underlying
        +string assetCode
        +string nearSecid
        +string farSecid
        +number nearPrice
        +number farPrice
        +number calendarSpread
        +number calendarSpreadPct
        +number rollYield
        +string signal
    }

    class InstrumentType {
        <<enumeration>>
        stock
        future
        index
        currency
        commodity
    }

    class Signal {
        <<enumeration>>
        buy
        sell
        neutral
    }

    class Liquidity {
        <<enumeration>>
        High
        Medium
        Low
    }

    Instrument <|-- SpotInstrument
    Instrument <|-- FutureContract
    Instrument --> InstrumentType
    FutureContract ..> ArbSignal : input
    SpotInstrument ..> ArbSignal : input
    FutureContract ..> CalendarSpread : near / far
    ArbSignal --> Signal
    ArbSignal --> Liquidity
    CalendarSpread --> Signal
    CalendarSpread --> Liquidity
```

Схема концептуальная: `ArbSignal` и `CalendarSpread` не хранят внутри `Instrument` — они вычисляются из спот- и фьючерс-объектов.

Важно: Zod-схемы используются только как источник типов через `z.infer`. Runtime-валидации `.parse()` / `.safeParse()` в проекте нет.

### 3.1 Universe

`src/shared/config/moexUniverse.ts` — ручной список инструментов.

| Spot SECID | Asset code | Подпись |
|---|---|---|
| SBER | SBRF | Sberbank |
| GAZP | GAZR | Gazprom |
| LKOH | LKOH | Lukoil |
| GMKN | GMKN | Norilsk Nickel |
| ROSN | ROSN | Rosneft |
| NVTK | NOTKM | Novatek |
| TATN | TATN | Tatneft |
| MGNT | MGNT | Magnit |
| YDEX | YDEX | Yandex |
| OZON | OZON | Ozon Holdings |
| X5 | X5 | X5 Group |

`CALENDAR_SPREAD_UNIVERSE` = `Si / Si`, `RI / RTS`, `MX / MXI` + все 11 акций.

Последние три (`YDEX`, `OZON`, `X5`) добавлены в **незакоммиченных** изменениях: в коммите их ещё нет, но в рабочем дереве и на собранной странице они уже участвуют.

---

## 4. Поток данных — главное

### 4.1 Один взгляд: от MOEX ISS до таблицы

```mermaid
flowchart TD
    subgraph Browser [Браузер]
        UI["Page / Widget"]
        Hook["useStockFuturesArb"]
        RQ["React Query<br/>cache"]
        Store["Zustand<br/>lastUpdated"]
        Header["Header / LastUpdated"]
        Provider["moexIssProvider"]
        Parser["parser.ts"]
        Calc["calculations.ts"]
    end

    subgraph Dev [Dev-сервер Vite]
        Proxy["proxy /api/moex"]
    end

    subgraph MOEX [MOEX]
        ISS["ISS API"]
    end

    UI --> Hook
    Hook --> RQ
    RQ -->|"cache miss / stale"| Provider
    Provider -->|"axios GET"| Proxy
    Proxy -->|"rewrite on iss.moex.com/iss"| ISS
    ISS -->|"columns + data"| Parser
    Parser -->|"rowsToObjects"| Provider
    Provider -->|"build"| Calc
    Calc -->|"ArbSignal[]"| Provider
    Provider -->|"data"| RQ
    RQ -->|"cached data"| Hook
    Hook --> UI
    Hook -->|"success"| Store
    Store --> Header
```

Ключевая мысль: **React Query не ходит в ISS напрямую**. Он вызывает `quoteProvider`, а тот внутри использует `apiClient`, парсер и доменные расчёты.

### 4.2 Stock/futures: кто кого вызывает

```mermaid
sequenceDiagram
    autonumber
    participant UI as StockFuturesPage
    participant Hook as useStockFuturesArb
    participant RQ as React Query
    participant P as moexIssProvider
    participant AX as apiClient
    participant ISS as MOEX ISS
    participant C as calculations
    participant Z as Zustand

    UI->>Hook: render()
    Hook->>RQ: useQuery(key = quotes/stock-futures)
    alt cache fresh
        RQ-->>Hook: cached ArbSignal[]
    else cache empty or stale
        RQ->>P: fetchStockFuturesArb()
        par spot request
            P->>AX: GET TQBR securities
            AX->>ISS: GET /api/moex/... (proxy)
            ISS-->>AX: marketdata columns + data
            AX-->>P: IssResponse
        and futures request
            P->>AX: GET FORTS securities
            AX->>ISS: GET /api/moex/... (proxy)
            ISS-->>AX: securities + marketdata
            AX-->>P: IssResponse
        end
        P->>P: rowsToObjects + join by SECID / assetCode
        P->>P: pickNearestFuture(assetCode)
        P->>C: buildCashAndCarrySignal(spot, future)
        C-->>P: ArbSignal
        P-->>RQ: ArbSignal[]
        RQ-->>Hook: data
        Hook->>Z: setLastUpdated(Date.now())
    end
    Hook-->>UI: data, isLoading, isError
    UI->>UI: sort + render table
```

Два HTTP-запроса идут параллельно через `Promise.all`:

1. спот-цены TQBR по списку SECID;
2. все фьючерсы FORTS (потом фильтрация по `assetCode` в памяти).

### 4.3 Calendar spreads: вариант того же потока

```mermaid
sequenceDiagram
    autonumber
    participant UI as CalendarSpreadsPage
    participant Hook as useCalendarSpreads
    participant RQ as React Query
    participant P as moexIssProvider
    participant ISS as MOEX ISS
    participant C as buildCalendarSpread
    participant Z as Zustand

    UI->>Hook: render()
    Hook->>RQ: useQuery(key = quotes/calendar-spreads)
    alt cache fresh
        RQ-->>Hook: cached CalendarSpread[]
    else cache empty or stale
        RQ->>P: fetchCalendarSpreads()
        P->>ISS: GET FORTS securities
        ISS-->>P: all futures
        P->>P: group by assetCode + pickNearFarPair()
        loop each asset in universe
            P->>C: buildCalendarSpread(near, far)
            C-->>P: CalendarSpread
        end
        P-->>RQ: CalendarSpread[]
        RQ-->>Hook: data
        Hook->>Z: setLastUpdated(Date.now())
    end
    Hook-->>UI: data, isLoading, isError
    UI->>UI: groupByAsset(data) + render tables
```

Отличие: спот-запрос не нужен, и на каждый актив считается одна пара near/far.

### 4.4 Жизненный цикл React Query

```mermaid
stateDiagram-v2
    [*] --> NoData
    NoData --> Fetching: component mounts
    Fetching --> Fresh: success
    Fetching --> Error: request fails after retry 1
    Error --> Fetching: next interval or focus
    Fresh --> Stale: 10s staleTime
    Stale --> Fetching: 15s refetchInterval or focus
    Fresh --> [*]: unmount + gcTime 5m
    Error --> [*]: unmount + gcTime 5m
```

Параметры:

| Параметр | Значение |
|---|---|
| `retry` | `1` |
| `refetchOnWindowFocus` | `true` |
| `refetchInterval` | `15_000` мс |
| `staleTime` | `10_000` мс |
| `refetchIntervalInBackground` | `false` по умолчанию |
| `gcTime` | 5 минут по умолчанию |

### 4.5 Одна строка насквозь: SBER / SRZ6

```mermaid
flowchart TD
    ISS1["ISS: SBER<br/>LAST = 295.78"] --> Spot["SpotInstrument<br/>secid=SBER, lastPrice=295.78"]
    ISS2["ISS: SRZ6<br/>LAST = 30 031"] --> Future["FutureContract<br/>secid=SRZ6, assetCode=SBRF,<br/>lastPrice=30 031, daysToExpiry=39"]

    Spot --> Join["buildStockFuturesSignals()<br/>spotBySecid.get('SBER')<br/>pickNearestFuture('SBRF')"]
    Future --> Join
    Join --> Calc["buildCashAndCarrySignal()<br/>spread = (future - spot) / spot"]
    Calc --> Row["ArbSignal<br/>ticker=SBER, future=30 031<br/>spread=+10 053%, signal=SELL"]
    Row --> Table["таблица на /stock-futures<br/>SBER · SRZ6 · 295.78 · 30 031 · +10 053% ..."]
```

Именно в этом месте виден P0-баг: `spot` — за акцию, `future` — за контракт. После нормализации на `LOTVOLUME=100` спред становится `+1.53%`, а сигнал — `NEUTRAL`. Подробнее в разделе 5.

### 4.6 Кто за что отвечает

| Компонент | Файл | Вход | Выход |
|---|---|---|---|
| Хук stock | `features/quotes/model/useQuotes.ts` | render компонента | `data`, `isLoading`, `isError` |
| Хук calendar | `features/quotes/model/useQuotes.ts` | render компонента | `data`, `isLoading`, `isError` |
| Провайдер | `shared/api/iss/moexIssProvider.ts` | `QuoteProvider`-вызов | `ArbSignal[]` / `CalendarSpread[]` |
| HTTP-клиент | `shared/api/client.ts` | путь + params | `IssResponse` |
| Парсер | `shared/api/iss/parser.ts` | `columns + data` | объекты, числа, даты |
| Расчёты | `entities/spread/lib/calculations.ts` | спот + фьючерс | `ArbSignal` / `CalendarSpread` |
| Мета-стор | `shared/lib/quotesMetaStore.ts` | timestamp | `lastUpdated` для header |

### 4.7 Короткое резюме

1. Компонент вызывает хук.
2. Хук спрашивает React Query по ключу `quotes/stock-futures` или `quotes/calendar-spreads`.
3. При cache miss/stale React Query вызывает `moexIssProvider`.
4. Провайдер делает запросы через `apiClient` → Vite proxy → MOEX ISS.
5. Парсер превращает колоночный JSON в объекты.
6. Провайдер выбирает контракты и вызывает чистые функции расчёта.
7. React Query кэширует результат.
8. Хук обновляет `lastUpdated` в Zustand.
9. Компонент рендерит таблицу/карточки; header показывает «Updated N secs ago».

---

## 5. Финансовая логика и P0-баг

### 5.1 Формулы

```text
fairValue      = spot * (1 + repoRate * daysToExpiry / 365)
spreadPct      = (future - spot) / spot * 100
expectedProfit = (fairValue - future) / spot * 100
impliedRepo    = (future / spot - 1) * (365 / daysToExpiry) * 100
```

```text
expectedProfit > +0.25%  → buy
expectedProfit < -0.25%  → sell
иначе                    → neutral
```

Календарный спред:

```text
calendarSpread    = farPrice - nearPrice
calendarSpreadPct = calendarSpread / nearPrice * 100
daysBetween       = max(1, far.daysToExpiry - near.daysToExpiry)
rollYield         = (farPrice / nearPrice - 1) * (365 / daysBetween) * 100
expectedProfit    = -calendarSpreadPct
```

### 5.2 Почему сейчас получаются тысячи процентов

```mermaid
flowchart LR
    subgraph Wrong [Неправильно - разные единицы]
        S1["Spot SBER<br/>295.78 ₽ / акция"] --> M1["spread =<br/>(future - spot) / spot"]
        F1["Future SRZ6<br/>30 031 ₽ / контракт"] --> M1
        M1 --> R1["+10 053%<br/>ложный SELL"]
    end

    subgraph Right [Правильно - одна единица]
        S2["Spot x LOTVOLUME<br/>295.78 x 100 = 29 578 ₽"] --> M2["spread =<br/>(future - spot x lot) / (spot x lot)"]
        F2["Future SRZ6<br/>30 031 ₽ / контракт"] --> M2
        M2 --> R2["+1.53%<br/>корректно"]
    end
```

### 5.3 Две причины бага

1. В `fetchFortsSecurities` запрашивается колонка `LOTSIZE`, но в FORTS-таблице она называется `LOTVOLUME`. ISS молча игнорирует неизвестное поле, поэтому `lotSize` всегда `undefined`.
2. Даже если бы `lotSize` приходил, `calculations.ts` его не использует — сравнивает `spot` и `future` напрямую.

### 5.4 Живые значения на 09.11.2026

| Пара | Spot, ₽/акция | Future, ₽/контракт | `LOTVOLUME` | Future на акцию | Spread в коде | Корректный spread |
|---|---:|---:|---:|---:|---:|---:|
| SBER / SRZ6 | 295.78 | 30 031 | 100 | 300.31 | **+10 053%** | +1.53% |
| GAZP / GZZ6 | 114.19 | 11 589 | 100 | 115.89 | **+10 049%** | +1.49% |
| LKOH / LKZ6 | 6 037 | 56 590 | 10 | 5 659 | **+837%** | −6.26% |
| X5 / X5Z6 | 2 341 | 2 202 | 1 | 2 202 | −5.94% | −5.94% |

Следствия: сканер показывает 7 ложных `SELL`, а главная — «Average Spread» и «Largest Spread» в тысячах процентов.

### 5.5 Как исправить

```ts
// provider
'securities.columns':
  'SECID,SHORTNAME,ASSETCODE,LASTDELDATE,LOTVOLUME,MINSTEP'

lotSize: parseNumber(row.LOTVOLUME) ?? undefined
```

```ts
// calculations
const lot = futureContract.lotSize
const spotPerContract = spot * lot

const fairValue =
  spotPerContract * (1 + repoRate * daysToExpiry / 365)

const spreadPct =
  ((future - spotPerContract) / spotPerContract) * 100

const expectedProfit =
  ((fairValue - future) / spotPerContract) * 100

const impliedRepo =
  (future / spotPerContract - 1) * (365 / daysToExpiry) * 100
```

`lotSize ?? 1` лучше не использовать: если поле снова не придёт, баг вернётся молча. Лучше сделать `lotSize` обязательным для `FutureContract`.

### 5.6 Другие ограничения модели

- нет дивидендов: `F = (S - PV(D)) * (1 + rT)`, а не `S * (1 + rT)`;
- нет комиссий, налогов, маржи, borrow и проскальзывания;
- порог `0.25%` может быть ниже реальных издержек;
- нет проверки торговой сессии;
- `LAST` — последняя сделка, а не расчётная цена;
- DTE считается по `LASTDELDATE`, а не по `LASTTRADEDATE`;
- `daysUntil` зависит от таймзоны;
- `pickNearestFuture` / `pickNearFarPair` не пропускают контракты без цены;
- ставка репо в коде `14.25%`, а в Settings написано `16%`;
- сортировка по Ticker не работает: `Number('SBER')` даёт `NaN`.

---

## 6. Маршруты и экраны

```mermaid
flowchart LR
    Root["/"] --> Layout["MainLayout"]
    Layout --> Outlet["Outlet"]
    Outlet --> Home["/ → HomePage"]
    Outlet --> Scanner["/scanner → ScannerPage"]
    Outlet --> SF["/stock-futures → StockFuturesPage"]
    Outlet --> Cal["/calendar-spreads → CalendarSpreadsPage"]
    Outlet --> Crypto["/crypto-arbitrage → CryptoArbitragePage"]
    Outlet --> Watch["/watchlist → WatchlistPage"]
    Outlet --> Settings["/settings → SettingsPage"]
    Outlet --> NotFound["* → NotFoundPage"]
```

| URL | Данные | Статус |
|---|---|---|
| `/` | `StatisticsSection` + `ArbitrageTable` — реальный stock-запрос; `MarketOverview` + `WatchlistSection` — моки | Частично |
| `/scanner` | реальный stock-запрос, фильтр `signal !== 'neutral'` | Работает, но P0-баг лотов |
| `/stock-futures` | реальный stock-запрос | Работает, но P0-баг лотов |
| `/calendar-spreads` | реальный calendar-запрос | Работает, эвристические сигналы |
| `/crypto-arbitrage` | нет | Заглушка |
| `/watchlist` | мок | Только UI |
| `/settings` | статический текст | Только UI |
| `*` | нет | 404 |

---

## 7. Статус и roadmap

### 7.1 История

```mermaid
timeline
    title История SpreadFlow
    2026-06-10 : Initial commit
    2026-06-11 : FSD-структура, Vite, TypeScript
    2026-06-16 : Layout и главная на моках
    2026-06-29 : MOEX ISS, scanner, stock/futures, calendar, watchlist
    2026-11-09 : Визуальный разбор, проект на паузе
```

### 7.2 Что реально готово

```mermaid
flowchart LR
    subgraph Done [Работает]
        D1["MOEX ISS"]
        D2["Stock / Futures<br/>(P0 bug)"]
        D3["Calendar Spreads"]
        D4["Polling 15s"]
        D5["Routing / Layout"]
    end

    subgraph Mock [Моки и заглушки]
        M1["Watchlist"]
        M2["Market Overview"]
        M3["Settings"]
        M4["Crypto Arbitrage"]
        M5["News / Heatmap / Hero"]
    end

    subgraph Planned [Не реализовано]
        P1["Backend / DB"]
        P2["WebSocket"]
        P3["Alerts"]
        P4["Charts"]
        P5["Forex"]
    end
```

### 7.3 Ветки и рабочее дерево

- `develop` — текущая ветка, совпадает с `origin/develop`.
- `origin/main` содержит дополнительные merge-коммиты PR #8–#10, но дерево файлов **идентично** `develop`: `git diff develop origin/main` пустой. История разная, содержимое одинаковое.
- Локальный `main` указывает на самый первый коммит. Если переключиться на него, можно увидеть почти пустой проект; актуальная история — в `origin/main`.
- `feature/theme` не содержит уникальных коммитов — тема не делалась.
- Последний коммит — `2026-06-29 11:19 +0300`; проект стоит около 4,3 месяцев.

В рабочем дереве 5 изменённых файлов:

- `src/shared/config/moexUniverse.ts` — добавлены `YDEX`, `OZON`, `X5`;
- `src/entities/spread/lib/calculations.ts` — форматирование и комментарии;
- `src/features/quotes/model/useQuotes.ts` — комментарий;
- `src/shared/api/iss/parser.ts` — форматирование;
- `src/widgets/statistics-section/ui/StatisticsSection.module.css` — padding.

Новых неотслеживаемых файлов нет, кроме созданных `response.txt` / `response.md`. Сборка с этими изменениями проходит. Перед переключением веток их стоит закоммитить или сохранить.

### 7.4 Приоритеты

**P0 — корректность**

1. Починить `LOTVOLUME` + нормализацию.
2. Добавить unit-тесты на формулы с фикстурами SBER/GAZP/LKOH/X5.
3. Синхронизировать ставку репо: `14.25%` в коде vs `16%` в Settings.

**P1 — настраиваемость и устойчивость**

4. Вынести `repoRate`, `signalThreshold`, polling interval в конфиг/Zustand.
5. Включить runtime-валидацию Zod на границе ISS.
6. Обрабатывать отсутствующие цены и использовать `PREVSETTLEPRICE` как fallback.
7. Учитывать дивиденды/комиссии или явно писать, что модель упрощённая.
8. Показывать биржевой timestamp (`UPDATETIME`), а не только время клиентского запроса.

**P2 — продукт**

9. Persist watchlist + добавление/удаление.
10. Настоящие настройки: форма, сохранение, влияние на расчёты.
11. Backend: Node/Postgres/Prisma/WebSocket, серверный polling и кэш, алерты.
12. Production proxy на `/api/moex` или смена `baseURL`.
13. Общий интерфейс провайдера для crypto/forex.

**P3 — качество**

14. Убрать мёртвый код и неиспользуемые ассеты.
15. Исправить FSD-инверсии (`shared → entities`, `widgets → pages`).
16. Починить сортировку по Ticker.
17. Lazy-load роутов, сжать логотип, убрать неиспользуемые зависимости.
18. Добавить CI, ESLint в pipeline, тесты.

---

## 8. Что читать в коде

```mermaid
flowchart TD
    A["1. app/index.tsx → App.tsx → router.tsx"] --> B["2. app/layouts/MainLayout.tsx"]
    B --> C["3. pages/stock-futures/ui/StockFuturesPage.tsx"]
    C --> D["4. features/quotes/model/useQuotes.ts"]
    D --> E["5. shared/api/iss/moexIssProvider.ts"]
    E --> F["6. shared/api/iss/parser.ts"]
    F --> G["7. entities/spread/lib/calculations.ts"]
    G --> H["8. entities/*/model/schemas.ts"]
    H --> I["9. shared/config/moexUniverse.ts"]
    I --> J["10. widgets/arbitrage-table + statistics-section"]
```

---

## 9. Что проверено

- `npm run build` — успешно, 271 модуль, без ошибок TypeScript.
- Dev-сервер и браузер:
  - `/stock-futures` — 11 строк;
  - `/calendar-spreads` — 14 групп;
  - `/scanner` — 9 активных карточек;
  - `LastUpdated` в header тикает.
- MOEX ISS подтвердил:
  - поле называется `LOTVOLUME`, а не `LOTSIZE`;
  - `LOTVOLUME`: SRZ6 — 100, GZZ6 — 100, LKZ6 — 10, X5Z6 — 1.
- `npm run lint` в этой сессии не завершился за 180 секунд — отдельно не подтверждён.
- Все 14 Mermaid-блоков из `response.md` успешно отрендерены Mermaid 11 в браузере.
