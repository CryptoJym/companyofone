'use client';

import React, { useState, useEffect } from 'react';
import { BlogCard } from '@/components/blog/BlogCard';
import { blogApi } from '@/lib/blogApi';
import { BlogPost, BlogCategory, BlogTag, BlogQueryParams } from '@/types/blog';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters and pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  const fetchPosts = async (params: BlogQueryParams = {}) => {
    try {
      setLoading(true);
      const response = await blogApi.getPosts({
        page: currentPage,
        limit: 12,
        search: searchQuery || undefined,
        category: selectedCategory || undefined,
        tag: selectedTag || undefined,
        status: 'published',
        ...params,
      });
      
      setPosts(response.posts);
      setCategories(response.categories);
      setTags(response.tags);
      setTotalPages(response.pagination.pages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [currentPage, searchQuery, selectedCategory, selectedTag]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPosts();
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedTag('');
    setCurrentPage(1);
  };

  const handleTagChange = (tag: string) => {
    setSelectedTag(tag);
    setSelectedCategory('');
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedTag('');
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Blog</h1>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">Error loading blog posts: {error}</p>
              <button
                onClick={() => fetchPosts()}
                className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Company of One Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Insights, strategies, and stories for solopreneurs building successful one-person businesses.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-4 justify-center">
            <input
              type="text"
              placeholder="Search blog posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </form>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 justify-center">
            {/* Categories */}
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name} ({category.postCount})
                </option>
              ))}
            </select>

            {/* Tags */}
            <select
              value={selectedTag}
              onChange={(e) => handleTagChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Tags</option>
              {tags.map((tag) => (
                <option key={tag.id} value={tag.slug}>
                  #{tag.name} ({tag.postCount})
                </option>
              ))}
            </select>

            {/* Clear filters */}
            {(searchQuery || selectedCategory || selectedTag) && (
              <button
                onClick={clearFilters}
                className="text-gray-600 hover:text-gray-800 underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading blog posts...</p>
          </div>
        )}

        {/* Posts Grid */}
        {!loading && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* No posts */}
        {!loading && posts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || selectedCategory || selectedTag
                ? 'Try adjusting your search criteria.'
                : 'No blog posts are available at the moment.'}
            </p>
            {(searchQuery || selectedCategory || selectedTag) && (
              <button
                onClick={clearFilters}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                View All Posts
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 border rounded-lg ${
                  page === currentPage
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}