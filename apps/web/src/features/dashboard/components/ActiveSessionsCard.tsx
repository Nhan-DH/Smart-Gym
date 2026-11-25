import React from 'react';
import { AttendanceSession } from '../../../types';
import { formatDateTime } from '../../../lib/utils';
import { Badge } from '../../../components/common/Badge';
import { ScanFace, QrCode } from 'lucide-react';

interface ActiveSessionsCardProps {
  sessions: AttendanceSession[];
}

export const ActiveSessionsCard: React.FC<ActiveSessionsCardProps> = ({ sessions }) => {
  return (
    <div className="divide-y divide-border/70">
      {sessions.map((session) => (
        <div key={session.id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold text-xs">
              {session.memberName.charAt(0)}
            </div>
            <div>
              <div className="text-xs font-semibold text-text-primary">{session.memberName}</div>
              <div className="text-[11px] text-text-secondary mt-0.5">
                Vào lúc: {formatDateTime(session.checkInAt)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="success">Đang trong phòng</Badge>
            <div className="inline-flex items-center gap-1 text-[11px] text-text-secondary bg-surface-subtle px-2 py-0.5 rounded border border-border">
              {session.method === 'FACE' ? (
                <>
                  <ScanFace className="w-3 h-3 text-primary" />
                  <span>Khuôn mặt</span>
                </>
              ) : (
                <>
                  <QrCode className="w-3 h-3 text-primary" />
                  <span>Mã QR</span>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
