# 📋 KẾ HOẠCH TRIỂN KHAI CHI TIẾT v1 — ChimMocCanh FootballSquad

> **Dự án:** Ứng dụng quản lý đá bóng phong trào nội bộ  
> **Ngày lập:** 2026-09-27  
> **Môi trường:** Java 21.0.6 | Node 22.14.0 | npm 11.6.2  
> **Package:** `com.chimmoccanh.footballsquad`

---

## 📌 CÁC QUYẾT ĐỊNH ĐÃ XÁC NHẬN

| # | Câu hỏi | Quyết định |
|---|---|---|
| 1 | Spring Boot version | ✅ Chuyển về **3.4.1** (LTS stable) |
| 2 | Package name | ✅ `com.chimmoccanh.footballsquad` (giữ chữ chimmoccanh) |
| 3 | Format trận | ✅ **Cố định 7v7** — bỏ trường `format`, hardcode |
| 4 | Quyền lưu lineup | ✅ **Admin + Đội trưởng** đều được lưu |
| 5 | Ngôn ngữ | ✅ **Chỉ tiếng Việt** — toàn bộ UI, thông báo, label |
| 6 | Avatar | ✅ **Chữ cái đầu** (initials) — không upload ảnh |
| 7 | Màu áo đấu | ✅ Đội A: **Tây Ban Nha (đỏ `#C60B1E`)** · Đội B: **Pháp (xanh nước biển `#002395`)** |
| 8 | Season | ✅ **Bỏ season** — không phân chia theo mùa giải |
| 9 | Số áo đấu | ✅ **Bổ sung `jersey_number`** vào bảng `users` (nhập khi đăng ký) |
| 10 | PostgreSQL | ✅ **Local** — `root` / `1234` / `chimmoccanh` (không Docker) |

---

## 📊 HIỆN TRẠNG DỰ ÁN

| Thành phần | Trạng thái |
|---|---|
| Backend Spring Boot | ✅ Đã khởi tạo (`com.example.ChimMocCanh`), pom.xml chỉ có starter cơ bản |
| Frontend React | ❌ Thư mục `frontend/` trống |
| Database PostgreSQL | ✅ Đã cài local (`root`/`1234`) |
| File `.env` | ❌ Chưa có |
| Design System | ✅ Có 5 file mẫu trong `example_ui/` (DESIGN.md, dashboard, live_wheel, leaderboard, line-up) |

---

## 🎨 DESIGN SYSTEM — "PITCHSIDE PULSE"

> Trích xuất từ `example_ui/DESIGN.md` + các file HTML mẫu. Đây là **nguồn sự thật duy nhất** cho toàn bộ giao diện.

### Bảng màu chính

| Token | Mã màu | Vai trò |
|---|---|---|
| `background` | `#0B1326` | Nền chính toàn app (midnight charcoal) |
| `surface` | `#0B1326` | Surface cơ bản |
| `surface-container-lowest` | `#060E20` | Sidebar, pitch background |
| `surface-container-low` | `#131B2E` | Card containers |
| `surface-container` | `#171F33` | Module containers |
| `surface-container-high` | `#222A3D` | Elevated elements, hover states |
| `surface-container-highest` | `#2D3449` | Highest elevation |
| `primary` | `#4EDEA3` | Active states, CTA chính, xanh neon |
| `primary-container` | `#10B981` | Nút chính, active tabs |
| `secondary` | `#FFB690` | Text phụ, cam nhạt |
| `secondary-container` | `#EC6A06` | Match energy flame, orange badges |
| `tertiary` | `#4CD7F6` | Tactical cyan, AI analysis |
| `tertiary-container` | `#00B2D0` | Tactical overlays |
| `error` | `#FFB4AB` | Error states |
| `on-surface` | `#DAE2FD` | Text chính trên dark background |
| `on-surface-variant` | `#BBCABF` | Text phụ, muted |
| `outline` | `#86948A` | Borders, placeholders, text dim |

### Màu áo đấu CLB

| Đội | Tên áo | Màu chính | Mã màu |
|---|---|---|---|
| Team A | Tây Ban Nha | 🔴 Đỏ | `#C60B1E` |
| Team B | Pháp | 🔵 Xanh nước biển | `#002395` |
| GK | Thủ môn | 🟡 Vàng | `#FBBF24` |

