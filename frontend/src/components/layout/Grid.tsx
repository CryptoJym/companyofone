'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
  sm?: 1 | 2 | 3 | 4 | 5 | 6;
  md?: 1 | 2 | 3 | 4 | 5 | 6;
  lg?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

const gapSizes = {
  xs: 'gap-2',
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
  xl: 'gap-10'
};

export const Grid: React.FC<GridProps> = ({
  cols = 1,
  sm,
  md,
  lg,
  gap = 'md',
  className,
  children,
  ...props
}) => {
  const gridClasses = cn(
    'grid',
    `grid-cols-${cols}`,
    sm && `sm:grid-cols-${sm}`,
    md && `md:grid-cols-${md}`,
    lg && `lg:grid-cols-${lg}`,
    gapSizes[gap],
    className
  );

  return (
    <div className={gridClasses} {...props}>
      {children}
    </div>
  );
}; 