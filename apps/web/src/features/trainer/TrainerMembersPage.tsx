import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { memberService } from '../../mocks/services';
import { DetailedMember } from '../../types';
import { Users, Dumbbell, Clock, Phone, Mail, Award, CheckCircle2 } from 'lucide-react';

export const TrainerMembersPage: React.FC = () => {
  const [members, setMembers] = useState<DetailedMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await memberService.getMembers();
        // filter members with active membership
        setMembers(res.filter((m) => m.membership && m.membership.totalPt > 0));
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
          <Users className="w-6 h-6 text-darksidebar-bg" />
          Danh Sách Học Viên Phụ Trách
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Theo dõi tiến độ tập luyện, số buổi PT còn lại và thông tin liên hệ của từng học viên
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-text-secondary text-sm">Đang tải danh sách học viên...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {members.map((m) => {
            const ms = m.membership!;
            const available = Math.max(0, ms.totalPt - ms.usedPt - ms.reservedPt);
            return (
              <Card key={m.id} className="p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-900 text-volt font-black flex items-center justify-center text-sm">
                        {m.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-text-primary">{m.name}</h3>
                        <div className="text-[10px] text-text-muted font-mono">{m.id}</div>
                      </div>
                    </div>
                    <Badge variant={m.status === 'ACTIVE' ? 'success' : 'danger'}>
                      {m.status === 'ACTIVE' ? 'Hoạt động' : 'Khóa'}
                    </Badge>
                  </div>

                  <div className="text-xs text-text-secondary space-y-1 py-2 border-y border-border">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> {m.phone}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" /> {m.email}
                    </div>
                  </div>

                  {/* PT Sessions Breakdown */}
                  <div className="my-3 p-3 bg-slate-50 rounded-md border border-border space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-text-secondary">Gói tập:</span>
                      <strong className="text-text-primary">{ms.planName}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-text-secondary">Số buổi còn lại:</span>
                      <strong className="text-volt-dark font-black text-sm">{available} buổi</strong>
                    </div>
                    <div className="text-[10px] text-text-muted flex justify-between">
                      <span>Đã tập: {ms.usedPt}</span>
                      <span>Đang giữ chỗ: {ms.reservedPt}</span>
                      <span>Tổng: {ms.totalPt}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Chuyên cần: 92% • Tăng cơ ổn định
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
