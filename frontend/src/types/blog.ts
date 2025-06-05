export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: {
    name: string;
    email: string;
    avatar?: string;
  };
  tags: string[];
  categories: string[];
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  readingTime: number; // in minutes
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  postCount: number;
  createdAt: string;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  postCount: number;
  createdAt: string;
}

export interface BlogQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  search?: string;
  status?: 'draft' | 'published' | 'archived';
  featured?: boolean;
  sortBy?: 'createdAt' | 'updatedAt' | 'publishedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface BlogResponse {
  posts: BlogPost[];
  pagination: {
    current: number;
    total: number;
    pages: number;
    limit: number;
  };
  categories: BlogCategory[];
  tags: BlogTag[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: any[];
}