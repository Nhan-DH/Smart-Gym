import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Dialog, DialogHeader, DialogBody, DialogFooter } from '../../components/common/Dialog';
import { memberService } from '../../mocks/services';
import { DetailedMember } from '../../types';
import {
  User,
  ShieldCheck,
  ShieldAlert,
  Trash2,
  Lock,
  ScanFace,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  AlertTriangle,
} from 'lucide-react';

export const MemberProfilePage: React.FC = () => {
  const [member, setMember] = useState<DetailedMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const loadMember = async () => {
    try {
      setLoading(true);
      const res = await memberService.getMemberById('MB-1001');
      setMember(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMember();
  }, []);

  const handleDeleteFace = async () => {
    if (!member) return;
    try {
      await memberService.deleteFaceTemplate(member.id);
      setIsDeleteModalOpen(false);
      setDeleteSuccess(true);
      loadMember();
      setTimeout(() => setDeleteSuccess(false), 4000);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  if (loading || !member) {
    return <div className="py-12 text-center text-text-secondary text-sm">Đang tải hồ sơ...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-black text-text-primary tracking-tight flex items-center gap-2">
          <User className="w-6 h-6 text-darksidebar-bg" />
          Hồ Sơ Cá Nhân & Quản Lý Sinh Trắc Học
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Quản lý thông tin tài khoản hội viên và thực thi quyền riêng tư xóa dữ liệu khuôn mặt (GDPR)
        </p>
      </div>

      {deleteSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-md text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          Đã xóa vĩnh viễn vector dữ liệu khuôn mặt theo yêu cầu của bạn! Cổng Kiosk sẽ chuyển sang xác thực bằng Dynamic QR Code.
        </div>
      )}

      {/* Basic Info Card */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-slate-900 text-volt font-black text-xl flex items-center justify-center border border-slate-700">
              {member.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-black text-text-primary">{member.name}</h2>
              <div className="text-xs text-text-secondary font-mono">Mã hội viên: {member.id}</div>
            </div>
          </div>
          <Badge variant={member.status === 'ACTIVE' ? 'success' : 'danger'}>
            {member.status === 'ACTIVE' ? 'Tài khoản Hoạt động' : 'Đang bị khóa'}
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <span className="text-text-secondary block">Số điện thoại:</span>
            <div className="font-semibold text-text-primary flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" /> {member.phone}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-text-secondary block">Email liên hệ:</span>
            <div className="font-semibold text-text-primary flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" /> {member.email}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-text-secondary block">Ngày tham gia:</span>
            <div className="font-semibold text-text-primary font-mono">{member.joinedAt}</div>
          </div>
          <div className="space-y-1">
            <span className="text-text-secondary block">Gói tập kích hoạt:</span>
            <div className="font-semibold text-volt-dark font-bold">
              {member.membership?.planName || 'Chưa đăng ký'}
            </div>
          </div>
        </div>
      </Card>

      {/* Biometrics & GDPR Privacy Section */}
      <Card className="p-6 space-y-4 border-slate-300">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <ScanFace className="w-5 h-5 text-darksidebar-bg" />
            <h2 className="text-base font-bold text-text-primary">
              Bảo mật Sinh trắc học & Quyền riêng tư (Biometrics & Privacy)
            </h2>
          </div>
          <Badge variant={member.faceRegistered ? 'success' : 'neutral'}>
            {member.faceRegistered ? 'Đã đăng ký' : 'Chưa đăng ký'}
          </Badge>
        </div>

        <div className="space-y-3 text-xs leading-relaxed text-text-secondary">
          <p>
            SmartGym tuân thủ nghiêm ngặt nguyên tắc bảo mật sinh trắc học theo quy chuẩn thiết kế đồ án:{' '}
            <strong>Hệ thống không bao giờ lưu trữ ảnh thô của hội viên</strong>. Toàn bộ hình ảnh khuôn mặt được chuyển đổi thành vector đặc trưng toán học (Embeddings) và lưu trữ cục bộ.
          </p>

          <div className="p-3 bg-slate-50 border border-border rounded-md grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <span className="text-slate-500 block">Thời gian đồng thuận (Consent at):</span>
              <strong className="text-text-primary font-mono">
                {member.consentAt ? new Date(member.consentAt).toLocaleString('vi-VN') : 'Chưa cấp quyền'}
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block">Số mẫu vector đã nạp:</span>
              <strong className="text-text-primary">{member.faceSampleCount || 0} mẫu</strong>
            </div>
          </div>
        </div>

        {member.faceRegistered && (
          <div className="pt-3 border-t border-border flex items-center justify-between">
            <div className="text-xs text-text-secondary">
              Bạn có quyền thu hồi sự đồng thuận và yêu cầu hệ thống xóa vĩnh viễn vector khuôn mặt bất cứ lúc nào (GDPR Right to be Forgotten).
            </div>
            <Button
              variant="danger"
              size="sm"
              icon={<Trash2 className="w-4 h-4" />}
              onClick={() => setIsDeleteModalOpen(true)}
            >
              Xóa dữ liệu khuôn mặt
            </Button>
          </div>
        )}
      </Card>

      {/* Delete Face Template Dialog */}
      <Dialog isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <DialogHeader
          title="Xác nhận Xóa Dữ liệu Sinh trắc học"
          description="Hành động này sẽ xóa vĩnh viễn vector khuôn mặt khỏi cơ sở dữ liệu SmartGym"
        />
        <DialogBody className="space-y-3 text-xs">
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-red-600" /> Hệ quả sau khi xóa:
            </div>
            <ul className="list-disc pl-5 space-y-1 text-[11px]">
              <li>Vector khuôn mặt và lịch sử đồng thuận `consent_at` sẽ bị xóa hoàn toàn.</li>
              <li>Bạn sẽ không thể mở cửa sảnh Kiosk bằng nhận diện khuôn mặt tự động.</li>
              <li>Bạn cần sử dụng <strong>Mã Dynamic QR Code</strong> trên điện thoại để check-in/out.</li>
            </ul>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
            Hủy bỏ
          </Button>
          <Button variant="danger" onClick={handleDeleteFace}>
            Đồng ý xóa dữ liệu ngay
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};