### Typography

| Token | Font | Size | Weight | Dùng cho |
|---|---|---|---|---|
| `display-hero` | Chivo | 56px | 900 | Hero title desktop |
| `display-hero-mobile` | Chivo | 36px | 900 | Hero title mobile |
| `headline-lg` | Chivo | 36px | 800 | Section headings desktop |
| `headline-md` | Chivo | 24px | 700 | Sub-headings |
| `headline-sm` | Chivo | 18px | 700 | Card titles |
| `body-lg` | Space Grotesk | 18px | 500 | Body text lớn |
| `body-md` | Space Grotesk | 15px | 400 | Body text mặc định |
| `body-sm` | Space Grotesk | 13px | 400 | Body text nhỏ |
| `label-tactical` | JetBrains Mono | 12px | 700 | Labels chiến thuật, badges |
| `label-coord` | JetBrains Mono | 10px | 600 | Tọa độ, metadata nhỏ |
| `score-display` | Chivo | 64px | 900 | Tỉ số desktop |
| `score-display-mobile` | Chivo | 44px | 900 | Tỉ số mobile |

### Icons
- **Thư viện:** Google Material Symbols Outlined
- **Cách dùng:** `<span class="material-symbols-outlined">icon_name</span>`

### Elevation & Depth

| Level | Dùng cho | Background | Hiệu ứng |
|---|---|---|---|
| Level 0 | Pitch / Canvas | `#070B14` | Subtle horizontal pitch-striping |
| Level 1 | Card & Module | `#0F172A` | 1px border `rgba(255,255,255,0.08)` |
| Level 2 | Dragging / Active | `#1E293B` | Ambient glow `rgba(16,185,129,0.25)` |
| Level 3 | Modal / Sticky | `rgba(15,23,42,0.85)` | `backdrop-blur-md` |

---

## PHASE 0 — SETUP MÔI TRƯỜNG

### 0.1 PostgreSQL (Local — Đã có sẵn)

```
Host: localhost | Port: 5432 | Username: root | Password: 1234 | Database: chimmoccanh
```

### 0.2 Backend `.env`

File: `backend/.env`
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=chimmoccanh
DB_USERNAME=root
DB_PASSWORD=1234
JWT_SECRET=chimmoccanh-jwt-secret-key-minimum-32-characters-long-2026
JWT_ACCESS_EXPIRATION=900000
JWT_REFRESH_EXPIRATION=604800000
GEMINI_API_KEY=your-gemini-api-key-here
CORS_ALLOWED_ORIGINS=http://localhost:5173
APP_PORT=8080
```

### 0.3 Backend `application.yml`

File: `backend/src/main/resources/application.yml` (thay `application.properties`)
```yaml
spring:
  application:
    name: chimmoccanh
  datasource:
    url: jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5432}/${DB_NAME:chimmoccanh}
    username: ${DB_USERNAME:root}
    password: ${DB_PASSWORD:1234}
    driver-class-name: org.postgresql.Driver
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
  flyway:
    enabled: true
    baseline-on-migrate: true
    locations: classpath:db/migration
  jackson:
    serialization:
      write-dates-as-timestamps: false
    default-property-inclusion: non_null

server:
  port: ${APP_PORT:8080}

