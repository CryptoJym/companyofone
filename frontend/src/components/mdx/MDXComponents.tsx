import React from 'react';
import Link from 'next/link';
import { MDXComponents } from 'mdx/types';

// Custom components for MDX content
export const CalloutBox: React.FC<{
  type?: 'info' | 'warning' | 'success' | 'error';
  title?: string;
  children: React.ReactNode;
}> = ({ type = 'info', title, children }) => {
  const typeStyles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  };

  const iconStyles = {
    info: '💡',
    warning: '⚠️',
    success: '✅',
    error: '❌',
  };

  return (
    <div className={`border-l-4 p-4 rounded-r-md my-6 ${typeStyles[type]}`}>
      {title && (
        <h4 className="font-semibold flex items-center gap-2 mb-2">
          <span>{iconStyles[type]}</span>
          {title}
        </h4>
      )}
      <div className="prose prose-sm max-w-none">{children}</div>
    </div>
  );
};

export const CodeBlock: React.FC<{
  children: React.ReactNode;
  className?: string;
  filename?: string;
}> = ({ children, className, filename }) => {
  return (
    <div className="my-6 overflow-hidden rounded-lg border border-gray-200">
      {filename && (
        <div className="bg-gray-100 px-4 py-2 text-sm font-mono text-gray-600">
          {filename}
        </div>
      )}
      <pre className={`overflow-x-auto p-4 ${className || ''}`}>
        <code>{children}</code>
      </pre>
    </div>
  );
};

export const TipBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <CalloutBox type="info" title="💡 Pro Tip">
    {children}
  </CalloutBox>
);

export const WarningBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <CalloutBox type="warning" title="⚠️ Important">
    {children}
  </CalloutBox>
);

export const SuccessBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <CalloutBox type="success" title="✅ Success">
    {children}
  </CalloutBox>
);

export const QuoteBox: React.FC<{
  author?: string;
  title?: string;
  children: React.ReactNode;
}> = ({ author, title, children }) => (
  <blockquote className="border-l-4 border-blue-500 pl-6 py-4 my-6 bg-gray-50 italic">
    <div className="text-lg text-gray-700">{children}</div>
    {(author || title) && (
      <footer className="mt-3 text-sm text-gray-500">
        {title && <cite className="font-medium">{title}</cite>}
        {author && title && <span> — </span>}
        {author && <span className="font-medium">{author}</span>}
      </footer>
    )}
  </blockquote>
);

export const StatsCard: React.FC<{
  title: string;
  value: string;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
}> = ({ title, value, description, trend }) => {
  const trendIcon = {
    up: '📈',
    down: '📉',
    neutral: '➡️',
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 my-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {trend && <span>{trendIcon[trend]}</span>}
      </div>
      <div className="mt-2">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
      </div>
    </div>
  );
};

export const ButtonLink: React.FC<{
  href: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}> = ({ href, variant = 'primary', size = 'md', children }) => {
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <Link
      href={href}
      className={`inline-block rounded-md font-medium transition-colors ${variantStyles[variant]} ${sizeStyles[size]}`}
    >
      {children}
    </Link>
  );
};

export const ImageGrid: React.FC<{
  images: Array<{ src: string; alt: string; caption?: string }>;
  columns?: 2 | 3 | 4;
}> = ({ images, columns = 2 }) => {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4 my-6`}>
      {images.map((image, index) => (
        <div key={index} className="space-y-2">
          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-auto rounded-lg border border-gray-200"
          />
          {image.caption && (
            <p className="text-sm text-gray-600 text-center">{image.caption}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export const TableOfContents: React.FC<{
  headings: Array<{ id: string; text: string; level: number }>;
}> = ({ headings }) => (
  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 my-6">
    <h3 className="font-semibold text-gray-900 mb-3">📋 Table of Contents</h3>
    <ul className="space-y-1">
      {headings.map((heading) => (
        <li key={heading.id} style={{ marginLeft: `${(heading.level - 1) * 16}px` }}>
          <a
            href={`#${heading.id}`}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

// Default MDX components
export const mdxComponents: MDXComponents = {
  // Headings with custom styling
  h1: ({ children, ...props }) => (
    <h1 className="text-4xl font-bold text-gray-900 mb-6 mt-8" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-8" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="text-2xl font-bold text-gray-900 mb-3 mt-6" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4 className="text-xl font-semibold text-gray-900 mb-2 mt-4" {...props}>
      {children}
    </h4>
  ),
  h5: ({ children, ...props }) => (
    <h5 className="text-lg font-semibold text-gray-900 mb-2 mt-4" {...props}>
      {children}
    </h5>
  ),
  h6: ({ children, ...props }) => (
    <h6 className="text-base font-semibold text-gray-900 mb-2 mt-4" {...props}>
      {children}
    </h6>
  ),

  // Paragraphs
  p: ({ children, ...props }) => (
    <p className="text-gray-700 leading-relaxed mb-4" {...props}>
      {children}
    </p>
  ),

  // Links
  a: ({ href, children, ...props }) => {
    const isExternal = href?.startsWith('http');
    return (
      <Link
        href={href || '#'}
        className="text-blue-600 hover:text-blue-800 underline"
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        {...props}
      >
        {children}
      </Link>
    );
  },

  // Lists
  ul: ({ children, ...props }) => (
    <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="list-decimal list-inside mb-4 space-y-1 text-gray-700" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="ml-4" {...props}>
      {children}
    </li>
  ),

  // Code
  code: ({ children, className, ...props }) => {
    if (className) {
      // Block code with syntax highlighting
      return <CodeBlock className={className}>{children}</CodeBlock>;
    }
    // Inline code
    return (
      <code
        className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono"
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: ({ children, ...props }) => (
    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4" {...props}>
      {children}
    </pre>
  ),

  // Blockquotes
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4"
      {...props}
    >
      {children}
    </blockquote>
  ),

  // Tables
  table: ({ children, ...props }) => (
    <div className="overflow-x-auto my-6">
      <table className="min-w-full border border-gray-200 rounded-lg" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead className="bg-gray-50" {...props}>
      {children}
    </thead>
  ),
  tbody: ({ children, ...props }) => (
    <tbody className="divide-y divide-gray-200" {...props}>
      {children}
    </tbody>
  ),
  tr: ({ children, ...props }) => (
    <tr {...props}>
      {children}
    </tr>
  ),
  th: ({ children, ...props }) => (
    <th className="px-4 py-2 text-left font-semibold text-gray-900 border-b" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="px-4 py-2 text-gray-700" {...props}>
      {children}
    </td>
  ),

  // Images
  img: ({ src, alt, ...props }) => (
    <img
      src={src}
      alt={alt}
      className="max-w-full h-auto rounded-lg border border-gray-200 my-6"
      {...props}
    />
  ),

  // Horizontal rule
  hr: ({ ...props }) => (
    <hr className="border-gray-300 my-8" {...props} />
  ),

  // Custom components
  CalloutBox,
  CodeBlock,
  TipBox,
  WarningBox,
  SuccessBox,
  QuoteBox,
  StatsCard,
  ButtonLink,
  ImageGrid,
  TableOfContents,
};