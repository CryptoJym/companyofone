import express, { Request, Response } from 'express';
import { query, param, body, validationResult } from 'express-validator';
import { blogService } from '../services/blogService';
import { blogAuthMiddleware } from '../middleware/auth';
import { blogRateLimit, blogWriteRateLimit, blogSearchRateLimit } from '../middleware/rateLimiter';
import { 
  BlogQueryParams, 
  CreateBlogPostRequest, 
  UpdateBlogPostRequest 
} from '../types/blog';

export const blogRouter = Router();

// Apply rate limiting to all blog routes
blogRouter.use(blogRateLimit);

// Apply authentication middleware to all routes (it will only check for write operations)
blogRouter.use(blogAuthMiddleware);

// Validation middleware
const handleValidationErrors = (req: Request, res: Response, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

// GET /blog - Get all blog posts with filtering and pagination
blogRouter.get('/', [
  blogSearchRateLimit, // Apply search rate limiting
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('category').optional().isString(),
  query('tag').optional().isString(),
  query('search').optional().isString(),
  query('status').optional().isIn(['draft', 'published', 'archived']),
  query('featured').optional().isBoolean(),
  query('sortBy').optional().isIn(['createdAt', 'updatedAt', 'publishedAt', 'title']),
  query('sortOrder').optional().isIn(['asc', 'desc']),
], handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const queryParams: BlogQueryParams = {
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      category: req.query.category as string,
      tag: req.query.tag as string,
      search: req.query.search as string,
      status: req.query.status as 'draft' | 'published' | 'archived',
      featured: req.query.featured ? req.query.featured === 'true' : undefined,
      sortBy: req.query.sortBy as 'createdAt' | 'updatedAt' | 'publishedAt' | 'title',
      sortOrder: req.query.sortOrder as 'asc' | 'desc',
    };

    const result = await blogService.queryPosts(queryParams);
    
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blog posts',
    });
import { mdxBlogService } from '../services/mdxBlogService';
import { BlogQueryParams } from '../types/blog';

const router = express.Router();

// Helper function to merge results from both services
async function getMergedBlogData(queryParams: BlogQueryParams) {
  const [mdxResponse, jsonResponse] = await Promise.all([
    mdxBlogService.queryPosts(queryParams),
    blogService.queryPosts(queryParams)
  ]);

  // Merge posts from both sources
  const allPosts = [...mdxResponse.posts, ...jsonResponse.posts];
  
  // Sort by publication date (newest first)
  allPosts.sort((a, b) => 
    new Date(b.publishedAt || b.createdAt).getTime() - 
    new Date(a.publishedAt || a.createdAt).getTime()
  );

  // Apply pagination to merged results
  const page = queryParams.page || 1;
  const limit = queryParams.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPosts = allPosts.slice(startIndex, endIndex);

  // Merge categories and tags
  const allCategories = [...mdxResponse.categories, ...jsonResponse.categories];
  const allTags = [...mdxResponse.tags, ...jsonResponse.tags];

  // Deduplicate and merge counts
  const categoryMap = new Map();
  allCategories.forEach(cat => {
    const existing = categoryMap.get(cat.name);
    if (existing) {
      existing.postCount += cat.postCount;
    } else {
      categoryMap.set(cat.name, { ...cat });
    }
  });

  const tagMap = new Map();
  allTags.forEach(tag => {
    const existing = tagMap.get(tag.name);
    if (existing) {
      existing.postCount += tag.postCount;
    } else {
      tagMap.set(tag.name, { ...tag });
    }
  });

  return {
    posts: paginatedPosts,
    pagination: {
      current: page,
      total: allPosts.length,
      pages: Math.ceil(allPosts.length / limit),
      limit,
    },
    categories: Array.from(categoryMap.values()),
    tags: Array.from(tagMap.values()),
  };
}

