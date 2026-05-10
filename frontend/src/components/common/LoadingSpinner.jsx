import React from 'react';

const LoadingSpinner = ({ 
  size    = 'md',    // sm, md, lg
  text    = '',      // Optional loading text
  fullPage = false,  // Full page overlay
}) => {

  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-[3px]',
    lg: 'h-16 w-16 border-4',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`
        animate-spin rounded-full 
        border-slate-200 border-t-blue-600
        ${sizeClasses[size] || sizeClasses.md}
      `} />
      {text && (
        <p className="text-sm font-medium text-slate-500 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  // Full page loading overlay
  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  // Inline loading
  return (
    <div className="flex w-full items-center justify-center py-8">
      {spinner}
    </div>
  );
};

export default LoadingSpinner;