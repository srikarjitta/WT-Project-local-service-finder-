import React from 'react';
import { Clock, CheckCircle2 } from 'lucide-react';
import { BusinessHours } from '@/types';
import { cn } from '@/lib/utils';

interface OpeningHoursCardProps {
  hours: BusinessHours[];
  isOpenNow: boolean;
  className?: string;
}

export const OpeningHoursCard: React.FC<OpeningHoursCardProps> = ({
  hours,
  isOpenNow,
  className,
}) => {
  // Determine current day of week
  const todayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());

  return (
    <div
      className={cn(
        'bg-white rounded-3xl border border-[#DBEAFE] p-5 shadow-xs',
        className
      )}
    >
      <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600" />
          <h4 className="font-extrabold text-sm text-[#1E3A8A]">Opening Hours</h4>
        </div>
        <span
          className={cn(
            'px-2.5 py-0.5 rounded-full text-xs font-bold border',
            isOpenNow
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-rose-50 text-rose-700 border-rose-200'
          )}
        >
          {isOpenNow ? 'Open Now' : 'Closed'}
        </span>
      </div>

      <div className="space-y-2 text-xs">
        {hours.map((h) => {
          const isToday = h.day.toLowerCase() === todayName.toLowerCase();
          return (
            <div
              key={h.day}
              className={cn(
                'flex items-center justify-between py-1.5 px-2.5 rounded-xl transition-colors',
                isToday
                  ? 'bg-blue-50 font-bold text-blue-900 border border-blue-200/80'
                  : 'text-slate-600'
              )}
            >
              <div className="flex items-center gap-1.5">
                <span>{h.day}</span>
                {isToday && (
                  <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.2 rounded-sm font-bold">
                    Today
                  </span>
                )}
              </div>
              <span className="font-medium text-slate-800">
                {h.isClosed ? 'Closed' : `${h.open} – ${h.close}`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

