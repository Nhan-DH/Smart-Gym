import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Dialog, DialogHeader, DialogBody, DialogFooter } from '../../components/common/Dialog';
import { planService, orderService } from '../../mocks/services';
import { Plan, Order } from '../../types';
import {
  Package,
  Check,
  ShieldCheck,
  CreditCard,
  QrCode,
  DollarSign,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export const MemberPlansPage: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  // Order creation modal
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'TRANSFER' | 'CASH'>('TRANSFER');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await planService.getPlans();
        setPlans(res.filter((p) => p.status === 'ACTIVE'));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleCreateOrder = async () => {
    if (!selectedPlan) return;
    try {
      setIsSubmitting(true);
      const newOrder = await orderService.createOrder('MB-1001', selectedPlan.id, paymentMethod);
      setCreatedOrder(newOrder);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-black text-text-primary tracking-tight flex items-center gap-2">
          <Package className="w-6 h-6 text-darksidebar-bg" />
          Gói Tập & Đăng Ký Hội Viên
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Lựa chọn gói tập phù hợp với mục tiêu thể hình của bạn. Hỗ trợ thanh toán Chuyển khoản VietQR hoặc Tiền mặt tại sảnh.
        </p>
      </div>

      {/* Plans Grid */}
      {loading ? (
        <div className="py-12 text-center text-text-secondary text-sm">Đang tải danh sách gói tập...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            return (
              <Card
                key={plan.id}
                className={`flex flex-col justify-between p-6 transition-all ${
                  plan.highlight
                    ? 'border-volt-border ring-2 ring-volt/40 shadow-volt'
                    : 'border-border bg-surface'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider font-mono">
                      {plan.tier ? plan.tier.replace('TIER_', '') : 'STANDARD'}
                    </span>
                    {plan.highlight && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-slate-900 text-volt uppercase">
                        Khuyên dùng
                      </span>
                    )}
                  </div>

                  <h3 className="font-black text-lg text-text-primary">{plan.name}</h3>
                  <p className="text-xs text-text-secondary mt-1">{plan.description}</p>

                  {/* Price */}
                  <div className="my-5 p-3 rounded-md bg-slate-50 border border-border">
                    <div className="text-2xl font-black text-text-primary tracking-tight">
                      {plan.priceVnd.toLocaleString('vi-VN')}{' '}
                      <span className="text-xs font-bold text-text-secondary uppercase">VND</span>
                    </div>
                    <div className="text-[11px] text-text-secondary mt-0.5 font-medium">
                      Thời hạn: <strong className="text-text-primary">{plan.durationDays} ngày</strong> (
                      {Math.round(plan.durationDays / 30)} tháng)
                    </div>
                  </div>

                  {/* Privileges */}
                  <div className="space-y-2.5 text-xs mb-6">
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
                        <strong>
                          {plan.ptSessions > 0 ? `${plan.ptSessions} buổi (60p/buổi)` : 'Tự tập luyện'}
                        </strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-text-secondary text-[11px]">
                      <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                      <span>Được bảo lưu & hoàn lượt tập trước 12h</span>
                    </div>
                  </div>
                </div>

                <Button
                  variant={plan.highlight ? 'volt' : 'secondary'}
                  size="md"
                  className="w-full"
                  onClick={() => {
                    setSelectedPlan(plan);
                    setCreatedOrder(null);
                  }}
                >
                  Đăng ký ngay
                </Button>
              </Card>
            );
          })}
        </div>
      )}

      {/* Payment / Order Modal */}
      <Dialog isOpen={!!selectedPlan} onClose={() => setSelectedPlan(null)}>
        <DialogHeader
          title={createdOrder ? 'Đơn hàng đã được khởi tạo!' : `Đăng ký Gói: ${selectedPlan?.name}`}
          description={
            createdOrder
              ? `Mã đơn hàng: ${createdOrder.id}. Vui lòng hoàn tất thanh toán.`
              : 'Chọn hình thức thanh toán thuận tiện nhất cho bạn'
          }
        />
        <DialogBody className="space-y-4 text-xs">
          {createdOrder ? (
            <div className="space-y-4 text-center">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-900 text-left space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" /> Trạng thái đơn hàng: CHỜ ĐỐI SOÁT (PENDING)
                </div>
                <div className="text-[11px] leading-relaxed">
                  Quản lý phòng gym sẽ kiểm tra đối soát giao dịch và kích hoạt gói tập tự động vào tài khoản của bạn.
                </div>
              </div>

              {createdOrder.method === 'TRANSFER' ? (
                <div className="p-4 bg-slate-900 rounded-lg text-white space-y-3">
                  <div className="text-xs text-slate-300">Quét mã VietQR chuyển khoản nhanh:</div>
                  <div className="w-40 h-40 bg-white p-2 rounded-md mx-auto flex items-center justify-center">
                    <QrCode className="w-32 h-32 text-slate-950" />
                  </div>
                  <div className="space-y-1 text-xs">
                    <div>
                      Ngân hàng: <strong>MB BANK</strong> • STK: <strong>99998888SMARTGYM</strong>
                    </div>
                    <div>
                      Số tiền:{' '}
                      <strong className="text-volt font-black text-sm">
                        {createdOrder.amountVnd.toLocaleString('vi-VN')} đ
                      </strong>
                    </div>
                    <div>
                      Nội dung CK: <strong className="font-mono text-volt">{createdOrder.id}</strong>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 border border-border rounded-md text-left space-y-2">
                  <div className="font-bold text-text-primary">Thanh toán Tiền mặt tại Quầy Lễ Tân:</div>
                  <div className="text-text-secondary text-xs">
                    Vui lòng đến quầy lễ tân chi nhánh SmartGym và đọc mã đơn{' '}
                    <strong className="font-mono text-text-primary">{createdOrder.id}</strong> để nhân viên xác nhận thu tiền.
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 border border-border rounded-md">
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Gói chọn:</span>
                  <strong className="text-text-primary">{selectedPlan?.name}</strong>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-text-secondary">Tổng số tiền:</span>
                  <strong className="text-volt-dark font-black text-base">
                    {selectedPlan?.priceVnd.toLocaleString('vi-VN')} VND
                  </strong>
                </div>
              </div>

              <div>
                <label className="font-bold text-text-primary block mb-2">Phương thức thanh toán:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('TRANSFER')}
                    className={`p-3 rounded-md border text-left transition-all ${
                      paymentMethod === 'TRANSFER'
                        ? 'border-volt bg-slate-900 text-white font-bold'
                        : 'border-border bg-surface text-text-primary hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs">
                      <QrCode className="w-4 h-4 text-volt" /> Chuyển khoản VietQR
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">Xác nhận tự động</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CASH')}
                    className={`p-3 rounded-md border text-left transition-all ${
                      paymentMethod === 'CASH'
                        ? 'border-volt bg-slate-900 text-white font-bold'
                        : 'border-border bg-surface text-text-primary hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs">
                      <DollarSign className="w-4 h-4 text-emerald-500" /> Tiền mặt quầy
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">Thanh toán tại sảnh</div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          {createdOrder ? (
            <Button variant="volt" onClick={() => setSelectedPlan(null)}>
              Đã hiểu & Đóng
            </Button>
          ) : (
            <>
              <Button variant="secondary" onClick={() => setSelectedPlan(null)}>
                Hủy bỏ
              </Button>
              <Button variant="volt" onClick={handleCreateOrder} isLoading={isSubmitting}>
                Tạo đơn đăng ký
              </Button>
            </>
          )}
        </DialogFooter>
      </Dialog>
    </div>
  );
};
