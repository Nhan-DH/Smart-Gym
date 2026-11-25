import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { workoutService } from '../../mocks/services';
import { WorkoutPlan } from '../../types';
import { BookOpen, Dumbbell, Clock, User, CheckCircle2, Flame, Award } from 'lucide-react';

export const MemberWorkoutsPage: React.FC = () => {
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await workoutService.getMemberWorkoutPlans('MB-1001');
        setWorkoutPlans(res);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-black text-text-primary tracking-tight flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-darksidebar-bg" />
          Giáo Án & Lộ Trình Bài Tập Cá Nhân
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Giáo án bài tập được Huấn luyện viên chuyên môn thiết kế riêng cho mục tiêu thể trạng của bạn
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-text-secondary text-sm">Đang tải giáo án bài tập...</div>
      ) : workoutPlans.length === 0 ? (
        <Card className="py-12 text-center text-text-secondary text-xs">
          Bạn chưa có giáo án bài tập nào. Hãy trao đổi với Huấn luyện viên trong buổi tập tới!
        </Card>
      ) : (
        <div className="space-y-6">
          {workoutPlans.map((plan) => (
            <Card key={plan.id} className="p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-border">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-text-primary">{plan.title}</h2>
                    <Badge variant="success">Phiên bản v{plan.version}</Badge>
                  </div>
                  <div className="text-xs text-text-secondary flex items-center gap-3 mt-1">
                    <span>
                      Huấn luyện viên: <strong>{plan.trainerName}</strong>
                    </span>
                    <span>•</span>
                    <span>Cập nhật ngày: {plan.createdAt}</span>
                  </div>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-volt text-xs font-bold">
                  <Flame className="w-4 h-4 text-volt" /> Mục tiêu: Tăng cơ giảm mỡ
                </div>
              </div>

              {/* Exercises Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-border text-text-secondary font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="px-4 py-3">#</th>
                      <th className="px-4 py-3">Tên động tác / Bài tập</th>
                      <th className="px-4 py-3">Nhóm cơ chính</th>
                      <th className="px-4 py-3">Số Hiệp (Sets)</th>
                      <th className="px-4 py-3">Số Lần (Reps)</th>
                      <th className="px-4 py-3">Mức tạ đề xuất</th>
                      <th className="px-4 py-3">Thời gian nghỉ</th>
                      <th className="px-4 py-3">Ghi chú kỹ thuật</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {plan.exercises.map((ex, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70">
                        <td className="px-4 py-3 font-mono font-bold text-slate-400">{idx + 1}</td>
                        <td className="px-4 py-3 font-bold text-text-primary">{ex.name}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-800">
                            {ex.muscleGroup}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-text-primary">{ex.sets} hiệp</td>
                        <td className="px-4 py-3 font-semibold text-text-primary">{ex.reps} lần</td>
                        <td className="px-4 py-3 font-mono font-bold text-volt-dark">{ex.weightKg} kg</td>
                        <td className="px-4 py-3 font-mono text-text-secondary">{ex.restSeconds}s</td>
                        <td className="px-4 py-3 text-text-secondary text-[11px] max-w-xs">
                          {ex.notes || 'Giữ thẳng lưng, kiểm soát chuyển động'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
