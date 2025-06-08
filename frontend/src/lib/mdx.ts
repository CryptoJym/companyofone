import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { BlogPost } from '@/types/blog';

const postsDirectory = path.join(process.cwd(), 'content/blog');

export interface MDXFrontmatter {
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

export interface MDXContent {
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

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function ensurePostsDirectory(): void {
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true });
  }
}

export function getPostSlugs(): string[] {
  ensurePostsDirectory();
  const files = fs.readdirSync(postsDirectory);
  return files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''));
}

export function getPostBySlug(slug: string): MDXContent | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const stats = readingTime(content);

    return {
      frontmatter: data as MDXFrontmatter,
      content,
      slug,
      readingTime: stats,
    };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

export function getAllPosts(): MDXContent[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is MDXContent => post !== null)
    .filter((post) => post.frontmatter.status !== 'draft')
    .sort((post1, post2) => 
      new Date(post2.frontmatter.publishedAt).getTime() - 
      new Date(post1.frontmatter.publishedAt).getTime()
    );

  return posts;
}

export function getFeaturedPosts(limit: number = 3): MDXContent[] {
  return getAllPosts()
    .filter((post) => post.frontmatter.featured)
    .slice(0, limit);
}

export function getPostsByCategory(category: string, limit?: number): MDXContent[] {
  const posts = getAllPosts().filter((post) =>
    post.frontmatter.categories.includes(category)
  );
  
  return limit ? posts.slice(0, limit) : posts;
}

export function getPostsByTag(tag: string, limit?: number): MDXContent[] {
  const posts = getAllPosts().filter((post) =>
    post.frontmatter.tags.includes(tag)
  );
  
  return limit ? posts.slice(0, limit) : posts;
}

export function searchPosts(query: string): MDXContent[] {
  const searchTerm = query.toLowerCase();
  return getAllPosts().filter((post) => {
    const searchableContent = `
      ${post.frontmatter.title} 
      ${post.frontmatter.excerpt} 
      ${post.content}
      ${post.frontmatter.tags.join(' ')}
      ${post.frontmatter.categories.join(' ')}
    `.toLowerCase();
    
    return searchableContent.includes(searchTerm);
  });
}

export function getAllCategories(): Array<{ name: string; count: number }> {
  const posts = getAllPosts();
  const categoryCount: Record<string, number> = {};

  posts.forEach((post) => {
    post.frontmatter.categories.forEach((category) => {
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });
  });

  return Object.entries(categoryCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function getAllTags(): Array<{ name: string; count: number }> {
  const posts = getAllPosts();
  const tagCount: Record<string, number> = {};

  posts.forEach((post) => {
    post.frontmatter.tags.forEach((tag) => {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
  });

  return Object.entries(tagCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function convertMDXToBlogPost(mdxContent: MDXContent): BlogPost {
  const { frontmatter, slug, readingTime } = mdxContent;
  const now = new Date().toISOString();

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
    createdAt: frontmatter.publishedAt,
    updatedAt: frontmatter.publishedAt,
    publishedAt: frontmatter.publishedAt,
  };
}

export function createMDXFile(
  slug: string,
  frontmatter: MDXFrontmatter,
  content: string
): void {
  ensurePostsDirectory();
  
  const frontmatterYaml = Object.entries(frontmatter)
    .map(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        return `${key}:\n${Object.entries(value)
          .map(([k, v]) => `  ${k}: ${JSON.stringify(v)}`)
          .join('\n')}`;
      }
      if (Array.isArray(value)) {
        return `${key}:\n${value.map(v => `  - ${v}`).join('\n')}`;
      }
      return `${key}: ${JSON.stringify(value)}`;
    })
    .join('\n');

  const fileContent = `---
${frontmatterYaml}
---

${content}`;

  const filePath = path.join(postsDirectory, `${slug}.mdx`);
  fs.writeFileSync(filePath, fileContent, 'utf8');
}

export function extractHeadings(content: string): Array<{ id: string; text: string; level: number }> {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: Array<{ id: string; text: string; level: number }> = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2];
    const id = generateSlug(text);
    headings.push({ id, text, level });
  }

  return headings;
}

export function getRelatedPosts(currentSlug: string, limit: number = 3): MDXContent[] {
  const currentPost = getPostBySlug(currentSlug);
  if (!currentPost) return [];

  const allPosts = getAllPosts().filter(post => post.slug !== currentSlug);
  
  // Find posts with matching categories or tags
  const related = allPosts.filter(post => {
    const hasMatchingCategory = post.frontmatter.categories.some(cat =>
      currentPost.frontmatter.categories.includes(cat)
    );
    const hasMatchingTag = post.frontmatter.tags.some(tag =>
      currentPost.frontmatter.tags.includes(tag)
    );
    return hasMatchingCategory || hasMatchingTag;
  });

  // Sort by relevance (more matching categories/tags first)
  related.sort((a, b) => {
    const aMatches = 
      a.frontmatter.categories.filter(cat => currentPost.frontmatter.categories.includes(cat)).length +
      a.frontmatter.tags.filter(tag => currentPost.frontmatter.tags.includes(tag)).length;
    
    const bMatches = 
      b.frontmatter.categories.filter(cat => currentPost.frontmatter.categories.includes(cat)).length +
      b.frontmatter.tags.filter(tag => currentPost.frontmatter.tags.includes(tag)).length;
    
    return bMatches - aMatches;
  });

  return related.slice(0, limit);
}

export default {
  getPostSlugs,
  getPostBySlug,
  getAllPosts,
  getFeaturedPosts,
  getPostsByCategory,
  getPostsByTag,
  searchPosts,
  getAllCategories,
  getAllTags,
  convertMDXToBlogPost,
  createMDXFile,
  extractHeadings,
  getRelatedPosts,
};