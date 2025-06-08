import { Router, Request, Response } from 'express';
import { body, query, param, validationResult } from 'express-validator';
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
  }
});

// GET /blog/featured - Get featured blog posts
blogRouter.get('/featured', [
  query('limit').optional().isInt({ min: 1, max: 10 }),
], handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
    const posts = await blogService.getFeaturedPosts(limit);
    
    res.json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error('Error fetching featured posts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured posts',
    });
  }
});

// GET /blog/recent - Get recent blog posts
blogRouter.get('/recent', [
  query('limit').optional().isInt({ min: 1, max: 10 }),
], handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
    const posts = await blogService.getRecentPosts(limit);
    
    res.json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error('Error fetching recent posts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent posts',
    });
  }
});

// GET /blog/categories - Get all categories
blogRouter.get('/categories', async (req: Request, res: Response) => {
  try {
    const categories = await blogService.getAllCategories();
    
    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
    });
  }
});

// GET /blog/tags - Get all tags
blogRouter.get('/tags', async (req: Request, res: Response) => {
  try {
    const tags = await blogService.getAllTags();
    
    res.json({
      success: true,
      data: tags,
    });
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tags',
    });
  }
});

// GET /blog/:id - Get blog post by ID
blogRouter.get('/:id', [
  param('id').isString().notEmpty(),
], handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await blogService.getPostById(id);
    
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
      message: 'Failed to fetch blog post',
    });
  }
});

// GET /blog/slug/:slug - Get blog post by slug
blogRouter.get('/slug/:slug', [
  param('slug').isString().notEmpty(),
], handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const post = await blogService.getPostBySlug(slug);
    
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
      message: 'Failed to fetch blog post',
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
  try {
    const postData: CreateBlogPostRequest = req.body;
    const newPost = await blogService.createPost(postData);
    
    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      data: newPost,
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create blog post',
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
        success: false,
        message: 'Blog post not found',
      });
    }
    
    res.json({
      success: true,
      message: 'Blog post updated successfully',
      data: updatedPost,
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update blog post',
    });
  }
});

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
      message: 'Failed to delete blog post',
    });
  }
});