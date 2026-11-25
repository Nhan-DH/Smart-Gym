import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Dialog, DialogHeader, DialogBody, DialogFooter } from '../../components/common/Dialog';
import { Input } from '../../components/common/Input';
import { planService } from '../../mocks/services';
import { Plan } from '../../types';
import { Package, Plus, Check, Power, Dumbbell, UserCheck, ShieldCheck, Tag } from 'lucide-react';

export const PlansPage: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form State for new plan
  const [formData, setFormData] = useState({
    name: '',
    tier: 'TIER_GYM_ONLY' as Plan['tier'],
    priceVnd: 500000,
    durationDays: 30,
    ptSessions: 0,
    gymAccess: true,
    description: '',
    highlight: false,
  });

  const loadPlans = async () => {
    try {
      setLoading(true);
      const res = await planService.getPlans();
      setPlans(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const handleToggleStatus = async (id: string) => {
    try {
      await planService.togglePlanStatus(id);
      loadPlans();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await planService.createPlan({
        ...formData,
        status: 'ACTIVE',
      });
      setIsAddOpen(false);
      loadPlans();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const filteredPlans = plans.filter((p) => {
    if (filterType === 'ALL') return true;
    return p.tier === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-text-primary tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-darksidebar-bg" />
            Quản lý Gói tập (Membership Plans)
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Thiết lập danh mục gói tập, snapshot đơn giá và quyền lợi đi kèm cho hội viên
          </p>
        </div>
        <Button
          variant="volt"
          icon={<Plus className="w-4 h-4 stroke-[2.5]" />}
          onClick={() => setIsAddOpen(true)}
        >
          Tạo gói tập mới
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3 overflow-x-auto">
        {[
          { label: 'Tất cả gói', value: 'ALL' },
          { label: 'Chỉ Gym (Gym Only)', value: 'TIER_GYM_ONLY' },
          { label: 'Kèm Huấn luyện viên (PT)', value: 'TIER_PT' },
          { label: 'Gói Combo Toàn diện', value: 'TIER_COMBO' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilterType(tab.value)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
              filterType === tab.value
                ? 'bg-slate-900 text-volt'
                : 'bg-surface text-text-secondary hover:text-text-primary border border-border'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Plans Grid */}
      {loading ? (
        <div className="py-12 text-center text-text-secondary text-sm">Đang tải danh mục gói tập...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPlans.map((plan) => {
            const isDiscontinued = plan.status === 'DISCONTINUED';
            return (
              <Card
                key={plan.id}
                className={`relative flex flex-col justify-between transition-all h-full p-5 ${
                  plan.highlight ? 'border-volt-border ring-1 ring-volt/40' : ''
                } ${isDiscontinued ? 'opacity-65 bg-slate-50' : 'bg-surface'}`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-slate-900 text-volt text-[10px] font-bold uppercase tracking-wider border border-slate-700 flex items-center gap-1">
                    <Tag className="w-3 h-3" /> Phổ biến nhất
                  </div>
                )}

                <div className="flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-3 mb-2 min-h-[48px]">
                    <div>
                      <h3 className="font-bold text-base text-text-primary">{plan.name}</h3>
                      <div className="text-xs text-text-secondary mt-0.5 line-clamp-1">{plan.description}</div>
                    </div>
                    <Badge variant={isDiscontinued ? 'neutral' : 'success'}>
                      {isDiscontinued ? 'Ngưng bán' : 'Đang mở'}
                    </Badge>
                  </div>

                  {/* Price */}
                  <div className="my-3 py-3 px-3.5 rounded-md bg-slate-50 border border-border/80">
                    <div className="text-[11px] text-text-secondary font-medium">Giá niêm yết</div>
                    <div className="text-2xl font-black text-text-primary tracking-tight">
                      {plan.priceVnd.toLocaleString('vi-VN')}{' '}
                      <span className="text-xs font-bold text-text-secondary uppercase">VND</span>
                    </div>
                    <div className="text-[11px] text-text-secondary mt-1">
                      Thời hạn: <strong className="text-text-primary">{plan.durationDays} ngày</strong> (
                      {Math.round(plan.durationDays / 30)} tháng)
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2 text-xs mb-4 flex-1">
                    <div className="flex items-center gap-2 text-text-primary">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                      <span>
                        Quyền vào phòng: <strong>{plan.gymAccess ? 'Không giới hạn' : 'Không có'}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-text-primary">
                      <div className="w-4 h-4 rounded-full bg-volt/30 text-darksidebar-bg flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                      <span>
                        Số buổi PT 1-1:{' '}
                        <strong className="text-text-primary">
                          {plan.ptSessions > 0 ? `${plan.ptSessions} buổi (60p/buổi)` : 'Tự tập luyện'}
                        </strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-text-secondary text-[11px]">
                      <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                      <span>Bảo lưu và hoàn lượt tập trước 12h</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions - Pinned to exact bottom */}
                <div className="pt-3 border-t border-border flex items-center justify-between gap-3 mt-auto">
                  <span className="text-[10px] text-text-muted font-mono uppercase">ID: {plan.id}</span>
                  <Button
                    variant={isDiscontinued ? 'secondary' : 'ghost'}
                    size="sm"
                    icon={<Power className="w-3.5 h-3.5" />}
                    onClick={() => handleToggleStatus(plan.id)}
                    className={isDiscontinued ? 'text-emerald-600' : 'text-slate-500 hover:text-red-600'}
                  >
                    {isDiscontinued ? 'Mở lại gói' : 'Dừng bán gói'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Plan Dialog */}
      <Dialog isOpen={isAddOpen} onClose={() => setIsAddOpen(false)}>
        <form onSubmit={handleCreatePlan}>
          <DialogHeader
            title="Tạo Gói tập mới"
            description="Khai báo gói tập mới cho cơ sở SmartGym. Các đơn hàng cũ đã phát sinh sẽ giữ nguyên snapshot giá."
          />
          <DialogBody className="space-y-4">
            <div>
              <label className="text-xs font-bold text-text-primary block mb-1">Tên gói tập *</label>
              <Input
                placeholder="VD: Gói Platinum 3 Tháng + 24 Buổi PT"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-text-primary block mb-1">Loại phân hạng *</label>
                <select
                  value={formData.tier}
                  onChange={(e) => setFormData({ ...formData, tier: e.target.value as Plan['tier'] })}
                  className="w-full h-10 px-3 rounded-md bg-surface border border-border text-xs font-medium text-text-primary focus:outline-none focus:border-volt-dark"
                >
                  <option value="TIER_GYM_ONLY">Chỉ Gym (Gym Only)</option>
                  <option value="TIER_PT">Kèm PT (Personal Trainer)</option>
                  <option value="TIER_COMBO">Combo (Gym + PT)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-text-primary block mb-1">Giá bán (VND) *</label>
                <Input
                  type="number"
                  step={50000}
                  value={formData.priceVnd}
                  onChange={(e) => setFormData({ ...formData, priceVnd: Number(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-text-primary block mb-1">Thời hạn (Ngày) *</label>
                <Input
                  type="number"
                  value={formData.durationDays}
                  onChange={(e) => setFormData({ ...formData, durationDays: Number(e.target.value) })}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-text-primary block mb-1">Số buổi PT kèm (60p)</label>
                <Input
                  type="number"
                  value={formData.ptSessions}
                  onChange={(e) => setFormData({ ...formData, ptSessions: Number(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-text-primary block mb-1">Mô tả ngắn</label>
              <Input
                placeholder="VD: Dành cho người muốn tăng cơ giảm mỡ nhanh chóng"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="highlight"
                checked={formData.highlight}
                onChange={(e) => setFormData({ ...formData, highlight: e.target.checked })}
                className="w-4 h-4 rounded border-border accent-volt text-darksidebar-bg"
              />
              <label htmlFor="highlight" className="text-xs font-medium text-text-primary cursor-pointer">
                Đánh dấu là gói nổi bật (Badge Highlight)
              </label>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="secondary" type="button" onClick={() => setIsAddOpen(false)}>
              Hủy bỏ
            </Button>
            <Button variant="volt" type="submit">
              Lưu & Phát hành gói
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
};
