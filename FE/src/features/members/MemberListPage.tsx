import React, { useEffect, useState } from 'react';
import { DetailedMember } from '../../mocks/mockData';
import { memberService } from '../../mocks/services';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { StatusIndicator } from '../../components/common/StatusIndicator';
import { Badge } from '../../components/common/Badge';
import { Pagination } from '../../components/common/Pagination';
import { EmptyState } from '../../components/common/EmptyState';
import { AddMemberDialog } from './components/AddMemberDialog';
import { LockMemberDialog } from './components/LockMemberDialog';
import { MemberDetailModal } from './components/MemberDetailModal';
import {
  Search,
  Plus,
  Lock,
  Unlock,
  Eye,
  ScanFace,
  Users,
} from 'lucide-react';

export const MemberListPage: React.FC = () => {
  const [members, setMembers] = useState<DetailedMember[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  // Dialog states
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [selectedMemberForLock, setSelectedMemberForLock] = useState<DetailedMember | null>(null);
  const [selectedMemberForDetail, setSelectedMemberForDetail] = useState<DetailedMember | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const data = await memberService.getMembers(searchQuery, statusFilter);
      setMembers(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const handleLockSuccess = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
    fetchMembers();
  };

  // Pagination calculation
  const totalItems = members.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedMembers = members.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Header & Main Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary tracking-tight">Quản lý Hội viên</h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Danh sách hồ sơ hội viên, gói tập, số lượt PT và trạng thái sinh trắc học
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsAddOpen(true)}
          icon={<Plus className="w-4 h-4" />}
          className="font-semibold shadow-sm"
        >
          Thêm hội viên mới
        </Button>
      </div>

      {notification && (
        <div className="p-3.5 rounded-md bg-primary-light border border-primary-border text-xs text-primary font-medium flex items-center justify-between animate-in fade-in">
          <span>{notification}</span>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-primary hover:opacity-75 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-surface p-3 rounded-lg border border-border shadow-sm">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Tìm theo tên, email, SĐT, mã..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-text-secondary shrink-0">Trạng thái:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-md bg-surface border border-border text-xs font-semibold text-text-primary focus:outline-none focus:border-primary"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="ACTIVE">Đang hoạt động</option>
            <option value="LOCKED">Bị khóa</option>
          </select>
        </div>
      </div>

      {/* Members Data Table */}
      <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 bg-slate-100 rounded" />
            ))}
          </div>
        ) : paginatedMembers.length === 0 ? (
          <EmptyState
            title="Không tìm thấy hội viên nào"
            description="Hãy thử thay đổi từ khóa tìm kiếm hoặc bỏ bộ lọc trạng thái."
            icon={<Users className="w-6 h-6" />}
            actionText="Tất cả hội viên"
            onAction={() => {
              setSearchQuery('');
              setStatusFilter('ALL');
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-surface-subtle border-b border-border text-text-secondary font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Mã HV</th>
                  <th className="py-3 px-4">Họ và tên</th>
                  <th className="py-3 px-4">Email / SĐT</th>
                  <th className="py-3 px-4">Gói đang tập</th>
                  <th className="py-3 px-4 text-center">Lượt PT</th>
                  <th className="py-3 px-4 text-center">Khuôn mặt</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/80">
                {paginatedMembers.map((member) => {
                  const availablePt = member.membership
                    ? member.membership.totalPt -
                      member.membership.usedPt -
                      member.membership.reservedPt
                    : 0;

                  return (
                    <tr
                      key={member.id}
                      className="hover:bg-surface-hover/70 transition-colors cursor-default"
                    >
                      <td className="py-3 px-4 font-mono font-medium text-text-primary">
                        {member.id}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-text-primary">{member.name}</div>
                        <div className="text-[10px] text-text-muted">Tham gia: {member.joinedAt}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-text-primary">{member.email}</div>
                        <div className="text-text-secondary">{member.phone}</div>
                      </td>
                      <td className="py-3 px-4">
                        {member.membership ? (
                          <span className="font-medium text-primary">
                            {member.membership.planName}
                          </span>
                        ) : (
                          <span className="text-text-muted italic">Chưa đăng ký</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {member.membership && member.membership.totalPt > 0 ? (
                          <span className="inline-flex items-center gap-1 font-semibold text-primary bg-primary-light px-2 py-0.5 rounded">
                            {availablePt} / {member.membership.totalPt}
                          </span>
                        ) : (
                          <span className="text-text-muted">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {member.faceRegistered ? (
                          <Badge variant="success" className="gap-1">
                            <ScanFace className="w-3 h-3" />
                            Đã ĐK ({member.faceSampleCount || 3})
                          </Badge>
                        ) : (
                          <Badge variant="neutral">Chưa ĐK</Badge>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <StatusIndicator status={member.status} />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-xs"
                            onClick={() => setSelectedMemberForDetail(member)}
                            icon={<Eye className="w-3.5 h-3.5" />}
                          >
                            Chi tiết
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-8 px-2 text-xs ${
                              member.status === 'ACTIVE'
                                ? 'text-status-danger hover:text-status-danger hover:bg-rose-50'
                                : 'text-primary hover:text-primary hover:bg-primary-light'
                            }`}
                            onClick={() => setSelectedMemberForLock(member)}
                            icon={
                              member.status === 'ACTIVE' ? (
                                <Lock className="w-3.5 h-3.5" />
                              ) : (
                                <Unlock className="w-3.5 h-3.5" />
                              )
                            }
                          >
                            {member.status === 'ACTIVE' ? 'Khóa' : 'Mở khóa'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination bar */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {/* Modals & Dialogs */}
      <AddMemberDialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={() => {
          setNotification('Tạo hồ sơ hội viên mới thành công!');
          setTimeout(() => setNotification(null), 4000);
          fetchMembers();
        }}
      />

      <LockMemberDialog
        member={selectedMemberForLock}
        isOpen={!!selectedMemberForLock}
        onClose={() => setSelectedMemberForLock(null)}
        onSuccess={handleLockSuccess}
      />

      <MemberDetailModal
        member={selectedMemberForDetail}
        isOpen={!!selectedMemberForDetail}
        onClose={() => setSelectedMemberForDetail(null)}
      />
    </div>
  );
};
