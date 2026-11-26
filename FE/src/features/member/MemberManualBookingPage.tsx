import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { trainerService, bookingService, memberService } from '../../mocks/services';
import { TrainerProfile, DetailedMember } from '../../types';
import {
  CalendarDays,
  Clock,
  User,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Dumbbell,
  Award,
} from 'lucide-react';

export const MemberManualBookingPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [trainers, setTrainers] = useState<TrainerProfile[]>([]);
  const [member, setMember] = useState<DetailedMember | null>(null);
  const [loading, setLoading] = useState(true);

  // Form selections
  const [selectedTrainer, setSelectedTrainer] = useState<TrainerProfile | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-26');
  const [selectedSlot, setSelectedSlot] = useState<string>('08:00 - 09:00');
  const [workoutTitle, setWorkoutTitle] = useState<string>('Tập Ngực & Thân trên');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const [tList, m] = await Promise.all([
          trainerService.getTrainers(),
          memberService.getMemberById('MB-1001'),
        ]);
        setTrainers(tList);
        setMember(m);
        if (tList.length > 0) setSelectedTrainer(tList[0]);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const availablePt =
    (member?.membership?.totalPt || 0) -
    (member?.membership?.usedPt || 0) -
    (member?.membership?.reservedPt || 0);

  const SLOTS = [
    '07:00 - 08:00',
    '08:00 - 09:00',
    '09:00 - 10:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
    '16:00 - 17:00',
    '18:00 - 19:00',
    '19:00 - 20:00',
  ];

  const handleConfirmBooking = async () => {
    if (!selectedTrainer || !member) return;
    try {
      setErrorMessage('');
      const [startHour, endHour] = selectedSlot.split(' - ');
      await bookingService.createBooking({
        memberId: member.id,
        memberName: member.name,
        trainerId: selectedTrainer.id,
        trainerName: selectedTrainer.name,
        membershipId: member.membership?.id || 'ms-1',
        startsAt: `${selectedDate}T${startHour}:00Z`,
        endsAt: `${selectedDate}T${endHour}:00Z`,
        workoutTitle,
      });
      setBookingSuccess(true);
    } catch (err) {
      setErrorMessage((err as Error).message);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <button
          type="button"
          onClick={() => navigate('/app/schedule')}
          className="text-xs font-semibold text-text-secondary hover:text-text-primary flex items-center gap-1.5 mb-2 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Quay lại Lịch tập của tôi
        </button>
        <h1 className="text-2xl font-black text-text-primary tracking-tight flex items-center gap-2">
          <CalendarDays className="w-6 h-6 text-darksidebar-bg dark:text-volt" />
          Đặt Lịch Tập Thủ Công (1 kèm 1)
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Chọn Huấn luyện viên, ngày và khung giờ 60 phút thích hợp theo ý muốn của bạn
        </p>
      </div>

      {/* Stepper Wizard Indicator */}
      <div className="grid grid-cols-4 gap-2 border-b border-border pb-4">
        {[
          { stepNum: 1, label: 'Chọn Huấn luyện viên' },
          { stepNum: 2, label: 'Chọn Ngày tập' },
          { stepNum: 3, label: 'Chọn Khung giờ 60p' },
          { stepNum: 4, label: 'Xác nhận đặt lịch' },
        ].map((s) => (
          <div
            key={s.stepNum}
            className={`flex flex-col border-t-2 pt-2 text-xs font-semibold ${
              step >= s.stepNum ? 'border-volt text-volt-dark' : 'border-border text-text-muted'
            }`}
          >
            <span className="text-[10px] uppercase font-bold text-slate-400">Bước {s.stepNum}</span>
            <span className="truncate">{s.label}</span>
          </div>
        ))}
      </div>

      {bookingSuccess ? (
        <Card className="p-8 text-center space-y-4 bg-emerald-50/50 border-emerald-200">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-emerald-950">Đặt lịch tập thành công!</h2>
          <p className="text-xs text-emerald-800 max-w-md mx-auto">
            Hệ thống đã khóa slot tập của bạn với PT <strong>{selectedTrainer?.name}</strong> vào lúc{' '}
            <strong>{selectedSlot}</strong> ngày <strong>{selectedDate}</strong>.
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
        <Card className="p-6 space-y-6">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: Select Trainer */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-text-primary">1. Chọn Huấn luyện viên (PT)</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {trainers.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTrainer(t)}
                    className={`p-4 rounded-md border cursor-pointer transition-all ${
                      selectedTrainer?.id === t.id
                        ? 'border-volt bg-slate-900 text-white shadow-sm'
                        : 'border-border bg-surface hover:bg-slate-50 text-text-primary'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <strong className="text-sm font-bold">{t.name}</strong>
                      <span className="text-[10px] font-mono text-slate-400">{t.id}</span>
                    </div>
                    <div className="text-xs text-slate-400 line-clamp-2 mb-2">{t.bio}</div>
                    <div className="flex flex-wrap gap-1">
                      {t.specialties.slice(0, 2).map((s, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-volt border border-slate-700"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Select Date */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-text-primary">2. Chọn Ngày tập (trong 7 ngày tới)</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {['2026-11-26', '2026-11-27', '2026-11-28', '2026-11-29', '2026-11-30', '2026-12-01', '2026-12-02'].map(
                  (d, idx) => (
                    <button
                      key={d}
                      onClick={() => setSelectedDate(d)}
                      className={`p-3 rounded-md border text-center transition-all ${
                        selectedDate === d
                          ? 'bg-slate-900 text-volt border-volt font-bold'
                          : 'bg-surface text-text-primary border-border hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-[10px] text-slate-400 uppercase">Ngày {idx + 1}</div>
                      <div className="text-xs font-bold mt-1 font-mono">{d}</div>
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Select Slot */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-text-primary">
                3. Chọn Khung giờ 60 phút (Ca trực của PT {selectedTrainer?.name})
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {SLOTS.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-3 rounded-md border text-center font-mono text-xs transition-all ${
                      selectedSlot === slot
                        ? 'bg-slate-900 text-volt border-volt font-bold'
                        : 'bg-surface text-text-primary border-border hover:bg-slate-50'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Confirmation */}
          {step === 4 && (
            <div className="space-y-4 text-xs">
              <h2 className="text-sm font-bold text-text-primary">4. Xác nhận Đặt lịch</h2>
              <div className="p-4 bg-slate-50 rounded-md border border-border space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-text-secondary block">Huấn luyện viên:</span>
                    <strong className="text-text-primary text-sm">{selectedTrainer?.name}</strong>
                  </div>
                  <div>
                    <span className="text-text-secondary block">Thời gian:</span>
                    <strong className="text-text-primary text-sm font-mono">
                      {selectedDate} ({selectedSlot})
                    </strong>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-text-primary block mb-1">Mục tiêu bài tập</label>
                  <Input
                    value={workoutTitle}
                    onChange={(e) => setWorkoutTitle(e.target.value)}
                    placeholder="VD: Tập Ngực & Tay sau, cải thiện tư thế"
                    required
                  />
                </div>

                <div className="p-2.5 bg-amber-50 rounded border border-amber-200 text-amber-900 text-[11px]">
                  Buổi tập này sẽ tạm khóa 1 lượt tập của bạn (reserved_pt + 1). Bạn có thể hủy hoàn lượt nếu thông báo trước 12 tiếng.
                </div>
              </div>
            </div>
          )}

          {/* Wizard Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            {step > 1 ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setStep((prev) => (prev - 1) as any)}
                icon={<ChevronLeft className="w-4 h-4" />}
              >
                Quay lại
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/app/schedule')}
                icon={<ChevronLeft className="w-4 h-4" />}
              >
                Quay lại Lịch tập
              </Button>
            )}

            {step < 4 ? (
              <Button
                variant="volt"
                size="sm"
                onClick={() => setStep((prev) => (prev + 1) as any)}
                icon={<ChevronRight className="w-4 h-4" />}
              >
                Tiếp tục
              </Button>
            ) : (
              <Button
                variant="volt"
                size="sm"
                onClick={handleConfirmBooking}
                icon={<CheckCircle2 className="w-4 h-4 stroke-[2.5]" />}
              >
                Xác nhận đặt lịch
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
