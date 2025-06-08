import { promises as fs } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { 
  BlogPost, 
  BlogCategory, 
  BlogTag, 
  BlogQueryParams, 
  BlogResponse 
} from '../types/blog';

const MDX_CONTENT_DIR = join(process.cwd(), '..', 'content', 'blog');

interface MDXFrontmatter {
  title: string;
  excerpt: string;
  publishedAt: string;
  author: {
    name: string;
    email: string;
    avatar?: string;
  };
  tags: string[];
  categories: string[];
  featured?: boolean;
  status?: 'draft' | 'published' | 'archived';
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  image?: string;
}

interface MDXContent {
  frontmatter: MDXFrontmatter;
  content: string;
  slug: string;
  readingTime: {
    text: string;
    minutes: number;
    time: number;
    words: number;
  };
}

class MDXBlogService {
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private async ensureContentDirectory(): Promise<void> {
    try {
      await fs.access(MDX_CONTENT_DIR);
    } catch {
      await fs.mkdir(MDX_CONTENT_DIR, { recursive: true });
    }
  }

  private async getMDXFiles(): Promise<string[]> {
    await this.ensureContentDirectory();
    try {
      const files = await fs.readdir(MDX_CONTENT_DIR);
      return files
        .filter((file: string) => file.endsWith('.mdx'))
        .map((file: string) => file.replace(/\.mdx$/, ''));
    } catch {
      return [];
    }
  }

  private async readMDXFile(slug: string): Promise<MDXContent | null> {
    try {
      const filePath = join(MDX_CONTENT_DIR, `${slug}.mdx`);
      const fileContents = await fs.readFile(filePath, 'utf8');
      const { data, content } = matter(fileContents);
      const stats = readingTime(content);

      return {
        frontmatter: data as MDXFrontmatter,
        content,
        slug,
        readingTime: stats,
      };
    } catch (error) {
      console.error(`Error reading MDX file ${slug}:`, error);
      return null;
    }
  }

  private convertMDXToBlogPost(mdxContent: MDXContent): BlogPost {
    const { frontmatter, slug, readingTime } = mdxContent;

    return {
      id: slug,
      title: frontmatter.title,
      slug,
      content: mdxContent.content,
      excerpt: frontmatter.excerpt,
      author: frontmatter.author,
      tags: frontmatter.tags,
      categories: frontmatter.categories,
      featured: frontmatter.featured || false,
      status: frontmatter.status || 'published',
      seo: frontmatter.seo || {},
      readingTime: Math.ceil(readingTime.minutes),
      createdAt: new Date(frontmatter.publishedAt),
      updatedAt: new Date(frontmatter.publishedAt),
      publishedAt: new Date(frontmatter.publishedAt),
    };
  }

  async getAllPosts(): Promise<BlogPost[]> {
    const slugs = await this.getMDXFiles();
    const posts: BlogPost[] = [];

    for (const slug of slugs) {
      const mdxContent = await this.readMDXFile(slug);
      if (mdxContent && mdxContent.frontmatter.status !== 'draft') {
        posts.push(this.convertMDXToBlogPost(mdxContent));
      }
    }

    // Sort by publication date (newest first)
    return posts.sort((a, b) => 
      new Date(b.publishedAt || b.createdAt).getTime() - 
      new Date(a.publishedAt || a.createdAt).getTime()
    );
  }

  async getPostById(id: string): Promise<BlogPost | null> {
    const mdxContent = await this.readMDXFile(id);
    return mdxContent ? this.convertMDXToBlogPost(mdxContent) : null;
  }

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    return this.getPostById(slug);
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
    const sortBy = params.sortBy || 'publishedAt';
    const sortOrder = params.sortOrder || 'desc';
    
    filteredPosts.sort((a, b) => {
      const aValue = a[sortBy as keyof BlogPost] as any;
      const bValue = b[sortBy as keyof BlogPost] as any;
      
      let comparison = 0;
      if (aValue && bValue) {
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          comparison = aValue.localeCompare(bValue);
        } else if (aValue instanceof Date && bValue instanceof Date) {
          comparison = aValue.getTime() - bValue.getTime();
        } else {
          comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        }
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

  async getAllCategories(): Promise<BlogCategory[]> {
    const posts = await this.getAllPosts();
    const categoryMap = new Map<string, number>();

    posts.forEach(post => {
      post.categories.forEach(category => {
        categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
      });
    });

    return Array.from(categoryMap.entries()).map(([name, count]) => ({
      id: this.generateSlug(name),
      name,
      slug: this.generateSlug(name),
      description: '',
      postCount: count,
      createdAt: new Date().toISOString(),
    }));
  }

  async getAllTags(): Promise<BlogTag[]> {
    const posts = await this.getAllPosts();
    const tagMap = new Map<string, number>();

    posts.forEach(post => {
      post.tags.forEach(tag => {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
      });
    });

    return Array.from(tagMap.entries()).map(([name, count]) => ({
      id: this.generateSlug(name),
      name,
      slug: this.generateSlug(name),
      postCount: count,
      createdAt: new Date().toISOString(),
    }));
  }

  async getFeaturedPosts(limit: number = 3): Promise<BlogPost[]> {
    const posts = await this.getAllPosts();
    return posts
      .filter(post => post.featured && post.status === 'published')
      .slice(0, limit);
  }

  async getRecentPosts(limit: number = 5): Promise<BlogPost[]> {
    const posts = await this.getAllPosts();
    return posts
      .filter(post => post.status === 'published')
      .slice(0, limit);
  }

  async getPostsByCategory(category: string, page: number = 1, limit: number = 10): Promise<BlogResponse> {
    return this.queryPosts({ category, page, limit, status: 'published' });
  }

  async getPostsByTag(tag: string, page: number = 1, limit: number = 10): Promise<BlogResponse> {
    return this.queryPosts({ tag, page, limit, status: 'published' });
  }

  async searchPosts(query: string, page: number = 1, limit: number = 10): Promise<BlogResponse> {
    return this.queryPosts({ search: query, page, limit, status: 'published' });
  }

  // Get raw MDX content for rendering
  async getMDXContent(slug: string): Promise<MDXContent | null> {
    return this.readMDXFile(slug);
  }

  // Check if MDX content exists
  async hasMDXContent(): Promise<boolean> {
    const files = await this.getMDXFiles();
    return files.length > 0;
  }
}

export const mdxBlogService = new MDXBlogService();