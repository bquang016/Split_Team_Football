package com.chimmoccanh.footballsquad.model.enums;

public enum TradeStatus {
    PENDING,    // Đang chờ phản hồi từ đội kia
    ACCEPTED,   // Đã được chấp nhận — 2 cầu thủ đổi chỗ
    REJECTED,   // Bị từ chối
    CANCELLED,  // Người gửi hủy yêu cầu
    EXPIRED     // Hết thời gian Trade Window
}
