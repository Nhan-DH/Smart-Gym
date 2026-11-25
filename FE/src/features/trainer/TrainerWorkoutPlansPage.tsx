import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Dialog, DialogHeader, DialogBody, DialogFooter } from '../../components/common/Dialog';
import { Input } from '../../components/common/Input';
import { workoutService } from '../../mocks/services';
import { WorkoutPlan } from '../../types';
import { BookOpen, Plus, Dumbbell, Save, CheckCircle2, User } from 'lucide-react';

export const TrainerWorkoutPlansPage: React.FC = () => {
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('Giáo án Siết Cơ & Sức Bền - 4 Tuần');

  const loadPlans = async () => {
    try {
      setLoading(true);
      const res = await workoutService.getTrainerWorkoutPlans('PT-201');
      setPlans(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-text-primary tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-darksidebar-bg" />
            Soạn Thảo Giáo Án Bài Tập (Workout Plans)
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Thiết kế giáo án tập luyện chuyên môn hóa, thiết lập số sets, reps, kg và gán cho học viên
          </p>
        </div>

        <Button
          variant="volt"
          size="sm"
          onClick={() => setIsAddOpen(true)}
          icon={<Plus className="w-4 h-4 stroke-[2.5]" />}
        >
          Soạn giáo án mới
        </Button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-text-secondary text-sm">Đang tải giáo án...</div>
      ) : (
        <div className="space-y-6">
          {plans.map((p) => (
            <Card key={p.id} className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-border">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-text-primary">{p.title}</h2>
                    <Badge variant="success">Version v{p.version}</Badge>
                  </div>
                  <div className="text-xs text-text-secondary mt-0.5">
                    Học viên thụ hưởng: <strong className="text-text-primary">{p.memberName}</strong> ({p.memberId})
                  </div>
                </div>
              </div>

              {/* Exercises */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-border text-text-secondary font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="px-4 py-3">#</th>
                      <th className="px-4 py-3">Bài tập</th>
                      <th className="px-4 py-3">Nhóm cơ</th>
                      <th className="px-4 py-3">Số hiệp</th>
                      <th className="px-4 py-3">Số lần</th>
                      <th className="px-4 py-3">Mức tạ (kg)</th>
                      <th className="px-4 py-3">Nghỉ (giây)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {p.exercises.map((ex, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70">
                        <td className="px-4 py-2.5 font-mono text-slate-400">{idx + 1}</td>
                        <td className="px-4 py-2.5 font-bold text-text-primary">{ex.name}</td>
                        <td className="px-4 py-2.5 text-text-secondary">{ex.muscleGroup}</td>
                        <td className="px-4 py-2.5 font-mono">{ex.sets}</td>
                        <td className="px-4 py-2.5 font-mono">{ex.reps}</td>
                        <td className="px-4 py-2.5 font-mono font-bold text-volt-dark">{ex.weightKg} kg</td>
                        <td className="px-4 py-2.5 font-mono text-text-secondary">{ex.restSeconds}s</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Plan Dialog */}
      <Dialog isOpen={isAddOpen} onClose={() => setIsAddOpen(false)}>
        <DialogHeader
          title="Soạn Giáo Án Mới"
          description="Thiết lập danh mục bài tập và gán cho học viên"
        />
        <DialogBody className="space-y-4 text-xs">
          <div>
            <label className="text-xs font-bold text-text-primary block mb-1">Tên giáo án *</label>
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="VD: Giáo án Tăng Cơ 4 Buổi/Tuần"
              required
            />
          </div>
          <div>
            <label className="text-xs font-bold text-text-primary block mb-1">Gán cho học viên *</label>
            <select className="w-full h-9 px-3 rounded-md bg-surface border border-border text-xs text-text-primary">
              <option value="MB-1001">Nguyễn Văn An (MB-1001)</option>
              <option value="MB-1002">Trần Thị Bích (MB-1002)</option>
            </select>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setIsAddOpen(false)}>
            Hủy
          </Button>
          <Button variant="volt" onClick={() => setIsAddOpen(false)}>
            Lưu giáo án
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};
