import React from 'react';

interface SkeletonLoaderProps {
  type?: 'card' | 'list' | 'avatar' | 'text';
  className?: string;
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  type = 'card',
  className = '',
  count = 1,
}) => {
  const items = Array.from({ length: count });

  if (type === 'avatar') {
    return (
      <div className="flex flex-wrap gap-4">
        {items.map((_, i) => (
          <div
            key={i}
            className={`skeleton rounded-full h-12 w-12 shrink-0 ${className}`}
          />
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-4 w-full">
        {items.map((_, i) => (
          <div key={i} className="flex gap-4 items-center">
            <div className="skeleton rounded-full h-10 w-10 shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="skeleton h-4 w-[60%] rounded" />
              <div className="skeleton h-3 w-[40%] rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'text') {
    return (
      <div className="space-y-2 w-full">
        {items.map((_, i) => (
          <div key={i} className={`skeleton h-4 rounded w-full ${className}`} />
        ))}
      </div>
    );
  }

  // Default: Card Skeleton
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((_, i) => (
        <div
          key={i}
          className={`glass-panel rounded-xl p-6 h-[260px] flex flex-col justify-between ${className}`}
        >
          <div className="skeleton w-full h-[140px] rounded-lg" />
          <div className="space-y-2 pt-4">
            <div className="skeleton h-5 w-[75%] rounded" />
            <div className="skeleton h-3 w-[45%] rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};
