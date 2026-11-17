'use strict';
import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingProps {
  value: number;
  max?: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  interactive?: boolean;
  onChange?: (val: number) => void;
  className?: string;
}

export const Rating: React.FC<RatingProps> = ({
  value,
  max = 5,
  reviewCount,
  size = 'md',
  showCount = true,
  interactive = false,
  onChange,
  className,
}) => {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);

  const starSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base font-semibold',
  };

  const displayRating = hoverValue !== null ? hoverValue : value;

  return (
    <div className={cn('inline-flex items-center gap-1.5', className)}>
      <div className="flex items-center">
        {Array.from({ length: max }).map((_, i) => {
          const starIndex = i + 1;
          const isFilled = displayRating >= starIndex;
          const isHalf = !isFilled && displayRating >= starIndex - 0.5;

          return (
            <button
              key={i}
              type={interactive ? 'button' : undefined}
              disabled={!interactive}
              onClick={() => interactive && onChange && onChange(starIndex)}
              onMouseEnter={() => interactive && setHoverValue(starIndex)}
              onMouseLeave={() => interactive && setHoverValue(null)}
              className={cn(
                'transition-transform',
                interactive ? 'cursor-pointer hover:scale-115 p-0.5' : 'cursor-default pointer-events-none'
              )}
              aria-label={`${starIndex} star`}
            >
              <Star
                className={cn(
                  starSizes[size],
                  isFilled
                    ? 'fill-amber-400 text-amber-400'
                    : isHalf
                    ? 'fill-amber-300/60 text-amber-400'
                    : 'text-slate-200 fill-slate-100'
                )}
              />
            </button>
          );
        })}
      </div>

      {showCount && (
        <span className={cn('font-semibold text-brand-navy flex items-center gap-1', textSizes[size])}>
          <span>{value.toFixed(1)}</span>
          {typeof reviewCount === 'number' && (
            <span className="text-brand-muted font-normal">
              ({reviewCount.toLocaleString()} {reviewCount === 1 ? 'review' : 'reviews'})
            </span>
          )}
        </span>
      )}
    </div>
  );
};

