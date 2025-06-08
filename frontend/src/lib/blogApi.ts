import { BlogPost, BlogResponse, BlogCategory, BlogTag, BlogQueryParams, ApiResponse } from '@/types/blog';
import { config } from './config';

const API_BASE_URL = `${config.apiUrl}/api/v1`;

class BlogApiService {
  private async fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data: ApiResponse<T> = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'API request failed');
    }

    return data.data;
  }

  // Get blog posts with filtering and pagination
  async getPosts(params: BlogQueryParams = {}): Promise<BlogResponse> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = `/blog${queryString ? `?${queryString}` : ''}`;
    
    return this.fetchApi<BlogResponse>(endpoint);
  }

  // Get featured posts
  async getFeaturedPosts(limit: number = 3): Promise<BlogPost[]> {
    return this.fetchApi<BlogPost[]>(`/blog/featured?limit=${limit}`);
  }

  // Get recent posts
  async getRecentPosts(limit: number = 5): Promise<BlogPost[]> {
    return this.fetchApi<BlogPost[]>(`/blog/recent?limit=${limit}`);
  }

  // Get all categories
  async getCategories(): Promise<BlogCategory[]> {
    return this.fetchApi<BlogCategory[]>('/blog/categories');
  }

  // Get all tags
  async getTags(): Promise<BlogTag[]> {
    return this.fetchApi<BlogTag[]>('/blog/tags');
  }

  // Get single post by ID
  async getPostById(id: string): Promise<BlogPost> {
    return this.fetchApi<BlogPost>(`/blog/${id}`);
  }

  // Get single post by slug
  async getPostBySlug(slug: string): Promise<BlogPost> {
    return this.fetchApi<BlogPost>(`/blog/slug/${slug}`);
  }

  // Search posts
  async searchPosts(query: string, limit: number = 10): Promise<BlogResponse> {
    return this.getPosts({ search: query, limit });
  }

  // Get posts by category
  async getPostsByCategory(category: string, page: number = 1, limit: number = 10): Promise<BlogResponse> {
    return this.getPosts({ category, page, limit });
  }

  // Get posts by tag
  async getPostsByTag(tag: string, page: number = 1, limit: number = 10): Promise<BlogResponse> {
    return this.getPosts({ tag, page, limit });
  }
}

export const blogApi = new BlogApiService();