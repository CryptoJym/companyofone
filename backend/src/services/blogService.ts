import { promises as fs } from 'fs';
import { join } from 'path';
import { 
  BlogPost, 
  BlogCategory, 
  BlogTag, 
  BlogQueryParams, 
  BlogResponse, 
  CreateBlogPostRequest, 
  UpdateBlogPostRequest 
} from '../types/blog';

const BLOG_DATA_DIR = join(process.cwd(), 'data', 'blog');
const POSTS_FILE = join(BLOG_DATA_DIR, 'posts.json');
const CATEGORIES_FILE = join(BLOG_DATA_DIR, 'categories.json');
const TAGS_FILE = join(BLOG_DATA_DIR, 'tags.json');

class BlogService {
  private async ensureDataDirectory(): Promise<void> {
    try {
      await fs.access(BLOG_DATA_DIR);
    } catch {
      await fs.mkdir(BLOG_DATA_DIR, { recursive: true });
    }
  }

  private async readJsonFile<T>(filePath: string, defaultValue: T): Promise<T> {
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch {
      return defaultValue;
    }
  }

  private async writeJsonFile<T>(filePath: string, data: T): Promise<void> {
    await this.ensureDataDirectory();
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  private calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  async getAllPosts(): Promise<BlogPost[]> {
    return this.readJsonFile<BlogPost[]>(POSTS_FILE, []);
  }

  async getAllCategories(): Promise<BlogCategory[]> {
    return this.readJsonFile<BlogCategory[]>(CATEGORIES_FILE, []);
  }

  async getAllTags(): Promise<BlogTag[]> {
    return this.readJsonFile<BlogTag[]>(TAGS_FILE, []);
  }

  async getPostById(id: string): Promise<BlogPost | null> {
    const posts = await this.getAllPosts();
    return posts.find(post => post.id === id) || null;
  }

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    const posts = await this.getAllPosts();
    return posts.find(post => post.slug === slug) || null;
  }

