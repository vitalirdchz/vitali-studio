import React from 'react';

export default function GradientText({ children, className = '' }) {
  return (
    <span className={`bg-gradient-accent bg-clip-text text-transparent ${className}`}>
      {children}
    </span>
  );
}
