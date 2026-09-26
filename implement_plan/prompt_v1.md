# Prompt dự án: Football Team Manager App

> Đây là prompt hoàn chỉnh để giao cho AI agent (Antigravity hoặc tương đương) thực hiện toàn bộ dự án.

---

## 1. Tổng quan dự án

Xây dựng một web app quản lý các buổi đá bóng phong trào nội bộ, bao gồm: tạo trận đấu, chia đội ngẫu nhiên bằng vòng quay live, xây dựng sơ đồ đội hình, lưu lịch sử kết quả, thống kê cầu thủ và phân tích AI.

**Tên dự án gợi ý:** `FootballSquad` (có thể đổi)

**Quy mô:**
- Dưới 200 người dùng
- Mỗi tuần 1–2 trận, sân cố định, định dạng mặc định 7vs7
- Nếu số người tham gia vượt 14, phần còn lại là dự bị (bench)

---

## 2. Tech Stack

### Frontend
- **Framework:** React.js (Vite + TypeScript)
- **Styling:** Tailwind CSS
- **State management:** Zustand
- **Realtime:** Socket.IO client
- **HTTP client:** Axios
- **Routing:** React Router v6
- **Thư viện bổ sung:**
  - `react-beautiful-dnd` hoặc `@dnd-kit/core` — kéo thả đội hình
  - `html2canvas` — xuất sơ đồ lineup ra ảnh PNG
  - `recharts` — biểu đồ thống kê cầu thủ
  - `date-fns` — xử lý ngày tháng
  - `react-hot-toast` — thông báo
- **Deploy:** Vercel (tích hợp CI/CD từ GitHub)
- **Domain:** domain riêng của người dùng, trỏ về Vercel

