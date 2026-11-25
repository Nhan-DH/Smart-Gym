import React, { useState } from 'react';
import { Dialog, DialogContent } from '../../../components/common/Dialog';
import { Button } from '../../../components/common/Button';
import { DetailedMember } from '../../../mocks/mockData';
import { memberService } from '../../../mocks/services';
import { AlertTriangle, Lock, Unlock } from 'lucide-react';

interface LockMemberDialogProps {
  member: DetailedMember | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export const LockMemberDialog: React.FC<LockMemberDialogProps> = ({
  member,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!member) return null;

  const isLocking = member.status === 'ACTIVE';

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const result = await memberService.toggleMemberStatus(member.id, reason);
      onSuccess(result.message);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        title={isLocking ? `Khóa Tài Khoản: ${member.name}` : `Mở Khóa Tài Khoản: ${member.name}`}
      >
        <div className="space-y-4 pt-1">
          <div
            className={`p-3 rounded-md flex items-start gap-2.5 text-xs ${
              isLocking
                ? 'bg-status-danger-bg text-status-danger border border-rose-200'
                : 'bg-primary-light text-primary border border-primary-border'
            }`}
          >
            {isLocking ? (
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            ) : (
              <Unlock className="w-4 h-4 shrink-0 mt-0.5" />
            )}
            <div>
              {isLocking ? (
                <>
                  Khóa tài khoản sẽ <strong>ngay lập tức thu hồi phiên đăng nhập</strong> của hội
                  viên. Hội viên không thể đăng nhập app hay check-in vào phòng tập.
                </>
              ) : (
                <>Hội viên sẽ được khôi phục quyền truy cập vào hệ thống và phòng tập.</>
              )}
            </div>
          </div>

          {isLocking && (
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-text-primary">
                Lý do khóa tài khoản (Ghi vào nhật ký audit) *
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Nhập lý do khóa tài khoản..."
                className="w-full h-20 rounded-md bg-surface border border-border p-2.5 text-sm text-text-primary focus:outline-none focus:border-primary placeholder:text-text-muted"
                required
              />
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border mt-4">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
              Hủy bỏ
            </Button>
            <Button
              type="button"
              variant={isLocking ? 'danger' : 'primary'}
              isLoading={isLoading}
              onClick={handleConfirm}
              icon={isLocking ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            >
              {isLocking ? 'Xác nhận khóa tài khoản' : 'Xác nhận mở khóa'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