app:
  jwt:
    secret: ${JWT_SECRET:default-secret-key-32chars}
    access-expiration: ${JWT_ACCESS_EXPIRATION:900000}
    refresh-expiration: ${JWT_REFRESH_EXPIRATION:604800000}
  gemini:
    api-key: ${GEMINI_API_KEY:}
    model: gemini-1.5-flash
  cors:
    allowed-origins: ${CORS_ALLOWED_ORIGINS:http://localhost:5173}
  team:
    team-a-color: "#C60B1E"
    team-a-name: "Tây Ban Nha"
    team-b-color: "#002395"
    team-b-name: "Pháp"
```

### 0.4 Frontend `.env`

File: `frontend/.env`
```env
VITE_API_URL=http://localhost:8080
VITE_WS_URL=http://localhost:8080/ws
VITE_APP_NAME=ChimMocCanh
```

---

## PHASE 1 — BACKEND: POM.XML

### `pom.xml` hoàn chỉnh

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.4.1</version>
        <relativePath/>
    </parent>
    <groupId>com.chimmoccanh</groupId>
    <artifactId>footballsquad-backend</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <name>ChimMocCanh FootballSquad Backend</name>
    <description>Quản lý đá bóng phong trào - Backend API</description>
    <properties>
        <java.version>21</java.version>
        <jjwt.version>0.12.6</jjwt.version>
    </properties>
    <dependencies>
        <!-- CORE WEB -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <!-- SECURITY -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <!-- JWT (JJWT 0.12.6) -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>${jjwt.version}</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        <!-- DATABASE -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>
        <!-- FLYWAY -->
        <dependency>
            <groupId>org.flywaydb</groupId>
            <artifactId>flyway-core</artifactId>
        </dependency>
        <dependency>
            <groupId>org.flywaydb</groupId>
            <artifactId>flyway-database-postgresql</artifactId>
        </dependency>
        <!-- WEBSOCKET -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-websocket</artifactId>
        </dependency>
        <!-- VALIDATION -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <!-- CACHE -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-cache</artifactId>
        </dependency>
        <dependency>
            <groupId>com.github.ben-manes.caffeine</groupId>
            <artifactId>caffeine</artifactId>
        </dependency>
        <!-- RATE LIMITING -->
        <dependency>
            <groupId>com.bucket4j</groupId>
            <artifactId>bucket4j-core</artifactId>
            <version>8.14.0</version>
        </dependency>
        <!-- GEMINI AI (WebClient) -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-webflux</artifactId>
        </dependency>
        <!-- UTILITY -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>me.paulschwarz</groupId>
            <artifactId>spring-dotenv</artifactId>
            <version>4.0.0</version>
        </dependency>
        <!-- DEV TOOLS -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        <!-- TESTING -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

---

## PHASE 2 — FRONTEND: KHỞI TẠO REACT

### Lệnh khởi tạo
```powershell
cd c:\Users\buida\split_team_football\frontend
npx -y create-vite@latest ./ -- --template react-ts
npm install
npm install react-router-dom@6 zustand axios socket.io-client
npm install -D tailwindcss @tailwindcss/vite
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npm install html2canvas recharts date-fns react-hot-toast
```

---

## PHASE 3 — DATABASE MIGRATIONS

### V1__create_users_table.sql (có `jersey_number`)
```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    jersey_number INT,
    avatar_url TEXT,
    email VARCHAR(150) UNIQUE,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'PLAYER',
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT now()
);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_status ON users(status);
```

### V2__create_matches_table.sql (bỏ `format`, bỏ season)
```sql
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200),
    match_date DATE NOT NULL,
    match_time TIME,
    location VARCHAR(200) DEFAULT 'Sân cố định',
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    created_by UUID REFERENCES users(id),
    score_team_a INT DEFAULT 0,
    score_team_b INT DEFAULT 0,
    ai_analysis TEXT,
    ai_analyzed_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT now()
);
CREATE INDEX idx_matches_date ON matches(match_date);
CREATE INDEX idx_matches_status ON matches(status);
```

### V3–V6: match_participants, match_lineups, spin_sessions, player_stats
*(Giữ nguyên như prompt_v1.md, không thay đổi)*

### V7__create_leaderboard_cache_table.sql (bỏ `season`)
```sql
CREATE TABLE leaderboard_cache (
    user_id UUID PRIMARY KEY REFERENCES users(id),
    total_goals INT DEFAULT 0,
    total_assists INT DEFAULT 0,
    total_wins INT DEFAULT 0,
    total_matches INT DEFAULT 0,
    win_rate FLOAT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT now()
);
```

---

## PHASE 4 — BACKEND CẤU TRÚC

```
com.chimmoccanh.footballsquad/
├── FootballSquadApplication.java
├── config/         (Security, WebSocket, JWT, Cache, WebClient)
├── security/       (JwtTokenProvider, JwtFilter, UserDetails, WS Auth)
├── controller/     (Auth, Match, Spin, Pick, Lineup, Stats, Leaderboard, Player, Admin, AI)
├── service/        (Auth, Match, Spin, TeamPick, Lineup, Stats, Leaderboard, Gemini, WebSocket)
├── repository/     (User, Match, Participant, Lineup, SpinSession, PlayerStats, Leaderboard)
├── model/          (User, Match, MatchParticipant, MatchLineup, SpinSession, PlayerStats, LeaderboardCache)
├── model/enums/    (UserRole, UserStatus, MatchStatus, Team, Position)
├── dto/request/    (Login, Register[+jersey_number], CreateMatch, Pick, Lineup, Stats, Score)
├── dto/response/   (Auth, User, Match, Spin, Pick, Lineup, Stats, Leaderboard, AI)
├── exception/      (GlobalHandler, ResourceNotFound, Unauthorized, BadRequest, RateLimit)
└── websocket/      (MatchWebSocketController)
```

---

## PHASE 5 — FRONTEND CẤU TRÚC

```
frontend/src/
├── ui/                    -- 🆕 SHARED REUSABLE (dùng lại ở mọi page)
│   ├── Button.tsx, Badge.tsx, Card.tsx, Modal.tsx, Input.tsx
│   ├── Select.tsx, Avatar.tsx (initials), Skeleton.tsx, Toast.tsx
│   ├── Tabs.tsx, ProgressBar.tsx, IconButton.tsx, ConnectionBanner.tsx
│   └── index.ts
│
├── components/            -- FEATURE-SPECIFIC
│   ├── layout/    (Sidebar, BottomNav, Header, MainLayout, ProtectedRoute)
│   ├── match/     (MatchCard, StatusBadge, ScoreBoard, WeeklyCalendar)
│   ├── spin/      (SpinWheel, SpinResult, CaptainFaceOff, LiveActivityTicker)
│   ├── pick/      (PickList, TeamColumn, PlayerPickCard)
│   ├── lineup/    (FootballPitch, PlayerToken, LineupExport, FormationPreset, BenchReserves)
│   ├── leaderboard/ (LeaderboardTable, PlayerRank, FormIndicator, MetricBentoStrip)
│   └── ai/        (AIAnalysisCard, WinPrediction, TacticalAdvice)
│
├── pages/         (LoginPage, RegisterPage, DashboardPage, MatchListPage, MatchDetailPage,
│                   LeaderboardPage, PlayerProfilePage, AdminPage)
├── hooks/         (useWebSocket, useAuth, useMatch, useMediaQuery)
├── store/         (authStore, matchStore, websocketStore)
├── services/      (api, auth, match, spin, lineup, stats, leaderboard, ai)
├── types/         (index.ts)
└── utils/         (spinEngine, dateUtils, avatarUtils, constants)
```

> `src/ui/` = shared, không có business logic  
> `src/components/` = feature-specific, gắn liền chức năng

---

## 📅 LỊCH TRÌNH 8 TUẦN (51 tasks)

| Tuần | Nội dung | Số tasks |
|---|---|---|
| 1–2 | Nền tảng (DB, Auth, Layout, Login/Register, UI components) | 13 |
| 3–4 | Core Match + Realtime (CRUD, WebSocket, Spin, Pick) | 12 |
| 5 | Đội hình & Thống kê (Lineup builder, Stats) | 8 |
| 6 | Bảng xếp hạng & Hồ sơ cầu thủ | 5 |
| 7 | AI Gemini | 5 |
| 8 | Hoàn thiện & Deploy | 8 |

---

## 📎 TÀI LIỆU THAM CHIẾU

| File | Mô tả |
|---|---|
| `prompt_v1.md` | Spec gốc (API, DB, WebSocket, luồng E2E) |
| `example_ui/DESIGN.md` | Design System "Pitchside Pulse" |
| `example_ui/dashboard.md` | Mẫu HTML trang Trang chủ |
| `example_ui/live_wheel.md` | Mẫu HTML Vòng quay + Chọn người |
| `example_ui/leaderboard.md` | Mẫu HTML Bảng xếp hạng |
| `example_ui/line-up.md` | Mẫu HTML Sa bàn & Đội hình |

---

*Bản kế hoạch v1 — tích hợp toàn bộ quyết định, design system Pitchside Pulse, cấu trúc code (có `src/ui/`), và lịch trình 8 tuần.*
