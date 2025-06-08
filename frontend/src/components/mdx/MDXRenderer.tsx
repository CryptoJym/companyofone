'use client';

import React, { Suspense } from 'react';
import { MDXRemote } from 'next-mdx-remote';
import { Serialize } from 'next-mdx-remote/serialize';
import { mdxComponents, TableOfContents } from './MDXComponents';
import { extractHeadings } from '@/lib/mdx';

interface MDXRendererProps {
  source: Serialize;
  content?: string;
  showTableOfContents?: boolean;
}

const MDXLoadingFallback: React.FC = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-8 bg-gray-200 rounded w-3/4"></div>
    <div className="h-4 bg-gray-200 rounded"></div>
    <div className="h-4 bg-gray-200 rounded"></div>
    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    <div className="h-6 bg-gray-200 rounded w-1/2 mt-8"></div>
    <div className="h-4 bg-gray-200 rounded"></div>
    <div className="h-4 bg-gray-200 rounded"></div>
  </div>
);

const MDXErrorFallback: React.FC<{ error: Error }> = ({ error }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-6">
    <h3 className="text-lg font-semibold text-red-800 mb-2">
      ❌ Error rendering content
    </h3>
    <p className="text-red-700 mb-4">
      Sorry, there was an error rendering this content. Please try again later.
    </p>
    {process.env.NODE_ENV === 'development' && (
      <details className="text-sm">
        <summary className="cursor-pointer text-red-600 hover:text-red-800">
          View error details (development only)
        </summary>
        <pre className="mt-2 bg-red-100 p-2 rounded text-xs overflow-auto">
          {error.message}
          {error.stack && `\n\n${error.stack}`}
        </pre>
      </details>
    )}
  </div>
);

class MDXErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('MDX rendering error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return <MDXErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

export const MDXRenderer: React.FC<MDXRendererProps> = ({ 
  source, 
  content,
  showTableOfContents = false 
}) => {
  const headings = content ? extractHeadings(content) : [];

  return (
    <MDXErrorBoundary>
      <div className="mdx-content">
        {showTableOfContents && headings.length > 0 && (
          <div className="mb-8">
            <TableOfContents headings={headings} />
          </div>
        )}
        
        <Suspense fallback={<MDXLoadingFallback />}>
          <div className="prose prose-lg max-w-none prose-headings:scroll-mt-16">
            <MDXRemote {...source} components={mdxComponents} />
          </div>
        </Suspense>
      </div>
    </MDXErrorBoundary>
  );
};

export default MDXRenderer;