  async queryPosts(params: BlogQueryParams): Promise<BlogResponse> {
    const posts = await this.getAllPosts();
    const categories = await this.getAllCategories();
    const tags = await this.getAllTags();

    // Filter posts
    let filteredPosts = posts.filter(post => {
      if (params.status && post.status !== params.status) return false;
      if (params.category && !post.categories.includes(params.category)) return false;
      if (params.tag && !post.tags.includes(params.tag)) return false;
      if (params.featured !== undefined && post.featured !== params.featured) return false;
      if (params.search) {
        const searchTerm = params.search.toLowerCase();
        const searchableText = `${post.title} ${post.content} ${post.excerpt}`.toLowerCase();
        if (!searchableText.includes(searchTerm)) return false;
      }
      return true;
    });

    // Sort posts
    const sortBy = params.sortBy || 'createdAt';
    const sortOrder = params.sortOrder || 'desc';
    
    filteredPosts.sort((a, b) => {
      const aValue = a[sortBy as keyof BlogPost] as any;
      const bValue = b[sortBy as keyof BlogPost] as any;
      
      let comparison = 0;
      if (aValue && bValue) {
        if (aValue < bValue) comparison = -1;
        if (aValue > bValue) comparison = 1;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    // Pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

    return {
      posts: paginatedPosts,
      pagination: {
        current: page,
        total: filteredPosts.length,
        pages: Math.ceil(filteredPosts.length / limit),
        limit,
      },
      categories,
      tags,
    };
  }

  async createPost(postData: CreateBlogPostRequest): Promise<BlogPost> {
    const posts = await this.getAllPosts();
    const now = new Date();
    
    const newPost: BlogPost = {
      id: this.generateId(),
      title: postData.title,
      slug: this.generateSlug(postData.title),
      content: postData.content,
      excerpt: postData.excerpt || postData.content.substring(0, 160) + '...',
      author: postData.author,
      tags: postData.tags || [],
      categories: postData.categories || [],
      featured: postData.featured || false,
      status: postData.status || 'draft',
      seo: postData.seo || {},
      readingTime: this.calculateReadingTime(postData.content),
      createdAt: now,
      updatedAt: now,
      publishedAt: postData.status === 'published' ? now : undefined,
    };

    posts.push(newPost);
    await this.writeJsonFile(POSTS_FILE, posts);
    
    // Update categories and tags
    await this.updateCategoriesAndTags();
    
    return newPost;
  }

  async updatePost(updateData: UpdateBlogPostRequest): Promise<BlogPost | null> {
    const posts = await this.getAllPosts();
    const postIndex = posts.findIndex(post => post.id === updateData.id);
    
    if (postIndex === -1) return null;

    const existingPost = posts[postIndex];
    const now = new Date();
    
    const updatedPost: BlogPost = {
      id: existingPost.id,
      title: updateData.title || existingPost.title,
      slug: updateData.title ? this.generateSlug(updateData.title) : existingPost.slug,
      content: updateData.content || existingPost.content,
      excerpt: updateData.excerpt || existingPost.excerpt,
      author: updateData.author || existingPost.author,
      tags: updateData.tags || existingPost.tags,
      categories: updateData.categories || existingPost.categories,
      featured: updateData.featured !== undefined ? updateData.featured : existingPost.featured,
      status: updateData.status || existingPost.status,
      seo: updateData.seo || existingPost.seo,
      readingTime: updateData.content ? this.calculateReadingTime(updateData.content) : existingPost.readingTime,
      createdAt: existingPost.createdAt,
      updatedAt: now,
      publishedAt: updateData.status === 'published' && !existingPost.publishedAt ? now : existingPost.publishedAt,
    };

    posts[postIndex] = updatedPost;
    await this.writeJsonFile(POSTS_FILE, posts);
    
    // Update categories and tags
    await this.updateCategoriesAndTags();
    
    return updatedPost;
  }

  async deletePost(id: string): Promise<boolean> {
    const posts = await this.getAllPosts();
    const filteredPosts = posts.filter(post => post.id !== id);
    
    if (filteredPosts.length === posts.length) return false;
    
    await this.writeJsonFile(POSTS_FILE, filteredPosts);
    
    // Update categories and tags
    await this.updateCategoriesAndTags();
    
    return true;
  }

  private async updateCategoriesAndTags(): Promise<void> {
    const posts = await this.getAllPosts();
    
    // Update categories
    const categoryMap = new Map<string, number>();
    posts.forEach(post => {
      post.categories.forEach(category => {
        categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
      });
    });

    const categories: BlogCategory[] = Array.from(categoryMap.entries()).map(([name, count]) => ({
      id: this.generateSlug(name),
      name,
      slug: this.generateSlug(name),
      description: '',
      postCount: count,
      createdAt: new Date(),
    }));

    await this.writeJsonFile(CATEGORIES_FILE, categories);

    // Update tags
    const tagMap = new Map<string, number>();
    posts.forEach(post => {
      post.tags.forEach(tag => {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
      });
    });

    const tags: BlogTag[] = Array.from(tagMap.entries()).map(([name, count]) => ({
      id: this.generateSlug(name),
      name,
      slug: this.generateSlug(name),
      postCount: count,
      createdAt: new Date(),
    }));

    await this.writeJsonFile(TAGS_FILE, tags);
  }

  async getFeaturedPosts(limit: number = 3): Promise<BlogPost[]> {
    const posts = await this.getAllPosts();
    return posts
      .filter(post => post.featured && post.status === 'published')
      .sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime())
      .slice(0, limit);
  }

  async getRecentPosts(limit: number = 5): Promise<BlogPost[]> {
    const posts = await this.getAllPosts();
    return posts
      .filter(post => post.status === 'published')
      .sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime())
      .slice(0, limit);
  }
}

export const blogService = new BlogService();