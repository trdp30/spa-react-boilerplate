import React from 'react';

const Shimmer = ({ width, height }: { width?: string; height?: string }) => {
  return (
    <div className="shimmer" data-testid="shimmer" style={{ width: width || '100%', height: height || '100%' }}></div>
  );
};

export default Shimmer;