### Backend
- **Framework:** Java Spring Boot 3.x
- **Build tool:** Maven
- **Database:** PostgreSQL 15
- **ORM:** Spring Data JPA + Hibernate
- **Auth:** JWT (Access Token 15 phút + Refresh Token 7 ngày)
- **Realtime:** Spring WebSocket + STOMP + SockJS
- **Migration:** Flyway
- **AI:** Google Gemini API (gemini-1.5-flash) — call từ Backend, key lưu trong `.env`
- **Cache:** Caffeine Cache (in-memory, đủ cho < 200 users)
- **Deploy:** VPS Linux (Docker + Docker Compose + Nginx reverse proxy + SSL Let's Encrypt)
- **Port nội bộ:** 8080, expose qua Nginx trên 443

### Giao diện
- **Responsive:** 2 layout song song — Desktop (≥ 1024px) và Mobile (< 768px), Tablet (768–1023px) dùng layout Mobile
- Không dùng thư viện UI component có sẵn (MUI, Ant Design) — tự xây bằng Tailwind thuần để kiểm soát hoàn toàn giao diện

---

## 3. Database Schema (PostgreSQL)

### Bảng `users`
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
username VARCHAR(50) UNIQUE NOT NULL
full_name VARCHAR(100) NOT NULL
avatar_url TEXT
email VARCHAR(150) UNIQUE
password_hash TEXT NOT NULL
role VARCHAR(20) NOT NULL DEFAULT 'PLAYER' -- ADMIN | PLAYER
status VARCHAR(20) NOT NULL DEFAULT 'PENDING' -- PENDING | ACTIVE | BANNED
created_at TIMESTAMP DEFAULT now()
```

### Bảng `matches`
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
title VARCHAR(200)
match_date DATE NOT NULL
match_time TIME
location VARCHAR(200) DEFAULT 'Sân cố định'
status VARCHAR(30) NOT NULL DEFAULT 'PENDING'
-- PENDING | PICKING | LINEUP | FINISHED
format VARCHAR(10) DEFAULT '7v7' -- 7v7 | 5v5 | 11v11
created_by UUID REFERENCES users(id)
score_team_a INT DEFAULT 0
score_team_b INT DEFAULT 0
ai_analysis TEXT -- cache kết quả Gemini
ai_analyzed_at TIMESTAMP
notes TEXT
created_at TIMESTAMP DEFAULT now()
```

### Bảng `match_participants`
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
match_id UUID REFERENCES matches(id) ON DELETE CASCADE
user_id UUID REFERENCES users(id)
team VARCHAR(10) -- A | B | BENCH | NONE
is_host BOOLEAN DEFAULT false -- đội trưởng
pick_order INT -- thứ tự được chọn
jersey_number INT
joined_at TIMESTAMP DEFAULT now()
UNIQUE(match_id, user_id)
```

### Bảng `match_lineups`
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
match_id UUID REFERENCES matches(id) ON DELETE CASCADE
user_id UUID REFERENCES users(id)
team VARCHAR(10) NOT NULL -- A | B
position_label VARCHAR(10) -- GK | CB | LB | RB | CM | LM | RM | ST | LW | RW | CAM | CDM
x_percent FLOAT -- 0–100, % chiều ngang sân (lưu % thay vì px để responsive)
y_percent FLOAT -- 0–100, % chiều dọc sân
jersey_number INT
UNIQUE(match_id, user_id)
```

### Bảng `spin_sessions`
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
match_id UUID REFERENCES matches(id) ON DELETE CASCADE
host_a_id UUID REFERENCES users(id)
host_b_id UUID REFERENCES users(id)
winner_id UUID REFERENCES users(id)
spin_seed BIGINT NOT NULL -- seed cố định để replay, chống gian lận
duration_ms INT -- thời gian quay (ms), lưu để FE đồng bộ
spun_at TIMESTAMP DEFAULT now()
```

### Bảng `player_stats`
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
match_id UUID REFERENCES matches(id) ON DELETE CASCADE
user_id UUID REFERENCES users(id)
team VARCHAR(10)
goals INT DEFAULT 0
assists INT DEFAULT 0
is_winner BOOLEAN DEFAULT false
is_mvp BOOLEAN DEFAULT false
entered_by UUID REFERENCES users(id) -- admin nhập
entered_at TIMESTAMP
UNIQUE(match_id, user_id)
```

### Bảng `leaderboard_cache`
```sql
user_id UUID PRIMARY KEY REFERENCES users(id)
season VARCHAR(20) DEFAULT '2025'
total_goals INT DEFAULT 0
total_assists INT DEFAULT 0
total_wins INT DEFAULT 0
total_matches INT DEFAULT 0
win_rate FLOAT DEFAULT 0
updated_at TIMESTAMP DEFAULT now()
```

---

## 4. API Endpoints (REST)

### Auth
```
POST   /api/auth/register          -- đăng ký (status=PENDING)
POST   /api/auth/login             -- đăng nhập → JWT
POST   /api/auth/refresh           -- refresh access token
POST   /api/auth/logout            -- revoke refresh token
GET    /api/auth/me                -- thông tin user hiện tại
```

### Admin - User Management
```
GET    /api/admin/users            -- danh sách tất cả users (có filter status)
PATCH  /api/admin/users/{id}/approve  -- duyệt tài khoản PENDING → ACTIVE
PATCH  /api/admin/users/{id}/ban      -- ban user
PUT    /api/admin/users/{id}          -- sửa thông tin user
```

### Matches
```
GET    /api/matches                -- danh sách trận (filter: week/month/year)
POST   /api/matches                -- tạo trận [ADMIN]
GET    /api/matches/{id}           -- chi tiết trận
PUT    /api/matches/{id}           -- cập nhật trận [ADMIN]
DELETE /api/matches/{id}           -- xóa trận [ADMIN]
PATCH  /api/matches/{id}/status    -- đổi trạng thái [ADMIN]
```

### Participants
```
GET    /api/matches/{id}/participants      -- danh sách người tham gia
POST   /api/matches/{id}/participants     -- thêm người tham gia [ADMIN]
DELETE /api/matches/{id}/participants/{userId}  -- xóa [ADMIN]
```

### Spin Wheel
```
POST   /api/matches/{id}/spin/start   -- tạo spin session (sinh seed) [ADMIN]
GET    /api/matches/{id}/spin         -- lấy kết quả spin session hiện tại
```

### Team Picking
```
POST   /api/matches/{id}/pick         -- đội trưởng chọn người (body: {userId})
GET    /api/matches/{id}/pick-order   -- danh sách đã chọn + lượt tiếp theo
```

### Lineup
```
GET    /api/matches/{id}/lineup       -- lấy lineup 2 đội
PUT    /api/matches/{id}/lineup       -- lưu toàn bộ lineup (array positions)
```

### Stats & Results
```
GET    /api/matches/{id}/stats        -- thống kê trận
POST   /api/matches/{id}/stats        -- nhập/cập nhật kết quả [ADMIN]
PATCH  /api/matches/{id}/score        -- nhập tỉ số [ADMIN]
```

### Leaderboard & Players
```
GET    /api/leaderboard               -- bảng xếp hạng (query: ?season=2025&sort=goals)
GET    /api/players/{id}/stats        -- thống kê cá nhân cầu thủ
GET    /api/players/{id}/matches      -- lịch sử trận của cầu thủ
GET    /api/players/{id}/form         -- 5 trận gần nhất (W/L)
```

### AI Analysis
```
GET    /api/matches/{id}/ai-analysis  -- lấy phân tích AI (có cache)
POST   /api/matches/{id}/ai-analysis/refresh  -- force refresh [ADMIN]
```

---

## 5. WebSocket (STOMP over SockJS)

### Endpoint kết nối
```
/ws  -- endpoint SockJS
```

### Topics (subscribe)
```
/topic/match/{matchId}/spin       -- broadcast kết quả vòng quay
/topic/match/{matchId}/pick       -- broadcast mỗi lần chọn người
/topic/match/{matchId}/lineup     -- broadcast khi lineup được lưu
/topic/match/{matchId}/score      -- broadcast khi tỉ số được cập nhật
```

### Destinations (send từ client)
```
/app/match/{matchId}/spin/ready   -- client báo sẵn sàng xem spin
```

### Xác thực WebSocket
- Gửi JWT trong header khi connect: `Authorization: Bearer <token>`
- Backend verify token tại WebSocket handshake interceptor

---

## 6. Xử lý mất mạng / Reconnect

### Chiến lược (implement đầy đủ):

**Spin Wheel:**
- Seed được lưu vào DB **trước khi** gửi về client bất kỳ
- Client nhận seed → tự chạy animation theo seed (animation là deterministic)
- Nếu client mất kết nối giữa chừng → khi reconnect, gọi `GET /api/matches/{id}/spin` → nhận lại seed → replay animation từ đầu
- Seed + duration_ms lưu trong DB → mọi client reconnect đều thấy kết quả giống nhau

**Team Picking:**
- Mỗi lượt pick lưu ngay vào DB
- Client mất mạng → reconnect → subscribe lại topic + gọi `GET /api/matches/{id}/pick-order` → render lại trạng thái hiện tại
- Backend giữ "current_picker" (ai đang đến lượt) trong match state, không phụ thuộc client

**General:**
- Frontend implement exponential backoff reconnect: thử lại sau 1s, 2s, 4s, 8s, tối đa 30s
- Hiển thị banner "Mất kết nối – đang thử lại..." khi WebSocket disconnect
- Hiển thị banner "Đã kết nối lại" khi reconnect thành công
- Mọi action quan trọng (pick, save lineup) đều có optimistic UI + rollback nếu API lỗi

---

## 7. Tính năng Vòng quay may mắn (Chi tiết)

### Luồng:
1. Admin tạo trận, chọn người tham gia (ít nhất 2 người làm đội trưởng)
2. Admin chọn 2 người làm đội trưởng (host A và host B)
3. Admin bấm "Bắt đầu quay" → Backend tạo `spin_session` với seed ngẫu nhiên, lưu DB
4. Backend gửi seed qua WebSocket `/topic/match/{id}/spin` đến **tất cả** người đang xem
5. Tất cả client nhận cùng seed → chạy animation CSS vòng quay giống hệt nhau (synchronized)
6. Animation kết thúc → hiển thị winner (đội trưởng nào thắng)
7. Người thắng được chọn người trước (Team A pick trước)

### Animation vòng quay:
- Hiển thị avatar + tên 2 đội trưởng trên vòng quay (50/50)
- Vòng quay quay tối thiểu 3 vòng, sau đó dừng theo seed
- Duration: 4–6 giây
- Implement bằng CSS `@keyframes` với `cubic-bezier` deceleration
- Không dùng canvas hay thư viện nặng

---

## 8. Tính năng Chọn người (Team Picking)

### Luồng:
1. Sau spin, bắt đầu lượt chọn
2. Đội trưởng A (thắng spin) chọn 1 người đầu tiên → người đó vào Team A
3. Đội trưởng B chọn 1 người → Team B
4. Luân phiên cho đến khi đủ 6 người mỗi đội (7v7 bao gồm đội trưởng)
5. Nếu còn người dư → tự động thành "Dự bị" (Bench)
6. Mỗi lần pick, Backend lưu ngay vào `match_participants`, broadcast qua WebSocket
7. Tất cả người xem thấy realtime ai được chọn vào đội nào

### UI:
- Danh sách người chưa được chọn ở giữa
- Cột Team A bên trái, Team B bên phải
- Tên người đang đến lượt chọn được highlight
- Đếm ngược 60 giây nếu muốn (optional, có thể bỏ)

---

## 9. Tính năng Lineup Builder

### Mô tả:
- Sau khi chọn đội xong, đội trưởng (hoặc admin) xây dựng sơ đồ đội hình
- Giao diện: hình ảnh sân bóng (SVG hoặc CSS), chia 2 nửa (Team A nửa dưới, Team B nửa trên)
- Mỗi cầu thủ là 1 icon (áo số + tên) có thể kéo thả lên vị trí bất kỳ trên sân
- Preset formation: 2-3-1 (cho 7v7), có thể tùy chỉnh
- Lưu vị trí theo `x_percent` / `y_percent` (0–100%) để responsive
- Nút "Lưu lineup" → POST lên Backend → broadcast cho tất cả
- Nút "Xuất ảnh" → dùng `html2canvas` chụp div sân → tải về PNG
- Sơ đồ cuối cùng giống layout ảnh mẫu đính kèm: số áo + tên bên dưới, background áo màu đỏ-trắng

---

## 10. Tích hợp AI Gemini (Tối ưu call)

### Chiến lược gọi API (tối thiểu số lần):
Sử dụng **1 lần call duy nhất** per match, gộp cả 3 tính năng vào 1 prompt:

```
Gọi Gemini 1 lần với toàn bộ context → nhận JSON 1 response → parse ra 3 phần:
  1. pre_match_analysis (trước trận)
  2. win_prediction (tỉ lệ thắng 2 đội)
  3. post_match_summary (tổng kết sau trận, chỉ điền sau khi có kết quả)
```

### Timing gọi:
- **Trước trận:** Khi match chuyển sang trạng thái `LINEUP` (đã có đội hình) → gọi Gemini lần 1 (phân tích + dự đoán)
- **Sau trận:** Khi admin nhập xong kết quả → gọi Gemini lần 2 (tổng kết)
- Tổng: **tối đa 2 lần/trận**

### Cache:
- Lưu kết quả vào cột `ai_analysis` (JSON string) và `ai_analyzed_at` trong bảng `matches`
- Khi FE request → kiểm tra `ai_analyzed_at`, nếu < 1 giờ → trả cache, không gọi lại
- Chỉ gọi lại khi admin bấm "Làm mới phân tích"

### Prompt mẫu gửi Gemini:
```
Bạn là chuyên gia phân tích bóng đá phong trào. Phân tích trận đấu sau:

THÔNG TIN TRẬN: {match_date}, {format}, {location}

ĐỘI A - Đội trưởng: {host_a_name}
{danh sách cầu thủ đội A với stats: goals_total, assists_total, win_rate}

ĐỘI B - Đội trưởng: {host_b_name}
{danh sách cầu thủ đội B với stats tương tự}

LỊCH SỬ ĐỐI ĐẦU GẦN ĐÂY (nếu có): {recent_head_to_head}

Trả về JSON với cấu trúc:
{
  "win_prediction": {"team_a_percent": 55, "team_b_percent": 45, "reasoning": "..."},
  "team_a_strengths": ["...", "..."],
  "team_b_strengths": ["...", "..."],
  "key_players": [{"name": "...", "team": "A", "reason": "..."}],
  "pre_match_summary": "Đoạn văn ngắn 2-3 câu tiếng Việt"
}
```

---

## 11. Màn hình và UI chi tiết

### Layout Desktop (≥ 1024px):
- Sidebar trái cố định (240px): logo, menu navigation, avatar user
- Nội dung chính (flex-1): header + content area
- Có thể có right panel tùy màn hình

### Layout Mobile (< 1024px):
- Bottom navigation bar (5 tab)
- Không có sidebar
- Header đơn giản với hamburger menu

### Các màn hình cần có:

#### `/login`
- Form đăng nhập (username + password)
- Link đăng ký
- Responsive: centered card cả desktop lẫn mobile

#### `/register`
- Form đăng ký (username, full_name, password, confirm password)
- Thông báo: "Tài khoản của bạn đang chờ admin duyệt"

#### `/dashboard` (trang chủ sau login)
- **Desktop:** 3 cột: lịch trận tuần này | thống kê nhanh | top 5 bảng xếp hạng
- **Mobile:** stack dọc: banner trận tiếp theo → bảng xếp hạng mini → lịch trận
- Calendar view theo tuần: click vào ngày → thấy trận hôm đó
- Hiển thị trạng thái từng trận bằng badge màu

#### `/matches` (danh sách trận)
- Filter: tuần này / tháng này / tất cả
- Timeline view: nhóm theo tháng
- Mỗi trận: ngày, địa điểm, trạng thái, tỉ số (nếu có), số người

#### `/matches/create` (admin)
- Form: ngày, giờ, địa điểm, ghi chú, số người tối đa
- Chọn người tham gia từ danh sách users ACTIVE
- Chọn 2 đội trưởng

#### `/matches/:id` (chi tiết trận)
- **Tab Overview:** thông tin cơ bản, danh sách người tham gia, trạng thái
- **Tab Spin:** màn hình vòng quay (chỉ active khi status=PICKING)
- **Tab Pick:** chọn người vào đội (realtime)
- **Tab Lineup:** sơ đồ đội hình (active khi status=LINEUP/FINISHED)
- **Tab Result:** kết quả, thống kê, AI analysis (active khi status=FINISHED)

#### Màn hình Spin (`/matches/:id` → tab Spin):
- **Desktop:** chia đôi màn hình: bên trái vòng quay lớn, bên phải danh sách người xem online
- **Mobile:** vòng quay full width, danh sách người xem thu nhỏ bên dưới
- Hiển thị avatar + tên 2 đội trưởng trên vòng quay
- Nút "Quay ngay" (chỉ admin thấy)
- Sau khi quay: hiển thị winner với animation confetti

#### Màn hình Pick (`/matches/:id` → tab Pick):
- **Desktop:** 3 cột: [Team A] [Hàng chờ] [Team B]
- **Mobile:** [Hàng chờ] ở trên, [Team A | Team B] ở dưới dạng 2 cột nhỏ
- Tên người đang đến lượt chọn highlighted
- Avatar + tên mỗi người, click để chọn (chỉ đội trưởng đến lượt)

#### Màn hình Lineup:
- **Desktop:** sân bóng chiếm 60% màn hình, panel phải là danh sách cầu thủ chưa đặt vị trí
- **Mobile:** sân bóng full width, scroll xuống để xem danh sách
- Kéo thả cầu thủ vào vị trí
- Nút "Preset 2-3-1" tự xếp vị trí mặc định
- Nút "Xuất ảnh" → PNG
- Nút "Lưu lineup" (admin/đội trưởng)

#### `/leaderboard`
- **Desktop:** bảng xếp hạng full, filter theo season, sort theo goals/assists/wins
- **Mobile:** tabs: Goals | Assists | Thắng | Win Rate
- Top 3 có highlight đặc biệt (vàng, bạc, đồng)
- Click vào cầu thủ → `/players/:id`

#### `/players/:id` (profile cầu thủ)
- Avatar, tên, số trận, tổng goals, assists, win rate
- Biểu đồ phong độ 10 trận gần nhất (line chart)
- Lịch sử trận (có thể click vào từng trận)

#### `/admin` (admin panel)
- Duyệt tài khoản PENDING
- Danh sách user, ban/unban
- Nhập kết quả trận (goals, assists từng người, tỉ số)

---

## 12. Tính năng bổ sung (implement sau core)

Sau khi hoàn thiện core, implement thêm theo thứ tự ưu tiên:

1. **MVP trận** — admin đánh dấu 1 người là MVP, hiển thị trên profile
2. **Form phong độ** — 5 trận gần nhất của mỗi cầu thủ: W/L, hiển thị dạng dot indicator
3. **Export lineup PNG** — `html2canvas` chụp sơ đồ sân → download file
4. **Season** — mỗi năm là 1 season, leaderboard reset, lưu lịch sử season cũ
5. **Thống kê head-to-head** — 2 cầu thủ hay đá cùng đội nhau bao nhiêu lần, win rate
6. **"Cặp đôi ăn ý"** — đôi cầu thủ có win rate cao nhất khi đá cùng team

---

## 13. Cấu trúc thư mục

### Frontend
```
src/
  components/
    layout/         # Sidebar, BottomNav, Header
    ui/             # Button, Badge, Card, Modal, Toast
    match/          # MatchCard, StatusBadge, ScoreBoard
    spin/           # SpinWheel, SpinResult
    pick/           # PickList, TeamColumn
    lineup/         # FootballPitch, PlayerToken, LineupExport
    leaderboard/    # LeaderboardTable, PlayerRank
    ai/             # AIAnalysisCard, WinPrediction
  pages/
    auth/           # LoginPage, RegisterPage
    DashboardPage
    MatchListPage
    MatchDetailPage
    LeaderboardPage
    PlayerProfilePage
    AdminPage
  hooks/
    useWebSocket.ts
    useAuth.ts
    useMatch.ts
  store/
    authStore.ts
    matchStore.ts
  services/
    api.ts          # axios instance với interceptor
    matchService.ts
    authService.ts
  types/
    index.ts        # tất cả TypeScript types
  utils/
    spinEngine.ts   # deterministic spin từ seed
    dateUtils.ts
```

### Backend
```
src/main/java/com/footballsquad/
  config/
    SecurityConfig.java
    WebSocketConfig.java
    JwtConfig.java
    CacheConfig.java
  controller/
    AuthController.java
    MatchController.java
    SpinController.java
    LineupController.java
    StatsController.java
    LeaderboardController.java
    AdminController.java
    AIController.java
  service/
    AuthService.java
    MatchService.java
    SpinService.java
    TeamPickService.java
    LineupService.java
    StatsService.java
    LeaderboardService.java
    GeminiService.java
    WebSocketService.java
  repository/
    UserRepository.java
    MatchRepository.java
    SpinSessionRepository.java
    PlayerStatsRepository.java
    LeaderboardRepository.java
  model/
    User.java
    Match.java
    MatchParticipant.java
    MatchLineup.java
    SpinSession.java
    PlayerStats.java
    LeaderboardCache.java
  dto/          # Request/Response DTOs
  exception/    # Custom exceptions + GlobalExceptionHandler
  websocket/
    MatchWebSocketController.java
```

---

## 14. Luồng hoàn chỉnh (End-to-End)

```
1. Admin tạo trận → chọn người tham gia → chọn 2 đội trưởng
2. Admin mở tab Spin → bấm "Bắt đầu quay"
   → Backend sinh seed, lưu DB, broadcast qua WebSocket
   → Tất cả client nhận seed, chạy animation đồng bộ
   → Hiển thị winner
3. Chuyển sang tab Pick
   → Đội trưởng thắng chọn người đầu tiên → Team A
   → Đội trưởng thua chọn → Team B
   → Luân phiên cho đến đủ người (7v7 = 6 người mỗi đội ngoài đội trưởng)
   → Người dư → Bench
4. Chuyển sang tab Lineup
   → Admin/đội trưởng kéo thả người vào vị trí trên sân
   → Bấm "Lưu" → broadcast cho tất cả
   → Bấm "Xuất ảnh" → tải PNG
   → Backend tự động gọi Gemini (1 lần) → cache AI analysis
5. Thi đấu (ngoài app)
6. Sau trận: Admin vào tab Result
   → Nhập tỉ số, goals + assists từng người, MVP
   → Backend cập nhật stats, leaderboard, gọi Gemini lần 2 (post-match summary)
   → Broadcast score qua WebSocket
7. Mọi người vào xem kết quả, AI summary, leaderboard cập nhật
```

---

## 15. Bảo mật và DevOps

### Bảo mật:
- Gemini API key chỉ trong `.env` backend, không bao giờ expose
- CORS chỉ allow domain Vercel và localhost:5173
- Rate limit: `/api/auth/login` tối đa 10 requests/phút/IP (Spring Security + Bucket4j)
- JWT refresh token lưu trong httpOnly cookie (không localStorage)
- WebSocket authentication: validate JWT tại `HandshakeInterceptor`
- SQL injection: dùng JPA parameterized queries, không String concatenation
- HTTPS bắt buộc (Nginx + Let's Encrypt)

### Docker Compose (VPS):
```yaml
services:
  postgres:
    image: postgres:15
    volumes: [./data:/var/lib/postgresql/data]
    env_file: .env
  
  backend:
    build: ./backend
    depends_on: [postgres]
    env_file: .env
    ports: ["8080:8080"]
  
  nginx:
    image: nginx:alpine
    ports: ["80:80", "443:443"]
    volumes: [./nginx.conf:/etc/nginx/nginx.conf, ./certs:/etc/letsencrypt]
    depends_on: [backend]
```

### Nginx config (tóm tắt):
- HTTPS trên 443, redirect HTTP → HTTPS
- `/api/` proxy_pass → `http://backend:8080`
- `/ws` proxy_pass với `upgrade` headers (WebSocket)
- Gzip compression bật
- CORS headers cho domain Vercel

### Vercel (Frontend):
- `vercel.json` với rewrites: tất cả route → `index.html` (SPA)
- Environment variable: `VITE_API_URL=https://api.yourdomain.com`
- Build command: `npm run build`, output: `dist`

---

## 16. Checklist triển khai

### Giai đoạn 1 – Nền tảng (Tuần 1–2)
- [ ] Init Spring Boot project, cấu hình PostgreSQL, Flyway migration
- [ ] Implement Auth (register, login, JWT, refresh token)
- [ ] Admin approve/ban user
- [ ] Init React project (Vite + TypeScript + Tailwind)
- [ ] Layout Desktop + Mobile (sidebar / bottom nav)
- [ ] Màn hình Login, Register
- [ ] Axios instance + auth interceptor (tự refresh token)

### Giai đoạn 2 – Core Match (Tuần 3–4)
- [ ] CRUD matches (Backend + Frontend)
- [ ] Dashboard với calendar view theo tuần
- [ ] Thêm người tham gia vào trận (admin)
- [ ] WebSocket setup (STOMP + SockJS)
- [ ] Vòng quay: Backend sinh seed, Frontend animation đồng bộ
- [ ] Team picking realtime
- [ ] Reconnect logic + banner UI

### Giai đoạn 3 – Lineup & Stats (Tuần 5)
- [ ] Lineup builder (drag-drop trên sân SVG)
- [ ] Lưu + broadcast lineup
- [ ] Xuất lineup PNG (html2canvas)
- [ ] Admin nhập kết quả (tỉ số, goals, assists)
- [ ] Cập nhật leaderboard sau trận

### Giai đoạn 4 – Leaderboard & Profile (Tuần 6)
- [ ] Bảng xếp hạng full (sort/filter)
- [ ] Profile cầu thủ + biểu đồ phong độ
- [ ] Lịch sử trận cá nhân

### Giai đoạn 5 – AI Integration (Tuần 7)
- [ ] Gemini service (gộp prompt, cache)
- [ ] Hiển thị AI pre-match analysis
- [ ] Hiển thị win prediction
- [ ] Hiển thị post-match summary

### Giai đoạn 6 – Hoàn thiện (Tuần 8)
- [ ] MVP marking
- [ ] Form phong độ (5 trận gần nhất)
- [ ] Test toàn bộ luồng E2E
- [ ] Docker Compose + Nginx trên VPS
- [ ] SSL Let's Encrypt
- [ ] Deploy Frontend lên Vercel + bind domain
- [ ] Smoke test production

---

## 17. Câu hỏi cần xác nhận với người dùng trước khi code

1. Mỗi trận 7v7, vậy khi tạo trận admin có thể đổi format thành 5v5 hoặc 11v11 không, hay cố định 7v7?
2. Đội trưởng có quyền tự lưu lineup, hay chỉ admin mới được lưu?
3. App có cần đa ngôn ngữ (EN/VI) không, hay chỉ tiếng Việt?
4. Avatar cầu thủ: upload ảnh thật, hay chỉ dùng chữ cái đầu (initials avatar)?
5. Có cần tính năng thông báo qua email khi trận mới được tạo không?
6. Áo đội hình màu gì? Đội A màu đỏ-trắng (như ảnh mẫu), Đội B màu gì?
7. Season (mùa giải) tính theo năm dương lịch hay theo mùa tự định nghĩa?
8. Có cần chức năng chat / comment trong trận không?

---

*Prompt này được tổng hợp từ yêu cầu người dùng. Tất cả chi tiết kỹ thuật, API, schema đều đã được thiết kế sẵn. AI agent chỉ cần implement theo đúng spec này.*