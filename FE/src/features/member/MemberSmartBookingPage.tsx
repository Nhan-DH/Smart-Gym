import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { bookingService } from '../../mocks/services';
import { SmartBookingPlan } from '../../types';
import {
  Sparkles,
  Cpu,
  Calendar,
  CheckCircle2,
  Clock,
  User,
  ShieldCheck,
  TrendingDown,
  ArrowRight,
} from 'lucide-react';

export const MemberSmartBookingPage: React.FC = () => {
  const navigate = useNavigate();
  const [sessionsPerWeek, setSessionsPerWeek] = useState(3);
  const [preferredTimeRange, setPreferredTimeRange] = useState('EVENING');
  const [isSolving, setIsSolving] = useState(false);
  const [plans, setPlans] = useState<SmartBookingPlan[] | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('plan-opt-1');
  const [confirmedSuccess, setConfirmedSuccess] = useState(false);

  const handleRunSolver = async () => {
    setIsSolving(true);
    try {
      const res = await bookingService.generateSmartPlans({
        sessionsPerWeek,
        preferredDays: [1, 3, 5],
        preferredTimeRange,
      });
      setPlans(res);
      setSelectedPlanId(res[0].planId);
    } finally {
      setIsSolving(false);
    }
  };

  const handleConfirmPlan = async () => {
    if (!plans) return;
    const planToConfirm = plans.find((p) => p.planId === selectedPlanId);
    if (!planToConfirm) return;

    try {
      await bookingService.confirmSmartPlan('MB-1001', planToConfirm);
      setConfirmedSuccess(true);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header with Back button */}
      <div>
        <button
          onClick={() => navigate('/app/schedule')}
          className="text-xs font-semibold text-text-secondary hover:text-text-primary flex items-center gap-1.5 mb-2 transition-colors cursor-pointer"
        >
          <ArrowRight className="w-3.5 h-3.5 rotate-180" /> Quay lại Lịch tập của tôi
        </button>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold bg-slate-900 text-volt border border-slate-700 uppercase tracking-wider mb-2">
          <Cpu className="w-3.5 h-3.5 text-volt" /> Google OR-Tools CP-SAT Constraint Programming
        </div>
        <h1 className="text-2xl font-black text-text-primary tracking-tight">
          Xếp Lịch Tập Thông Minh (Smart Schedule Optimization)
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Giải bài toán tối ưu hóa đa mục tiêu: Khớp ca trực PT, giãn cách nghỉ ngơi 48h giữa các buổi và tránh giờ cao điểm phòng tập
        </p>
      </div>

      {confirmedSuccess ? (
        <Card className="p-8 text-center space-y-4 bg-emerald-50/50 border-emerald-200">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-emerald-950">Đã khóa lịch trọn gói thành công!</h2>
          <p className="text-xs text-emerald-800 max-w-md mx-auto">
            Toàn bộ các buổi tập đã được ghi nhận nguyên tử trong 1 Database Transaction an toàn.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Button variant="volt" onClick={() => navigate('/app/schedule')}>
              Xem lịch tập của tôi
            </Button>
            <Button variant="secondary" onClick={() => navigate('/app')}>
              Về trang chủ
            </Button>
          </div>
        </Card>
      ) : (
        <>
          {/* Solver Input Card */}
          <Card className="p-5 space-y-4">
            <h2 className="text-sm font-bold text-text-primary">Thiết lập Ràng buộc & Nguyện vọng Tập luyện</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-text-primary block mb-1">
                  Số buổi muốn tập trong tuần: <strong className="text-volt-dark">{sessionsPerWeek} buổi</strong>
                </label>
                <input
                  type="range"
                  min={2}
                  max={5}
                  value={sessionsPerWeek}
                  onChange={(e) => setSessionsPerWeek(Number(e.target.value))}
                  className="w-full accent-volt"
                />
                <div className="flex justify-between text-[10px] text-text-muted mt-1">
                  <span>2 buổi (Duy trì)</span>
                  <span>3 buổi (Khuyến nghị)</span>
                  <span>4-5 buổi (Nâng cao)</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-text-primary block mb-1">Khung giờ rảnh mong muốn</label>
                <select
                  value={preferredTimeRange}
                  onChange={(e) => setPreferredTimeRange(e.target.value)}
                  className="w-full h-9 px-3 rounded-md bg-surface border border-border text-xs font-medium text-text-primary focus:outline-none focus:border-volt-dark"
                >
                  <option value="MORNING">Buổi sáng (07:00 - 10:00)</option>
                  <option value="AFTERNOON">Buổi chiều (14:00 - 17:00 • Vắng người)</option>
                  <option value="EVENING">Buổi tối (17:30 - 20:30 • Sau giờ làm)</option>
                </select>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-md border border-border text-[11px] text-text-secondary flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Thuật toán đảm bảo 100%:</strong> Không trùng giờ với học viên khác (PostgreSQL GiST Exclusions), tự động tính toán thời gian nghỉ cơ 48 tiếng giữa các buổi tập nặng.
              </span>
            </div>

            <Button
              variant="volt"
              size="md"
              onClick={handleRunSolver}
              isLoading={isSolving}
              icon={<Sparkles className="w-4 h-4 stroke-[2.5]" />}
            >
              {isSolving ? 'Đang giải bài toán tối ưu CP-SAT...' : 'Khởi động Tìm lịch Tối ưu'}
            </Button>
          </Card>

          {/* Generated Plans Comparison */}
          {plans && (
            <div className="space-y-4 pt-2">
              <h2 className="text-base font-black text-text-primary">
                Kết quả: 3 Phương án Tối ưu Riêng biệt
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plans.map((p) => {
                  const isSelected = selectedPlanId === p.planId;
                  return (
                    <div
                      key={p.planId}
                      onClick={() => setSelectedPlanId(p.planId)}
                      className={`p-5 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-volt bg-slate-900 text-white shadow-volt ring-1 ring-volt'
                          : 'border-border bg-surface hover:bg-slate-50 text-text-primary'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isSelected
                                ? 'bg-volt text-darksidebar-bg'
                                : 'bg-slate-100 text-slate-800'
                            }`}
                          >
                            Độ khớp: {p.matchScore}%
                          </span>
                          {p.planId === 'plan-opt-1' && (
                            <span className="text-[10px] text-volt font-bold uppercase tracking-wider">
                              Tối ưu nhất
                            </span>
                          )}
                        </div>

                        <h3 className="font-bold text-sm mb-1">{p.title}</h3>
                        <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">{p.description}</p>

                        {/* Slots */}
                        <div className="space-y-2 border-t border-slate-800/60 pt-3">
                          {p.slots.map((s, idx) => (
                            <div
                              key={idx}
                              className="p-2 rounded bg-slate-800/40 border border-slate-700/50 text-xs space-y-0.5"
                            >
                              <div className="font-bold text-volt flex items-center justify-between">
                                <span>{s.dayName}</span>
                                <span className="font-mono text-[11px] text-white">
                                  {s.startTime} - {s.endTime}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-300">PT: {s.trainerName}</div>
                              <div className="text-[10px] text-slate-400 italic">Mục tiêu: {s.focus}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold">
                        <span>{isSelected ? 'Đang chọn phương án này' : 'Bấm để chọn'}</span>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-volt bg-volt text-black' : 'border-slate-500'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Confirm Selection CTA */}
              <div className="p-4 bg-slate-900 border border-slate-700 rounded-lg text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="text-xs text-slate-300">
                    Đang chọn phương án:{' '}
                    <strong className="text-volt">
                      {plans.find((p) => p.planId === selectedPlanId)?.title}
                    </strong>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Khóa đồng thời 3 buổi tập với giao dịch nguyên tử, không sợ đụng giờ.
                  </div>
                </div>
                <Button
                  variant="volt"
                  size="md"
                  onClick={handleConfirmPlan}
                  icon={<CheckCircle2 className="w-4 h-4 stroke-[2.5]" />}
                >
                  Xác nhận Khóa lịch Tuần
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
