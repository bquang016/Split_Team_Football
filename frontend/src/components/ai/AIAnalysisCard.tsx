import React, { useState } from 'react';
import { Card, Button } from '../../ui';
import { aiService } from '../../services/aiService';
import { AIAnalysis } from '../../types';
import toast from 'react-hot-toast';

interface AIAnalysisCardProps {
  matchId: string;
  initialAnalysis?: string;
  initialAnalyzedAt?: string;
}

export const AIAnalysisCard: React.FC<AIAnalysisCardProps> = ({
  matchId,
  initialAnalysis,
  initialAnalyzedAt,
}) => {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(
    initialAnalysis
      ? {
          analysis: initialAnalysis,
          winPrediction: 'Đội A: 50% - Đội B: 50%',
          tacticalAdvice: 'Kiểm soát nhịp độ tuyến giữa và tổ chức phòng ngự từ xa.',
          analyzedAt: initialAnalyzedAt || new Date().toISOString(),
        }
      : null
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const res = await aiService.generateAnalysis(matchId);
      if (res.success && res.data) {
        setAnalysis(res.data);
        toast.success('Phân tích chiến thuật AI hoàn tất!');
      } else {
        toast.error('Không thể thực hiện phân tích AI');
      }
    } catch {
      toast.error('Lỗi khi gọi mô hình AI');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card elevation="level1" className="relative overflow-hidden border-indigo-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200/60 flex items-center justify-center text-indigo-600 shadow-xs">
            <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
          </div>
          <div>
            <h4 className="font-heading font-black text-base text-slate-900">
              Phân tích Chiến thuật AI (Gemini)
            </h4>
            <p className="text-xs font-mono text-slate-500">
              Nhận định tương quan lực lượng và đề xuất chiến thuật 7v7
            </p>
          </div>
        </div>

        <Button
          size="sm"
          variant="surface"
          isLoading={isLoading}
          onClick={handleGenerate}
          leftIcon="auto_awesome"
          className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
        >
          {analysis ? 'Phân tích lại' : 'Chạy phân tích AI'}
        </Button>
      </div>

      {analysis ? (
        <div className="flex flex-col gap-3.5 text-sm">
          {/* Win prediction badge */}
          {analysis.winPrediction && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between shadow-xs">
              <span className="text-xs font-mono text-slate-600 uppercase font-bold">
                Dự đoán cơ hội thắng:
              </span>
              <span className="font-mono font-bold text-xs text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
                {analysis.winPrediction}
              </span>
            </div>
          )}

          {/* Analysis body */}
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 whitespace-pre-line leading-relaxed text-xs sm:text-sm text-slate-700">
            {analysis.analysis}
          </div>

          {/* Tactical Advice */}
          {analysis.tacticalAdvice && (
            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 flex items-start gap-2.5 shadow-xs">
              <span className="material-symbols-outlined text-amber-600 text-[20px] flex-shrink-0 mt-0.5">
                tips_and_updates
              </span>
              <div>
                <span className="font-bold text-xs text-amber-900 block mb-0.5 font-heading">
                  Lời khuyên chiến thuật 7v7:
                </span>
                <p className="text-xs text-amber-800 leading-relaxed">{analysis.tacticalAdvice}</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="py-6 text-center text-xs text-slate-400 italic">
          Bấm "Chạy phân tích AI" để mô hình Gemini đánh giá lực lượng hai đội
        </div>
      )}
    </Card>
  );
};
