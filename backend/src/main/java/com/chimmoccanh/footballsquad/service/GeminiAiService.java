package com.chimmoccanh.footballsquad.service;

import com.chimmoccanh.footballsquad.dto.response.AIAnalysisDto;
import com.chimmoccanh.footballsquad.dto.response.MatchDto;
import com.chimmoccanh.footballsquad.model.Match;
import com.chimmoccanh.footballsquad.model.MatchParticipant;
import com.chimmoccanh.footballsquad.model.enums.Team;
import com.chimmoccanh.footballsquad.repository.MatchParticipantRepository;
import com.chimmoccanh.footballsquad.repository.MatchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class GeminiAiService {

    private final MatchRepository matchRepository;
    private final MatchParticipantRepository participantRepository;
    private final WebClient.Builder webClientBuilder;

    @Value("${app.gemini.api-key:}")
    private String apiKey;

    @Value("${app.gemini.model:gemini-1.5-flash}")
    private String geminiModel;

    @Transactional
    public AIAnalysisDto analyzeMatch(UUID matchId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy trận đấu"));

        List<MatchParticipant> teamAPlayers = participantRepository.findByMatchIdAndTeam(matchId, Team.A);
        List<MatchParticipant> teamBPlayers = participantRepository.findByMatchIdAndTeam(matchId, Team.B);

        String teamANames = teamAPlayers.stream()
                .map(p -> p.getUser().getFullName() + (p.getIsHost() ? " (C)" : ""))
                .collect(Collectors.joining(", "));

        String teamBNames = teamBPlayers.stream()
                .map(p -> p.getUser().getFullName() + (p.getIsHost() ? " (C)" : ""))
                .collect(Collectors.joining(", "));

        AIAnalysisDto result;

        if (apiKey != null && !apiKey.isBlank() && !apiKey.startsWith("your-")) {
            try {
                result = callGeminiApi(teamANames, teamBNames);
            } catch (Exception e) {
                log.warn("Gemini API call failed, falling back to local analysis", e);
                result = generateLocalAnalysis(teamAPlayers.size(), teamBPlayers.size(), teamANames, teamBNames);
            }
        } else {
            result = generateLocalAnalysis(teamAPlayers.size(), teamBPlayers.size(), teamANames, teamBNames);
        }

        match.setAiAnalysis(result.getAnalysis() + "\n\n" + result.getTacticalAdvice());
        match.setAiAnalyzedAt(LocalDateTime.now());
        matchRepository.save(match);

        return result;
    }

    private AIAnalysisDto callGeminiApi(String teamANames, String teamBNames) {
        String prompt = "Bạn là trợ lý chiến thuật bóng đá 7v7 chuyên nghiệp. Phân tích cuộc đối đầu giữa 2 đội:\n"
                + "Đội A (Áo đỏ Tây Ban Nha): " + (teamANames.isBlank() ? "Chưa có cầu thủ" : teamANames) + "\n"
                + "Đội B (Áo xanh Pháp): " + (teamBNames.isBlank() ? "Chưa có cầu thủ" : teamBNames) + "\n"
                + "Hãy viết đánh giá bằng tiếng Việt với các phần: Nhận định sức mạnh 2 bên, Dự đoán tỉ lệ thắng, và Lời khuyên chiến thuật 7v7.";

        String url = "https://generativelanguage.googleapis.com/v1beta/models/" + geminiModel + ":generateContent?key=" + apiKey;

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(Map.of("text", prompt)))
                )
        );

        WebClient webClient = webClientBuilder.build();
        Map response = webClient.post()
                .uri(url)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        String generatedText = extractTextFromGeminiResponse(response);

        return AIAnalysisDto.builder()
                .analysis(generatedText)
                .winPrediction("Đội A: 50% - Đội B: 50%")
                .tacticalAdvice("Kiểm soát trung lộ và phản công cánh nhanh chóng.")
                .analyzedAt(LocalDateTime.now())
                .build();
    }

    @SuppressWarnings("unchecked")
    private String extractTextFromGeminiResponse(Map response) {
        if (response != null && response.containsKey("candidates")) {
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
            if (!candidates.isEmpty()) {
                Map<String, Object> firstCandidate = candidates.get(0);
                Map<String, Object> content = (Map<String, Object>) firstCandidate.get("content");
                if (content != null && content.containsKey("parts")) {
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                    if (!parts.isEmpty()) {
                        return (String) parts.get(0).get("text");
                    }
                }
            }
        }
        return "Không thể nhận phản hồi từ mô hình AI.";
    }

    private AIAnalysisDto generateLocalAnalysis(int countA, int countB, String teamANames, String teamBNames) {
        int diff = countA - countB;
        String prediction;
        if (diff > 0) {
            prediction = "Đội A (Tây Ban Nha): 55% - Đội B (Pháp): 45%";
        } else if (diff < 0) {
            prediction = "Đội A (Tây Ban Nha): 45% - Đội B (Pháp): 55%";
        } else {
            prediction = "Đội A (Tây Ban Nha): 50% - Đội B (Pháp): 50%";
        }

        String analysis = "Cân bằng lực lượng giữa hai bên: Đội A với " + countA + " cầu thủ và Đội B với " + countB + " cầu thủ. "
                + "Trận đấu 7v7 yêu cầu tốc độ chuyển đổi trạng thái nhanh giữa phòng ngự và tấn công.";

        String tacticalAdvice = "Đội A (Đỏ) nên tận dụng các đường chuyền ngắn xẻ nách hàng thủ. Đội B (Xanh) cần duy trì cự ly đội hình hẹp, chớp cơ hội phản công từ các pha sút xa.";

        return AIAnalysisDto.builder()
                .analysis(analysis)
                .winPrediction(prediction)
                .tacticalAdvice(tacticalAdvice)
                .analyzedAt(LocalDateTime.now())
                .build();
    }
}
