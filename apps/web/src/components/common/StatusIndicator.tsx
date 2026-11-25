import React from 'react';
import { cn } from '../../lib/utils';

interface StatusIndicatorProps {
  status: 'ACTIVE' | 'LOCKED' | 'PENDING' | 'EXPIRED' | 'CONFIRMED' | 'CANCELLED';
  label?: string;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, label, className }) => {
  const configs = {
    ACTIVE: {
      color: 'bg-status-success',
      text: label || 'Đang hoạt động',
      textClass: 'text-text-primary',
    },
    CONFIRMED: {
      color: 'bg-status-success',
      text: label || 'Đã xác nhận',
      textClass: 'text-text-primary',
    },
    PENDING: {
      color: 'bg-status-warning',
      text: label || 'Chờ duyệt',
      textClass: 'text-status-warning',
    },
    LOCKED: {
      color: 'bg-status-danger',
      text: label || 'Bị khóa',
      textClass: 'text-status-danger',
    },
    CANCELLED: {
      color: 'bg-status-danger',
      text: label || 'Đã hủy',
      textClass: 'text-status-danger',
    },
    EXPIRED: {
      color: 'bg-text-secondary',
      text: label || 'Hết hạn',
      textClass: 'text-text-secondary',
    },
  };

  const config = configs[status] || configs.ACTIVE;

  return (
    <span className={cn('inline-flex items-center gap-2 text-xs font-medium', className)}>
      <span className={cn('w-2 h-2 rounded-full shrink-0', config.color)} />
      <span className={config.textClass}>{config.text}</span>
    </span>
  );
};
