import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { bookingService } from '../../mocks/services';
import {
  Clock,
  Dumbbell,
  CheckCircle2,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  Flame,
  Award,
} from 'lucide-react';

interface ExerciseSet {
  name: string;
  muscle: string;
  sets: number;
  reps: number;
  weightKg: number;
  completed: boolean;
}

export const TrainerSessionPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Timer simulation
  const [secondsElapsed, setSecondsElapsed] = useState(1420); // ~23 mins into session
  const [isCompleted, setIsCompleted] = useState(false);

  // Live session exercises
  const [exercises, setExercises] = useState<ExerciseSet[]>([
    { name: 'Barbell Bench Press (Đẩy ngực ngang)', muscle: 'Ngực', sets: 4, reps: 10, weightKg: 65, completed: true },
    { name: 'Incline Dumbbell Press (Đẩy ngực trên)', muscle: 'Ngực trên', sets: 3, reps: 12, weightKg: 22, completed: true },
    { name: 'Dips (Xà kép)', muscle: 'Ngực & Tay sau', sets: 3, reps: 12, weightKg: 0, completed: false },
    { name: 'Triceps Rope Pushdown', muscle: 'Tay sau', sets: 4, reps: 15, weightKg: 25, completed: false },
  ]);

  const [notes, setNotes] = useState('Học viên thực hiện form chuẩn, lực đẩy ổn định. Cần siết chặt bả vai hơn ở hiệp cuối.');

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleExercise = (index: number) => {
    setExercises((prev) =>
      prev.map((ex, i) => (i === index ? { ...ex, completed: !ex.completed } : ex))
    );
  };

  const handleCompleteSession = async () => {
    if (!id) return;
    try {
      await bookingService.completeBooking(id);
      setIsCompleted(true);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back button & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/trainer')}
            className="text-xs text-text-secondary hover:text-text-primary flex items-center gap-1 mb-1 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Quay lại Ca dạy
          </button>
          <h1 className="text-2xl font-black text-text-primary tracking-tight">
            Bộ Ghi Nhận Buổi Tập Trực Tiếp (In-Session Logger)
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Mã ca: <strong className="font-mono text-text-primary">{id}</strong> • Hội viên: <strong>Nguyễn Văn An</strong>
          </p>
        </div>

        {/* Live Stopwatch */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white shadow-sm">
          <Clock className="w-4 h-4 text-volt animate-pulse" />
          <div>
            <span className="text-[10px] text-slate-400 block leading-none font-semibold">Thời gian ca tập:</span>
            <span className="text-lg font-mono font-black text-volt leading-tight">
              {formatTime(secondsElapsed)} / 60:00
            </span>
          </div>
        </div>
      </div>

      {isCompleted ? (
        <Card className="p-8 text-center space-y-4 bg-emerald-50/50 border-emerald-200">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-emerald-950">Buổi tập đã hoàn thành xuất sắc!</h2>
          <p className="text-xs text-emerald-800 max-w-md mx-auto">
            Hệ thống đã trừ 1 lượt tập của học viên, lưu log lịch sử bài tập và ghi nhận số ca dạy cho bạn.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Button variant="volt" onClick={() => navigate('/trainer')}>
              Trở về Dashboard PT
            </Button>
          </div>
        </Card>
      ) : (
        <>
          {/* Exercises Logger Table */}
          <Card className="p-0 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-border flex items-center justify-between">
              <h2 className="text-sm font-bold text-text-primary">Các động tác tập luyện hôm nay</h2>
              <span className="text-xs text-text-secondary">Đánh dấu khi học viên hoàn thành bài tập</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white border-b border-border text-text-secondary font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-4 py-3">Xong</th>
                    <th className="px-4 py-3">Bài tập</th>
                    <th className="px-4 py-3">Nhóm cơ</th>
                    <th className="px-4 py-3">Số hiệp</th>
                    <th className="px-4 py-3">Số lần</th>
                    <th className="px-4 py-3">Mức tạ (kg)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {exercises.map((ex, idx) => (
                    <tr
                      key={idx}
                      className={ex.completed ? 'bg-emerald-50/40 text-emerald-950' : 'hover:bg-slate-50/70'}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={ex.completed}
                          onChange={() => handleToggleExercise(idx)}
                          className="w-4 h-4 rounded border-border accent-volt cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3 font-bold text-text-primary">
                        <span className={ex.completed ? 'line-through text-slate-500' : ''}>{ex.name}</span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-text-secondary">{ex.muscle}</td>
                      <td className="px-4 py-3 font-mono">{ex.sets} hiệp</td>
                      <td className="px-4 py-3 font-mono">{ex.reps} reps</td>
                      <td className="px-4 py-3 font-mono font-bold text-volt-dark">{ex.weightKg} kg</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Trainer Notes */}
          <Card className="p-5 space-y-3">
            <label className="text-xs font-bold text-text-primary block">
              Nhận xét & Đánh giá thể lực học viên trong buổi:
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full p-2.5 rounded-md bg-surface border border-border text-xs text-text-primary focus:outline-none focus:border-volt-dark"
            />
          </Card>

          {/* Atomic Complete Session Action */}
          <div className="p-4 bg-slate-900 border border-slate-700 rounded-lg text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="font-bold text-sm text-volt">Xác nhận Hoàn thành Buổi Huấn luyện</div>
              <div className="text-[11px] text-slate-300 mt-0.5">
                Thao tác nguyên tử: Trừ 1 buổi tập khả dụng, cộng 1 ca hoàn thành vào doanh thu PT.
              </div>
            </div>
            <Button
              variant="volt"
              size="lg"
              onClick={handleCompleteSession}
              icon={<CheckCircle2 className="w-5 h-5 stroke-[2.5]" />}
            >
              Ký duyệt Hoàn thành Buổi tập
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
