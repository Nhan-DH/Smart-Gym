import React, { useState } from 'react';
import { Order } from '../../../types';
import { formatVND, formatDateTime } from '../../../lib/utils';
import { Badge } from '../../../components/common/Badge';
import { Button } from '../../../components/common/Button';
import { Check, X, CreditCard, Banknote } from 'lucide-react';
import { orderService } from '../../../mocks/services';

interface PendingOrdersCardProps {
  orders: Order[];
  onOrderUpdated: () => void;
}

export const PendingOrdersCard: React.FC<PendingOrdersCardProps> = ({ orders, onOrderUpdated }) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const pendingOrders = orders.filter((o) => o.status === 'PENDING');

  const handleConfirm = async (orderId: string) => {
    setLoadingId(orderId);
    try {
      await orderService.confirmOrder(orderId);
      onOrderUpdated();
    } finally {
      setLoadingId(null);
    }
  };

  const handleReject = async (orderId: string) => {
    setLoadingId(orderId);
    try {
      await orderService.rejectOrder(orderId, 'Thông tin thanh toán không hợp lệ');
      onOrderUpdated();
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-3">
      {pendingOrders.length === 0 ? (
        <div className="py-8 text-center text-xs text-text-secondary">
          Không có đơn hàng nào đang chờ đối soát.
        </div>
      ) : (
        pendingOrders.map((order) => (
          <div
            key={order.id}
            className="p-3.5 rounded-md border border-border bg-surface-subtle hover:bg-surface-hover/60 transition-colors space-y-2.5"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-text-primary">{order.id}</span>
                  <Badge variant="warning">Chờ đối soát</Badge>
                </div>
                <div className="text-sm font-semibold text-text-primary mt-1">{order.memberName}</div>
                <div className="text-xs text-text-secondary">{order.planName}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-primary">{formatVND(order.amountVnd)}</div>
                <div className="inline-flex items-center gap-1 text-[11px] text-text-secondary mt-0.5">
                  {order.method === 'TRANSFER' ? (
                    <>
                      <CreditCard className="w-3 h-3" />
                      <span>Chuyển khoản</span>
                    </>
                  ) : (
                    <>
                      <Banknote className="w-3 h-3" />
                      <span>Tiền mặt</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="text-[11px] text-text-muted">Tạo lúc: {formatDateTime(order.createdAt)}</div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1 border-t border-border/60">
              <Button
                variant="primary"
                size="sm"
                className="flex-1 text-xs font-semibold"
                isLoading={loadingId === order.id}
                onClick={() => handleConfirm(order.id)}
                icon={<Check className="w-3.5 h-3.5" />}
              >
                Xác nhận (Cấp thẻ)
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="text-xs text-status-danger hover:bg-rose-50 hover:border-rose-200"
                disabled={loadingId === order.id}
                onClick={() => handleReject(order.id)}
                icon={<X className="w-3.5 h-3.5" />}
              >
                Từ chối
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
