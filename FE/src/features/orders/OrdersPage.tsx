import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Dialog, DialogHeader, DialogBody, DialogFooter } from '../../components/common/Dialog';
import { orderService } from '../../mocks/services';
import { Order } from '../../types';
import { CreditCard, CheckCircle2, XCircle, Search, Clock, DollarSign, Eye, AlertCircle } from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Reject Modal State
  const [rejectModalOrder, setRejectModalOrder] = useState<Order | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Chưa nhận được giao dịch tiền chuyển khoản');

  // Detail Modal State
  const [detailModalOrder, setDetailModalOrder] = useState<Order | null>(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await orderService.getOrders();
      setOrders(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleConfirm = async (orderId: string) => {
    try {
      await orderService.confirmOrder(orderId);
      loadOrders();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalOrder) return;
    try {
      await orderService.rejectOrder(rejectModalOrder.id, rejectionReason);
      setRejectModalOrder(null);
      loadOrders();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (filterStatus !== 'ALL' && o.status !== filterStatus) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        o.id.toLowerCase().includes(q) ||
        o.memberName.toLowerCase().includes(q) ||
        o.planName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingCount = orders.filter((o) => o.status === 'PENDING').length;
  const totalRevenue = orders
    .filter((o) => o.status === 'CONFIRMED')
    .reduce((sum, o) => sum + o.amountVnd, 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-text-primary tracking-tight flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-darksidebar-bg" />
            Đơn hàng & Đối soát Thanh toán
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Xác nhận thanh toán tiền mặt/chuyển khoản và tự động kích hoạt gói tập cho hội viên
          </p>
        </div>

        {/* Quick KPI stats */}
        <div className="flex items-center gap-3">
          <div className="bg-surface border border-border px-3.5 py-2 rounded-md shadow-sm">
            <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider block">
              Chờ xác nhận
            </span>
            <span className="text-lg font-black text-amber-600">{pendingCount} đơn</span>
          </div>
          <div className="bg-slate-900 border border-slate-700 px-3.5 py-2 rounded-md shadow-sm">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Tổng thực thu
            </span>
            <span className="text-lg font-black text-volt">
              {totalRevenue.toLocaleString('vi-VN')} đ
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            {[
              { label: 'Tất cả đơn', value: 'ALL' },
              { label: `Chờ duyệt (${pendingCount})`, value: 'PENDING' },
              { label: 'Đã xác nhận', value: 'CONFIRMED' },
              { label: 'Đã từ chối', value: 'REJECTED' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilterStatus(tab.value)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
                  filterStatus === tab.value
                    ? 'bg-slate-900 text-volt'
                    : 'bg-surface text-text-secondary hover:text-text-primary border border-border'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-text-muted" />
            <input
              type="text"
              placeholder="Tìm mã đơn, tên hội viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-md bg-surface border border-border text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-volt-dark"
            />
          </div>
        </div>
      </Card>

      {/* Orders Data Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-border text-text-secondary font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3">Mã đơn & Thời gian</th>
                <th className="px-5 py-3">Hội viên</th>
                <th className="px-5 py-3">Gói đăng ký</th>
                <th className="px-5 py-3">Số tiền</th>
                <th className="px-5 py-3">Hình thức</th>
                <th className="px-5 py-3">Trạng thái</th>
                <th className="px-5 py-3 text-right">Thao tác duyệt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-text-secondary">
                    Đang tải danh sách đơn hàng...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-text-secondary">
                    Không tìm thấy đơn hàng nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-text-primary font-mono">{order.id}</div>
                        <div className="text-[11px] text-text-secondary flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {new Date(order.createdAt).toLocaleString('vi-VN')}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-text-primary">{order.memberName}</div>
                        <div className="text-[11px] text-text-secondary">{order.memberEmail}</div>
                      </td>
                      <td className="px-5 py-3.5 font-medium text-text-primary">{order.planName}</td>
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-text-primary">
                          {order.amountVnd.toLocaleString('vi-VN')}{' '}
                          <span className="text-[10px] text-text-secondary">VND</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          {order.method === 'TRANSFER' ? 'Chuyển khoản NH' : 'Tiền mặt tại sảnh'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {order.status === 'PENDING' && (
                          <Badge variant="warning">Chờ đối soát</Badge>
                        )}
                        {order.status === 'CONFIRMED' && (
                          <Badge variant="success">Đã kích hoạt</Badge>
                        )}
                        {order.status === 'REJECTED' && (
                          <Badge variant="danger">Bị từ chối</Badge>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Xem chi tiết"
                            onClick={() => setDetailModalOrder(order)}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>

                          {order.status === 'PENDING' && (
                            <>
                              <Button
                                variant="volt"
                                size="sm"
                                onClick={() => handleConfirm(order.id)}
                                icon={<CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />}
                              >
                                Xác nhận thu tiền
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => setRejectModalOrder(order)}
                                icon={<XCircle className="w-3.5 h-3.5" />}
                              >
                                Từ chối
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Reject Order Dialog */}
      <Dialog isOpen={!!rejectModalOrder} onClose={() => setRejectModalOrder(null)}>
        <form onSubmit={handleReject}>
          <DialogHeader
            title="Từ chối Đơn hàng"
            description={`Đơn hàng ${rejectModalOrder?.id} của hội viên ${rejectModalOrder?.memberName} sẽ bị hủy.`}
          />
          <DialogBody className="space-y-3">
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>
                Hệ thống sẽ không kích hoạt gói tập cho hội viên này. Bạn cần nêu rõ lý do đối soát.
              </span>
            </div>
            <div>
              <label className="text-xs font-bold text-text-primary block mb-1">Lý do từ chối *</label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                className="w-full p-2.5 rounded-md bg-surface border border-border text-xs text-text-primary focus:outline-none focus:border-red-500"
                required
              />
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="secondary" type="button" onClick={() => setRejectModalOrder(null)}>
              Hủy
            </Button>
            <Button variant="danger" type="submit">
              Xác nhận từ chối đơn
            </Button>
          </DialogFooter>
        </form>
      </Dialog>

      {/* Order Detail Modal */}
      <Dialog isOpen={!!detailModalOrder} onClose={() => setDetailModalOrder(null)}>
        <DialogHeader
          title={`Chi tiết Đơn hàng: ${detailModalOrder?.id}`}
          description="Thông tin giao dịch và chứng từ thanh toán"
        />
        <DialogBody className="space-y-4 text-xs">
          {detailModalOrder && (
            <>
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-md border border-border">
                <div>
                  <span className="text-text-secondary block">Hội viên:</span>
                  <strong className="text-text-primary text-sm">{detailModalOrder.memberName}</strong>
                  <div className="text-[11px] text-text-secondary">{detailModalOrder.memberEmail}</div>
                </div>
                <div>
                  <span className="text-text-secondary block">Gói đăng ký:</span>
                  <strong className="text-text-primary text-sm">{detailModalOrder.planName}</strong>
                </div>
                <div>
                  <span className="text-text-secondary block">Số tiền:</span>
                  <strong className="text-volt-dark font-black text-base">
                    {detailModalOrder.amountVnd.toLocaleString('vi-VN')} VND
                  </strong>
                </div>
                <div>
                  <span className="text-text-secondary block">Hình thức thanh toán:</span>
                  <strong className="text-text-primary">
                    {detailModalOrder.method === 'TRANSFER' ? 'Chuyển khoản VietQR' : 'Tiền mặt quầy'}
                  </strong>
                </div>
              </div>

              {detailModalOrder.confirmedBy && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md text-emerald-800">
                  <div className="font-bold">Đã được phê duyệt bởi: {detailModalOrder.confirmedBy}</div>
                  <div className="text-[11px]">
                    Thời gian:{' '}
                    {detailModalOrder.confirmedAt
                      ? new Date(detailModalOrder.confirmedAt).toLocaleString('vi-VN')
                      : 'N/A'}
                  </div>
                </div>
              )}

              {detailModalOrder.rejectionReason && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-800">
                  <div className="font-bold">Lý do từ chối:</div>
                  <div>{detailModalOrder.rejectionReason}</div>
                </div>
              )}
            </>
          )}
        </DialogBody>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setDetailModalOrder(null)}>
            Đóng
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};
