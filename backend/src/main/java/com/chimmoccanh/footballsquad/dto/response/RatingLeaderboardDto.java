package com.chimmoccanh.footballsquad.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RatingLeaderboardDto {
    private int rank;
    private UserDto user;
    private Double totalRating;     // Tổng điểm tích lũy trong kỳ (làm tròn 1 chữ số, vd: 24.5)
    private Double averageRating;   // Điểm trung bình (làm tròn 1 chữ số, vd: 8.2)
    private Integer ratedMatches;   // Số trận được chấm điểm
    private Integer totalMatches;   // Tổng số trận đã tham gia trong kỳ
    private Integer totalGoals;     // Bàn thắng trong kỳ
    private Integer totalAssists;   // Kiến tạo trong kỳ
    private Integer totalSaves;     // Cứu thua trong kỳ
    private Integer totalMvp;       // MVP trong kỳ
    private Boolean isBestPlayer;   // Cầu thủ hay nhất tuần/tháng (Rank 1 và totalRating > 0)
}
