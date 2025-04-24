import React from 'react';

interface PageHeadingProps {
  children: React.ReactNode;
}

const PageHeading = ({ children }: PageHeadingProps) => {
  return <span className="text-sm font-medium">{children}</span>;
};

export default PageHeading;
