#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

const BLOG_DATA_DIR = path.join(process.cwd(), 'backend', 'data', 'blog');
const POSTS_FILE = path.join(BLOG_DATA_DIR, 'posts.json');

// Utility functions
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const calculateReadingTime = (content) => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

// Load posts
const loadPosts = async () => {
  try {
    const data = await fs.readFile(POSTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.log('No posts file found, starting with empty array');
    return [];
  }
};

// Save posts
const savePosts = async (posts) => {
  await fs.mkdir(BLOG_DATA_DIR, { recursive: true });
  await fs.writeFile(POSTS_FILE, JSON.stringify(posts, null, 2));
};

// Commands
const commands = {
  async list() {
    const posts = await loadPosts();
    console.log(`\n📝 Blog Posts (${posts.length} total):\n`);
    
    if (posts.length === 0) {
      console.log('No posts found. Create your first post with: npm run blog:create');
      return;
    }

    posts.forEach((post, index) => {
      const status = post.status === 'published' ? '✅' : 
                   post.status === 'draft' ? '📝' : '📦';
      const featured = post.featured ? '⭐' : '';
      console.log(`${index + 1}. ${status} ${featured} ${post.title}`);
      console.log(`   ID: ${post.id} | Slug: ${post.slug}`);
      console.log(`   Categories: ${post.categories.join(', ')} | Tags: ${post.tags.join(', ')}`);
      console.log(`   Created: ${new Date(post.createdAt).toLocaleDateString()}\n`);
    });
  },

  async create() {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const question = (prompt) => new Promise(resolve => readline.question(prompt, resolve));

    try {
      console.log('\n🆕 Create New Blog Post\n');
      
      const title = await question('Title: ');
      const content = await question('Content (HTML): ');
      const excerpt = await question('Excerpt (optional): ');
      const categories = await question('Categories (comma-separated): ');
      const tags = await question('Tags (comma-separated): ');
      const authorName = await question('Author Name: ');
      const authorEmail = await question('Author Email: ');
      const featured = await question('Featured? (y/n): ');
      const status = await question('Status (draft/published): ');

      const posts = await loadPosts();
      const now = new Date();

      const newPost = {
        id: generateId(),
        title,
        slug: generateSlug(title),
        content,
        excerpt: excerpt || content.substring(0, 160) + '...',
        author: {
          name: authorName,
          email: authorEmail
        },
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
        categories: categories ? categories.split(',').map(cat => cat.trim()) : [],
        featured: featured.toLowerCase() === 'y',
        status: status || 'draft',
        seo: {},
        readingTime: calculateReadingTime(content),
        createdAt: now,
        updatedAt: now,
        publishedAt: status === 'published' ? now : undefined
      };

      posts.push(newPost);
      await savePosts(posts);

      console.log(`\n✅ Blog post created successfully!`);
      console.log(`   ID: ${newPost.id}`);
      console.log(`   Slug: ${newPost.slug}`);
      console.log(`   Status: ${newPost.status}`);
      
    } finally {
      readline.close();
    }
  },

  async publish(postId) {
    if (!postId) {
      console.log('❌ Please provide a post ID: npm run blog:publish <post-id>');
      return;
    }

    const posts = await loadPosts();
    const post = posts.find(p => p.id === postId);

    if (!post) {
      console.log(`❌ Post with ID ${postId} not found`);
      return;
    }

    post.status = 'published';
    post.publishedAt = new Date();
    post.updatedAt = new Date();

    await savePosts(posts);
    console.log(`✅ Post "${post.title}" published successfully!`);
  },

  async delete(postId) {
    if (!postId) {
      console.log('❌ Please provide a post ID: npm run blog:delete <post-id>');
      return;
    }

    const posts = await loadPosts();
    const postIndex = posts.findIndex(p => p.id === postId);

    if (postIndex === -1) {
      console.log(`❌ Post with ID ${postId} not found`);
      return;
    }

    const post = posts[postIndex];
    posts.splice(postIndex, 1);

    await savePosts(posts);
    console.log(`✅ Post "${post.title}" deleted successfully!`);
  },

  async stats() {
    const posts = await loadPosts();
    
    const published = posts.filter(p => p.status === 'published').length;
    const drafts = posts.filter(p => p.status === 'draft').length;
    const featured = posts.filter(p => p.featured).length;
    
    const categories = [...new Set(posts.flatMap(p => p.categories))];
    const tags = [...new Set(posts.flatMap(p => p.tags))];

    console.log('\n📊 Blog Statistics\n');
    console.log(`Total Posts: ${posts.length}`);
    console.log(`Published: ${published}`);
    console.log(`Drafts: ${drafts}`);
    console.log(`Featured: ${featured}`);
    console.log(`Categories: ${categories.length}`);
    console.log(`Tags: ${tags.length}`);
    console.log(`\nCategories: ${categories.join(', ')}`);
    console.log(`Tags: ${tags.join(', ')}\n`);
  }
};

// CLI handler
const command = process.argv[2];
const arg = process.argv[3];

if (!command || !commands[command]) {
  console.log(`
📝 Blog Admin CLI

Available commands:
  list           - List all blog posts
  create         - Create a new blog post (interactive)
  publish <id>   - Publish a draft post
  delete <id>    - Delete a post
  stats          - Show blog statistics

Usage:
  npm run blog:list
  npm run blog:create
  npm run blog:publish <post-id>
  npm run blog:delete <post-id>
  npm run blog:stats
`);
  process.exit(1);
}

// Run command
commands[command](arg).catch(console.error);