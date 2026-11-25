import React from 'react';
import { Dialog, DialogContent } from '../../../components/common/Dialog';
import { Button } from '../../../components/common/Button';
import { DetailedMember } from '../../../mocks/mockData';
import { Badge } from '../../../components/common/Badge';
import { formatDate, formatDateTime } from '../../../lib/utils';
import { ShieldCheck, ShieldAlert, Trash2 } from 'lucide-react';

interface MemberDetailModalProps {
  member: DetailedMember | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MemberDetailModal: React.FC<MemberDetailModalProps> = ({ member, isOpen, onClose }) => {
  if (!member) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent title={`Hồ Sơ Hội Viên: ${member.name}`} description={`Mã định danh: ${member.id}`}>
        <div className="space-y-4 pt-2 text-xs">
          {/* Section 1: Personal & Account */}
          <div className="p-3 rounded-md bg-surface-subtle border border-border space-y-2">
            <div className="font-semibold text-text-primary text-sm flex items-center justify-between">
              <span>Thông tin tài khoản</span>
              <Badge variant={member.status === 'ACTIVE' ? 'success' : 'danger'}>
                {member.status === 'ACTIVE' ? 'Đang hoạt động' : 'Đã khóa'}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 text-text-secondary pt-1">
              <div>
                <span className="text-text-muted">Email:</span>{' '}
                <span className="font-medium text-text-primary">{member.email}</span>
              </div>
              <div>
                <span className="text-text-muted">Số điện thoại:</span>{' '}
                <span className="font-medium text-text-primary">{member.phone}</span>
              </div>
              <div>
                <span className="text-text-muted">Ngày tham gia:</span>{' '}
                <span className="font-medium text-text-primary">{formatDate(member.joinedAt)}</span>
              </div>
              <div>
                <span className="text-text-muted">Vai trò:</span>{' '}
                <span className="font-medium text-text-primary">Hội viên (Member)</span>
              </div>
            </div>
          </div>

          {/* Section 2: Membership Package */}
          <div className="p-3 rounded-md bg-surface-subtle border border-border space-y-2">
            <div className="font-semibold text-text-primary text-sm">Gói tập hiện tại</div>
            {member.membership ? (
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-primary">{member.membership.planName}</span>
                  <Badge variant={member.membership.status === 'ACTIVE' ? 'success' : 'neutral'}>
                    {member.membership.status}
                  </Badge>
                </div>
                <div className="text-text-secondary">
                  Thời hạn:{' '}
                  <span className="text-text-primary font-medium">
                    {formatDate(member.membership.startsAt)} → {formatDate(member.membership.endsAt)}
                  </span>
                </div>
                <div className="text-text-secondary">
                  Số buổi PT:{' '}
                  <strong className="text-primary font-semibold">
                    {member.membership.totalPt - member.membership.usedPt - member.membership.reservedPt} khả dụng
                  </strong>{' '}
                  (Tổng: {member.membership.totalPt} | Đã tập: {member.membership.usedPt} | Đang giữ:{' '}
                  {member.membership.reservedPt})
                </div>
              </div>
            ) : (
              <div className="text-text-muted">Chưa đăng ký gói tập nào.</div>
            )}
          </div>

          {/* Section 3: Face Biometrics */}
          <div className="p-3 rounded-md bg-surface-subtle border border-border space-y-2">
            <div className="font-semibold text-text-primary text-sm flex items-center justify-between">
              <span>Dữ liệu sinh trắc học khuôn mặt</span>
              {member.faceRegistered ? (
                <div className="inline-flex items-center gap-1 text-status-success font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Đã đăng ký ({member.faceSampleCount || 3} mẫu)</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1 text-text-muted">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Chưa đăng ký</span>
                </div>
              )}
            </div>
            {member.faceRegistered && (
              <div className="space-y-1 text-text-secondary pt-1">
                <div>Model version: Facenet-512 v1.2</div>
                <div>Đồng thuận lúc: {member.consentAt ? formatDateTime(member.consentAt) : 'N/A'}</div>
                <div className="text-[11px] text-text-muted italic">
                  Không lưu ảnh thô. Chỉ lưu vector 512 chiều được mã hóa.
                </div>
                <div className="pt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="text-status-danger hover:bg-rose-50 hover:border-rose-200"
                    icon={<Trash2 className="w-3.5 h-3.5" />}
                    onClick={() => alert('Xóa khuôn mặt theo yêu cầu của hội viên (Quyền được lãng quên).')}
                  >
                    Xóa dữ liệu khuôn mặt
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="secondary" onClick={onClose}>
              Đóng
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
