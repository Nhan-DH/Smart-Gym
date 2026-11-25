import React, { useState } from 'react';
import { Dialog, DialogContent } from '../../../components/common/Dialog';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { trainerService } from '../../../mocks/services';
import { KeyRound, ShieldCheck, Dumbbell, Clock } from 'lucide-react';

interface AddTrainerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddTrainerDialog: React.FC<AddTrainerDialogProps> = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [specialtiesText, setSpecialtiesText] = useState('Tăng cơ bắp, Thể hình, Giảm mỡ');
  const [dailyLimitMinutes, setDailyLimitMinutes] = useState('360');
  const [defaultPassword] = useState('SmartGym@PT123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError('Vui lòng điền đầy đủ các trường thông tin bắt buộc (*)');
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const specs = specialtiesText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await trainerService.createTrainer({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        bio: bio.trim(),
        specialties: specs.length > 0 ? specs : ['Huấn luyện thể hình tổng quát'],
        dailyLimitMinutes: parseInt(dailyLimitMinutes, 10) || 360,
      });

      onSuccess();
      onClose();
    } catch {
      setError('Có lỗi xảy ra khi cấp tài khoản Huấn luyện viên');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        title="Cấp Phát Tài Khoản Huấn Luyện Viên (PT)"
        description="Khởi tạo hồ sơ nhân sự, cấu hình ca trực và cấp tài khoản truy cập Cổng Trainer"
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-1 max-h-[80vh] overflow-y-auto pr-1">
          {error && <div className="text-xs text-status-danger bg-rose-50 p-2.5 rounded border border-rose-200">{error}</div>}

          <div className="p-3 bg-slate-50 border border-border rounded-md text-xs text-text-secondary flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              Tài khoản PT được quản lý nội bộ. PT sẽ đăng nhập vào <strong>Cổng Huấn luyện viên (`/trainer`)</strong> để xem lịch dạy học viên và ghi nhận kết quả buổi tập.
            </div>
          </div>

          <Input
            label="Họ và tên Huấn luyện viên *"
            placeholder="Ví dụ: Hoàng Đình Long"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Địa chỉ Email (Tên đăng nhập) *"
              type="email"
              placeholder="long.pt@smartgym.vn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Số điện thoại liên hệ *"
              placeholder="0934 567 890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-text-primary">
              Chuyên môn huấn luyện (cách nhau bằng dấu phẩy) *
            </label>
            <Input
              placeholder="Ví dụ: Tăng cơ bắp, Giảm cân, Phục hồi chức năng, Kỹ thuật tạ"
              value={specialtiesText}
              onChange={(e) => setSpecialtiesText(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-text-primary">
              Giới hạn giờ dạy tối đa / ngày (Phút) *
            </label>
            <div className="relative">
              <Input
                type="number"
                value={dailyLimitMinutes}
                onChange={(e) => setDailyLimitMinutes(e.target.value)}
                placeholder="360"
                min={60}
                max={600}
                required
              />
              <span className="absolute right-3 top-2.5 text-xs text-text-secondary">
                = {Math.round(parseInt(dailyLimitMinutes || '0', 10) / 60)} tiếng / ngày
              </span>
            </div>
            <p className="text-[11px] text-text-secondary">
              Ràng buộc CP-SAT: Hệ thống xếp lịch tự động sẽ không bao giờ xếp quá giới hạn này để bảo vệ sức khỏe PT.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-text-primary">Giới thiệu ngắn (Bio)</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={2}
              placeholder="Kinh nghiệm 5 năm, chứng chỉ HLV cá nhân quốc tế..."
              className="w-full rounded-md bg-surface border border-border p-2.5 text-xs text-text-primary focus:outline-none focus:border-primary"
            />
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-md space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-amber-900 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-amber-700" /> Mật khẩu khởi tạo:
              </span>
              <span className="font-mono font-bold text-amber-950 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                {defaultPassword}
              </span>
            </div>
            <p className="text-[11px] text-amber-800 leading-tight">
              Cung cấp mật khẩu này cho Huấn luyện viên để đăng nhập lần đầu vào Cổng PT.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border mt-4">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
              Hủy bỏ
            </Button>
            <Button type="submit" variant="volt" isLoading={isLoading}>
              Cấp tài khoản Huấn luyện viên
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