// Get all blog posts with filtering, pagination, and search
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('category').optional().isString().trim(),
    query('tag').optional().isString().trim(),
    query('search').optional().isString().trim(),
    query('status').optional().isIn(['draft', 'published', 'archived']),
    query('featured').optional().isBoolean(),
    query('sortBy').optional().isIn(['createdAt', 'updatedAt', 'publishedAt', 'title']),
    query('sortOrder').optional().isIn(['asc', 'desc']),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const queryParams: BlogQueryParams = {
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 12,
        category: req.query.category as string,
        tag: req.query.tag as string,
        search: req.query.search as string,
        status: req.query.status as 'draft' | 'published' | 'archived',
        featured: req.query.featured ? req.query.featured === 'true' : undefined,
        sortBy: req.query.sortBy as 'createdAt' | 'updatedAt' | 'publishedAt' | 'title',
        sortOrder: req.query.sortOrder as 'asc' | 'desc',
      };

      const result = await getMergedBlogData(queryParams);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
);

// Get featured blog posts
router.get('/featured', async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
    
    const [mdxFeatured, jsonFeatured] = await Promise.all([
      mdxBlogService.getFeaturedPosts(limit),
      blogService.getFeaturedPosts(limit)
    ]);

    const allFeatured = [...mdxFeatured, ...jsonFeatured];
    allFeatured.sort((a, b) => 
      new Date(b.publishedAt || b.createdAt).getTime() - 
      new Date(a.publishedAt || a.createdAt).getTime()
    );

    res.json({
      success: true,
      data: allFeatured.slice(0, limit),
    });
  } catch (error) {
    console.error('Error fetching featured posts:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Get recent blog posts
router.get('/recent', async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
    
    const [mdxRecent, jsonRecent] = await Promise.all([
      mdxBlogService.getRecentPosts(limit),
      blogService.getRecentPosts(limit)
    ]);

    const allRecent = [...mdxRecent, ...jsonRecent];
    allRecent.sort((a, b) => 
      new Date(b.publishedAt || b.createdAt).getTime() - 
      new Date(a.publishedAt || a.createdAt).getTime()
    );

    res.json({
      success: true,
      data: allRecent.slice(0, limit),
    });
  } catch (error) {
    console.error('Error fetching recent posts:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Get blog post by ID
router.get(
  '/:id',
  [param('id').isString().trim().notEmpty()],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Post ID is required',
        });
      }

      // Try MDX first, then JSON
      let post = await mdxBlogService.getPostById(id);
      if (!post) {
        post = await blogService.getPostById(id);
      }

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Blog post not found',
        });
      }

      res.json({
        success: true,
        data: post,
      });
    } catch (error) {
      console.error('Error fetching blog post:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
);

// Get blog post by slug
router.get(
  '/slug/:slug',
  [param('slug').isString().trim().notEmpty()],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { slug } = req.params;
      if (!slug) {
        return res.status(400).json({
          success: false,
          message: 'Post slug is required',
        });
      }

      // Try MDX first, then JSON
      let post = await mdxBlogService.getPostBySlug(slug);
      if (!post) {
        post = await blogService.getPostBySlug(slug);
      }

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Blog post not found',
        });
      }

      res.json({
        success: true,
        data: post,
      });
    } catch (error) {
      console.error('Error fetching blog post:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
);

// Get MDX content for a specific post (for rendering)
router.get(
  '/mdx/:slug',
  [param('slug').isString().trim().notEmpty()],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { slug } = req.params;
      if (!slug) {
        return res.status(400).json({
          success: false,
          message: 'Post slug is required',
        });
      }

      const mdxContent = await mdxBlogService.getMDXContent(slug);

      if (!mdxContent) {
        return res.status(404).json({
          success: false,
          message: 'MDX content not found',
        });
      }

      res.json({
        success: true,
        data: mdxContent,
      });
    } catch (error) {
      console.error('Error fetching MDX content:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
);

// Get all categories
router.get('/categories', async (req: Request, res: Response) => {
  try {
    const [mdxCategories, jsonCategories] = await Promise.all([
      mdxBlogService.getAllCategories(),
      blogService.getAllCategories()
    ]);

    // Merge and deduplicate categories
    const categoryMap = new Map();
    [...mdxCategories, ...jsonCategories].forEach(cat => {
      const existing = categoryMap.get(cat.name);
      if (existing) {
        existing.postCount += cat.postCount;
      } else {
        categoryMap.set(cat.name, { ...cat });
      }
    });

    res.json({
      success: true,
      data: Array.from(categoryMap.values()),
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// POST /blog - Create new blog post
blogRouter.post('/', [
  blogWriteRateLimit, // Apply write rate limiting
  body('title').isString().notEmpty().isLength({ min: 1, max: 200 }),
  body('content').isString().notEmpty().isLength({ min: 10 }),
  body('excerpt').optional().isString().isLength({ max: 500 }),
  body('tags').optional().isArray(),
  body('categories').optional().isArray(),
  body('featured').optional().isBoolean(),
  body('status').optional().isIn(['draft', 'published']),
  body('author.name').isString().notEmpty(),
  body('author.email').isEmail(),
  body('author.avatar').optional().isString(),
], handleValidationErrors, async (req: Request, res: Response) => {
// Get all tags
router.get('/tags', async (req: Request, res: Response) => {
  try {
    const [mdxTags, jsonTags] = await Promise.all([
      mdxBlogService.getAllTags(),
      blogService.getAllTags()
    ]);

    // Merge and deduplicate tags
    const tagMap = new Map();
    [...mdxTags, ...jsonTags].forEach(tag => {
      const existing = tagMap.get(tag.name);
      if (existing) {
        existing.postCount += tag.postCount;
      } else {
        tagMap.set(tag.name, { ...tag });
      }
    });

    res.json({
      success: true,
      data: Array.from(tagMap.values()),
    });
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// PUT /blog/:id - Update blog post
blogRouter.put('/:id', [
  blogWriteRateLimit, // Apply write rate limiting
  param('id').isString().notEmpty(),
  body('title').optional().isString().isLength({ min: 1, max: 200 }),
  body('content').optional().isString().isLength({ min: 10 }),
  body('excerpt').optional().isString().isLength({ max: 500 }),
  body('tags').optional().isArray(),
  body('categories').optional().isArray(),
  body('featured').optional().isBoolean(),
  body('status').optional().isIn(['draft', 'published', 'archived']),
], handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData: UpdateBlogPostRequest = { id, ...req.body };
    
    const updatedPost = await blogService.updatePost(updateData);
    
    if (!updatedPost) {
      return res.status(404).json({
// Create new blog post (JSON only for now)
router.post(
  '/',
  [
    body('title').isString().trim().notEmpty(),
    body('content').isString().trim().notEmpty(),
    body('excerpt').optional().isString().trim(),
    body('author.name').isString().trim().notEmpty(),
    body('author.email').isEmail(),
    body('author.avatar').optional().isURL(),
    body('tags').optional().isArray(),
    body('categories').optional().isArray(),
    body('featured').optional().isBoolean(),
    body('status').optional().isIn(['draft', 'published', 'archived']),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const post = await blogService.createPost(req.body);

      res.status(201).json({
        success: true,
        data: post,
      });
    } catch (error) {
      console.error('Error creating blog post:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
);

// DELETE /blog/:id - Delete blog post
blogRouter.delete('/:id', [
  blogWriteRateLimit, // Apply write rate limiting
  param('id').isString().notEmpty(),
], handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await blogService.deletePost(id);
    
    if (!deleted) {
      return res.status(404).json({
// Update blog post (JSON only for now)
router.put(
  '/:id',
  [
    param('id').isString().trim().notEmpty(),
    body('title').optional().isString().trim().notEmpty(),
    body('content').optional().isString().trim().notEmpty(),
    body('excerpt').optional().isString().trim(),
    body('author.name').optional().isString().trim().notEmpty(),
    body('author.email').optional().isEmail(),
    body('author.avatar').optional().isURL(),
    body('tags').optional().isArray(),
    body('categories').optional().isArray(),
    body('featured').optional().isBoolean(),
    body('status').optional().isIn(['draft', 'published', 'archived']),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Post ID is required',
        });
      }

      const post = await blogService.updatePost({ id, ...req.body });

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Blog post not found',
        });
      }

      res.json({
        success: true,
        data: post,
      });
    } catch (error) {
      console.error('Error updating blog post:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
);

// Delete blog post (JSON only for now)
router.delete(
  '/:id',
  [param('id').isString().trim().notEmpty()],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Post ID is required',
        });
      }

      const deleted = await blogService.deletePost(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Blog post not found',
        });
      }

      res.json({
        success: true,
        message: 'Blog post deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting blog post:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
);

export default router;