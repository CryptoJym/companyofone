'use client';

import React from 'react';
import { MDXProvider as BaseMDXProvider } from '@mdx-js/react';
import { mdxComponents } from './MDXComponents';

interface MDXProviderProps {
  children: React.ReactNode;
}

export const MDXProvider: React.FC<MDXProviderProps> = ({ children }) => {
  return (
    <BaseMDXProvider components={mdxComponents}>
      {children}
    </BaseMDXProvider>
  );
};