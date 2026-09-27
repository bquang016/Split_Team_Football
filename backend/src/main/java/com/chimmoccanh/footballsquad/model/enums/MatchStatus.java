package com.chimmoccanh.footballsquad.model.enums;

public enum MatchStatus {
    PENDING,              // Bước 1: Điểm danh đang mở
    JERSEY_SELECTION,     // Bước 2: Chọn áo đấu (sau khi quay xác định đội trưởng thắng)
    PLAYER_PICKING,       // Bước 3: Pick cầu thủ lần lượt (mỗi lượt quay spin trước)
    TRADE_WINDOW,         // Bước 4: Thương lượng / đổi cầu thủ (tối đa 10 phút)
    IN_PROGRESS,          // Đang thi đấu
    COMPLETED,            // Kết thúc - mở nhập thống kê
    CANCELLED
}
