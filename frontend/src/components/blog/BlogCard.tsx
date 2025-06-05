'use client';

import React from 'react';
import Link from 'next/link';
import { BlogPost } from '@/types/blog';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const formattedDate = new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className={`group ${featured ? 'col-span-2 row-span-2' : ''}`}>
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden h-full">
          {/* Featured badge */}
          {post.featured && (
            <div className="absolute top-4 left-4 z-10">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                Featured
              </span>
            </div>
          )}

          {/* Content */}
          <div className="p-6 h-full flex flex-col">
            {/* Categories */}
            {post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {post.categories.slice(0, 2).map((category) => (
                  <Link
                    key={category}
                    href={`/blog/category/${category}`}
                    className="text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {category}
                  </Link>
                ))}
              </div>
            )}

            {/* Title */}
            <h3 className={`font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-3 ${
              featured ? 'text-2xl' : 'text-xl'
            }`}>
              {post.title}
            </h3>

            {/* Excerpt */}
            <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">
              {post.excerpt}
            </p>

            {/* Meta info */}
            <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-4">
                {/* Author */}
                <div className="flex items-center space-x-2">
                  {post.author.avatar ? (
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">
                        {post.author.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span>{post.author.name}</span>
                </div>
                
                {/* Date */}
                <span>{formattedDate}</span>
              </div>

              {/* Reading time */}
              <span>{post.readingTime} min read</span>
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {post.tags.slice(0, 3).map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog/tag/${tag}`}
                    className="text-xs text-gray-500 hover:text-gray-700 bg-gray-100 px-2 py-1 rounded"
                    onClick={(e) => e.stopPropagation()}
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}