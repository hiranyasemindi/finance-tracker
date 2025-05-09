"use client";

import React from 'react';

interface FormGroupProps {
  children: React.ReactNode;
  className?: string;
  grid?: boolean;
  cols?: 1 | 2 | 3 | 4;
  gap?: 2 | 4 | 6 | 8;
}

const FormGroup: React.FC<FormGroupProps> = ({
  children,
  className = '',
  grid = false,
  cols = 2,
  gap = 4,
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4',
  };

  const gapSizes = {
    2: 'gap-2',
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8',
  };

  return (
    <div
      className={`${grid ? `grid ${gridCols[cols]} ${gapSizes[gap]}` : 'space-y-4'} ${className}`}
    >
      {children}
    </div>
  );
};

export default FormGroup; 