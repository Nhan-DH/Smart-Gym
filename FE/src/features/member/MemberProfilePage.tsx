import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Dialog, DialogHeader, DialogBody, DialogFooter } from '../../components/common/Dialog';
import { memberService, authService } from '../../mocks/services';
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
  KeyRound,
  Target,
  Edit3,
} from 'lucide-react';

export const MemberProfilePage: React.FC = () => {
  const [member, setMember] = useState<DetailedMember | null>(null);
  const [loading, setLoading] = useState(true);

  // Password change state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Edit info dialog
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editGoal, setEditGoal] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  // Delete Face state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const loadMember = async () => {
    try {
      setLoading(true);
      const res = await memberService.getMemberById('MB-1001');
      if (res) {
        setMember(res);
        setEditName(res.name);
        setEditPhone(res.phone);
        setEditGoal(res.goal || 'Giảm cân & Cải thiện thể lực');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMember();
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Vui lòng điền đầy đủ các trường mật khẩu' });
      return;
    }
    if (newPassword.length < 8) {
      setPasswordMsg({ type: 'error', text: 'Mật khẩu mới phải có tối thiểu 8 ký tự' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Mật khẩu xác nhận không khớp' });
      return;
    }

    setPasswordLoading(true);
    setPasswordMsg(null);
    try {
      await authService.changePassword(member?.id || '', oldPassword, newPassword);
      setPasswordMsg({
        type: 'success',
        text: 'Đổi mật khẩu thành công! Mật khẩu mới của bạn đã có hiệu lực trên toàn hệ thống.',
      });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordMsg(null), 5000);
    } catch (err) {
      setPasswordMsg({ type: 'error', text: (err as Error).message });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!member) return;
    setEditLoading(true);
    try {
      await memberService.updateProfile(member.id, {
        name: editName,
        phone: editPhone,
        goal: editGoal,
      });
      setIsEditOpen(false);
      loadMember();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteFace = async () => {
    if (!member) return;
    try {
      await memberService.deleteFaceTemplate(member.id);
      setIsDeleteModalOpen(false);
      setDeleteSuccess(true);
      loadMember();
      setTimeout(() => setDeleteSuccess(false), 5000);
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
          Hồ Sơ Hội Viên & Bảo Mật Tài Khoản
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Quản lý tài khoản được cấp phát, đổi mật khẩu cá nhân và thực thi quyền riêng tư sinh trắc học
        </p>
      </div>

      {deleteSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-md text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          Đã xóa vĩnh viễn vector dữ liệu khuôn mặt theo yêu cầu của bạn! Cổng Kiosk sẽ chuyển sang xác thực bằng Dynamic QR Code.
        </div>
      )}

      {/* Basic Info Card */}
      <Card className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-border gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-slate-900 text-volt font-black text-xl flex items-center justify-center border border-slate-700 shrink-0">
              {member.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-text-primary">{member.name}</h2>
                <Badge variant={member.status === 'ACTIVE' ? 'success' : 'danger'}>
                  {member.status === 'ACTIVE' ? 'Tài khoản Hoạt động' : 'Đang bị khóa'}
                </Badge>
              </div>
              <div className="text-xs text-text-secondary font-mono mt-0.5">Mã hội viên: {member.id}</div>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsEditOpen(true)}
            icon={<Edit3 className="w-3.5 h-3.5" />}
          >
            Chỉnh sửa thông tin
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="space-y-1 p-3 bg-slate-50 rounded-md border border-slate-200">
            <span className="text-text-secondary block">Số điện thoại:</span>
            <div className="font-semibold text-text-primary flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" /> {member.phone}
            </div>
          </div>

          <div className="space-y-1 p-3 bg-slate-50 rounded-md border border-slate-200">
            <span className="text-text-secondary block">Email đăng nhập:</span>
            <div className="font-semibold text-text-primary flex items-center gap-1.5 truncate">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {member.email}
            </div>
          </div>

          <div className="space-y-1 p-3 bg-slate-50 rounded-md border border-slate-200">
            <span className="text-text-secondary block">Mục tiêu rèn luyện:</span>
            <div className="font-semibold text-text-primary flex items-center gap-1.5 truncate">
              <Target className="w-3.5 h-3.5 text-volt-dark shrink-0" /> {member.goal || 'Giữ gìn vóc dáng'}
            </div>
          </div>

          <div className="space-y-1 p-3 bg-slate-50 rounded-md border border-slate-200">
            <span className="text-text-secondary block">Gói tập kích hoạt:</span>
            <div className="font-bold text-volt-dark truncate">
              {member.membership?.planName || 'Chưa đăng ký'}
            </div>
          </div>
        </div>
      </Card>

      {/* Change Password Card */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border">
          <KeyRound className="w-5 h-5 text-darksidebar-bg" />
          <h2 className="text-base font-bold text-text-primary">Đổi Mật Khẩu Cá Nhân</h2>
        </div>

        <p className="text-xs text-text-secondary leading-relaxed">
          Tài khoản ban đầu được Ban quản lý cấp phát với mật khẩu khởi tạo mặc định. Để đảm bảo an toàn tuyệt đối, vui lòng đổi sang mật khẩu riêng của bạn.
        </p>

        {passwordMsg && (
          <div
            className={`p-3 rounded-md text-xs font-semibold flex items-center gap-2 ${
              passwordMsg.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
          >
            {passwordMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{passwordMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-3 max-w-md">
          <Input
            label="Mật khẩu hiện tại *"
            type="password"
            placeholder="••••••••"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Mật khẩu mới *"
              type="password"
              placeholder="Tối thiểu 8 ký tự"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <Input
              label="Xác nhận mật khẩu mới *"
              type="password"
              placeholder="Nhập lại mật khẩu mới"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" variant="volt" isLoading={passwordLoading} className="font-bold">
            Cập nhật mật khẩu mới
          </Button>
        </form>
      </Card>

      {/* Biometrics & GDPR Privacy Section */}
      <Card className="p-6 space-y-4 border-slate-300">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <ScanFace className="w-5 h-5 text-darksidebar-bg" />
            <h2 className="text-base font-bold text-text-primary">
              Bảo mật Sinh trắc học & Quyền riêng tư (Biometrics & GDPR)
            </h2>
          </div>
          <Badge variant={member.faceRegistered ? 'success' : 'neutral'}>
            {member.faceRegistered ? 'Đã nạp mẫu Face ID' : 'Chưa nạp mẫu'}
          </Badge>
        </div>

        <div className="space-y-3 text-xs leading-relaxed text-text-secondary">
          <p>
            SmartGym tuân thủ nghiêm ngặt nguyên tắc bảo mật sinh trắc học theo quy chuẩn thiết kế đồ án:{' '}
            <strong>Hệ thống không bao giờ lưu trữ ảnh thô của hội viên</strong>. Toàn bộ hình ảnh khuôn mặt được chuyển đổi thành vector đặc trưng toán học (Embeddings) và lưu trữ nội bộ.
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
          <div className="pt-3 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-xs text-text-secondary">
              Bạn có quyền thu hồi sự đồng thuận và yêu cầu hệ thống xóa vĩnh viễn vector khuôn mặt bất cứ lúc nào (GDPR Right to be Forgotten).
            </div>
            <Button
              variant="danger"
              size="sm"
              icon={<Trash2 className="w-4 h-4" />}
              onClick={() => setIsDeleteModalOpen(true)}
              className="shrink-0"
            >
              Xóa dữ liệu khuôn mặt
            </Button>
          </div>
        )}
      </Card>

      {/* Edit Profile Dialog */}
      <Dialog isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
        <DialogHeader
          title="Chỉnh Sửa Thông Tin Cá Nhân"
          description="Cập nhật thông tin liên hệ và mục tiêu tập luyện của bạn"
        />
        <form onSubmit={handleUpdateProfile}>
          <DialogBody className="space-y-3 text-xs">
            <Input
              label="Họ và tên *"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              required
            />
            <Input
              label="Số điện thoại *"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
              required
            />
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-text-primary">Mục tiêu rèn luyện</label>
              <select
                value={editGoal}
                onChange={(e) => setEditGoal(e.target.value)}
                className="w-full h-10 px-3 rounded-md bg-surface border border-border text-xs text-text-primary font-medium focus:outline-none focus:border-primary"
              >
                <option value="Giảm cân & Đốt mỡ thừa">Giảm cân & Đốt mỡ thừa</option>
                <option value="Tăng cơ bắp & Thể hình">Tăng cơ bắp & Thể hình</option>
                <option value="Rèn luyện sức bền tim mạch">Rèn luyện sức bền tim mạch</option>
                <option value="Phục hồi thể lực & Giữ gìn vóc dáng">Phục hồi thể lực & Giữ gìn vóc dáng</option>
                <option value="Cải thiện sức khỏe tổng quát">Cải thiện sức khỏe tổng quát</option>
              </select>
            </div>
            <div className="p-2.5 bg-slate-50 rounded text-slate-500 text-[11px]">
              * Email đăng nhập (`{member.email}`) là mã định danh gốc do Ban quản lý cấp phát, không thể tự chỉnh sửa.
            </div>
          </DialogBody>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsEditOpen(false)}>
              Hủy bỏ
            </Button>
            <Button type="submit" variant="primary" isLoading={editLoading}>
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </form>
      </Dialog>

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
