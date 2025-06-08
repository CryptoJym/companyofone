#!/usr/bin/env node

/**
 * Company of One - Dynamic Agent Orchestrator
 * 
 * Template for creating orchestrators for other "Of One" sites.
 * Replace Company of One, Solopreneurs and very small business owners, and customize TASK_REGISTRY.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Site-specific configuration
const SITE_CONFIG = {
  name: 'Company of One',  // e.g., 'Director of One'
  domain: 'companyofone.ai',   // e.g., 'directorofone.ai'
  targetAudience: 'Solopreneurs and very small business owners', // e.g., 'one-person department managers'
  primaryColor: '#4169E1',  // Utlyze blue (keep consistent)
  accentColor: '#E74C3C',  // Customize per site type
};

// Task Registry with Dependencies
const TASK_REGISTRY = {
  // Design & Branding Tasks
  'design-system': {
    id: 'design-system',
    name: `Create ${SITE_CONFIG.name} Design System`,
    path: 'frontend/src/styles/design-system.ts',
    dependencies: [],
    estimatedHours: 3,
    priority: 'CRITICAL',
    prompt: `Create design system for ${SITE_CONFIG.name}. Use Utlyze blue (#4169E1) as primary, ${SITE_CONFIG.accentColor} as accent. Target audience: ${SITE_CONFIG.targetAudience}. Clean, professional, trustworthy design.`,
    completionCheck: () => fs.existsSync('frontend/src/styles/design-system.ts')
  },

  // Content Creation Tasks
  'content-strategy': {
    id: 'content-strategy',
    name: `Develop ${SITE_CONFIG.name} Content`,
    dependencies: [],
    estimatedHours: 4,
    priority: 'CRITICAL',
    prompt: `Create content for ${SITE_CONFIG.name}. Target: ${SITE_CONFIG.targetAudience}. Pain points: Working long hours for little growth, Unsure which investments pay off, Drowning in administrative tasks, Feeling isolated or lacking feedback. Solution: Comprehensive methodology and tools for thriving as a business of one. Focus on One-on-one consulting, AI assistant suite access, Customized growth roadmap, Community and support.`,
    completionCheck: () => fs.existsSync('content/copy/homepage.md')
  },

  // Frontend Development Tasks
  'nextjs-setup': {
    id: 'nextjs-setup',
    name: 'Initialize Next.js Project',
    dependencies: [],
    estimatedHours: 2,
    priority: 'CRITICAL',
    prompt: 'Initialize Next.js 14 with TypeScript, Tailwind CSS, App Router. Standard Utlyze setup.',
    completionCheck: () => fs.existsSync('frontend/package.json')
  },

  'component-library': {
    id: 'component-library',
    name: 'Build Component Library',
    dependencies: ['nextjs-setup', 'design-system'],
    estimatedHours: 4,
    priority: 'HIGH',
    prompt: 'Create reusable components using design system. Standard Utlyze component set.',
    completionCheck: () => fs.existsSync('frontend/src/components/ui/Button.tsx')
  },

  'landing-page': {
    id: 'landing-page',
    name: `Build ${SITE_CONFIG.name} Landing Page`,
    dependencies: ['component-library', 'content-strategy'],
    estimatedHours: 4,
    priority: 'CRITICAL',
    prompt: `Build landing page for ${SITE_CONFIG.name}. Hero, pain points, solution, features, testimonials, CTAs. Multiple consultation CTAs.`,
    completionCheck: () => {
      // Check if actual landing page content exists, not just default Next.js page
      const pagePath = 'frontend/app/page.tsx';
      if (!fs.existsSync(pagePath)) return false;
      const content = fs.readFileSync(pagePath, 'utf8');
      return content.includes('Company of One') || content.includes('Solopreneur');
    }
  },

  // Backend Tasks
  'api-setup': {
    id: 'api-setup',
    name: 'Setup API Infrastructure',
    dependencies: [],
    estimatedHours: 3,
    priority: 'HIGH',
    prompt: 'Standard Express.js API setup with TypeScript. Vercel-ready.',
    completionCheck: () => fs.existsSync('backend/src/api/server.ts')
  },

  // Integration Tasks
  'api-integration': {
    id: 'api-integration',
    name: 'Frontend-Backend Integration',
    dependencies: ['landing-page', 'api-setup'],
    estimatedHours: 3,
    priority: 'HIGH',
    prompt: 'Connect frontend forms to backend API. Implement contact form submission, newsletter signup, and consultation booking. Add proper error handling and loading states.',
    completionCheck: () => fs.existsSync('frontend/src/services/api.ts')
  },

  // SEO & Performance Tasks
  'seo-optimization': {
    id: 'seo-optimization',
    name: 'SEO & Meta Tags Implementation',
    dependencies: ['landing-page'],
    estimatedHours: 3,
    priority: 'HIGH',
    prompt: 'Implement comprehensive SEO. Add meta tags, Open Graph, Twitter cards, structured data (JSON-LD), sitemap.xml, robots.txt. Optimize for "company of one", "solopreneur tools", "one person business".',
    completionCheck: () => fs.existsSync('frontend/src/app/sitemap.ts')
  },

  // Testing Tasks
  'testing-setup': {
    id: 'testing-setup',
    name: 'Testing Infrastructure',
    dependencies: ['component-library'],
    estimatedHours: 4,
    priority: 'MEDIUM',
    prompt: 'Set up Jest, React Testing Library, and Cypress. Write unit tests for components, integration tests for API endpoints, and E2E tests for critical user flows (contact form, CTA clicks).',
    completionCheck: () => fs.existsSync('frontend/jest.config.js')
  },

  // DevOps Tasks
  'devops-setup': {
    id: 'devops-setup',
    name: 'CI/CD & Monitoring Setup',
    dependencies: ['landing-page'],
    estimatedHours: 3,
    priority: 'MEDIUM',
    prompt: 'Configure GitHub Actions for CI/CD. Set up Vercel deployment, environment variables, preview deployments. Add Sentry for error tracking and Vercel Analytics.',
    completionCheck: () => fs.existsSync('.github/workflows/ci.yml')
  },

  // Enhancement Tasks
  'ui-enhancements': {
    id: 'ui-enhancements',
    name: 'UI Polish & Animations',
    dependencies: ['landing-page'],
    estimatedHours: 3,
    priority: 'LOW',
    prompt: 'Add Framer Motion animations, smooth scrolling, hover effects, loading skeletons, and micro-interactions. Implement dark mode toggle. Ensure all interactions feel premium.',
    completionCheck: () => fs.existsSync('frontend/src/components/ui/AnimatedSection.tsx')
  },

  // Content Expansion Tasks
  'blog-setup': {
    id: 'blog-setup',
    name: 'Blog Infrastructure',
    dependencies: ['landing-page'],
    estimatedHours: 4,
    priority: 'MEDIUM',
    prompt: 'Create blog using MDX. Set up blog listing page, individual post pages, categories, and tags. Use the blog post outlines from content strategy.',
    completionCheck: () => fs.existsSync('frontend/src/app/blog/page.tsx')
  },

  // Analytics Tasks
  'analytics-setup': {
    id: 'analytics-setup',
    name: 'Analytics & Tracking',
    dependencies: ['landing-page'],
    estimatedHours: 2,
    priority: 'MEDIUM',
    prompt: 'Implement Google Analytics 4, Facebook Pixel, and custom event tracking. Track form submissions, CTA clicks, scroll depth, and time on page. GDPR compliant with cookie consent.',
    completionCheck: () => fs.existsSync('frontend/src/components/Analytics.tsx')
  },

  // ========== PHASE 2: BUSINESS ACCELERATION TASKS ==========
  
  // Deployment & Infrastructure
  'production-deployment': {
    id: 'production-deployment',
    name: 'Production Deployment & Optimization',
    dependencies: ['devops-setup'],
    estimatedHours: 4,
    priority: 'CRITICAL',
    prompt: `You are an elite DevOps engineer. Deploy Company of One to production on Vercel with: custom domain setup, SSL, CDN optimization, environment variables, preview deployments. Optimize build times, implement caching strategies, setup database if needed (Supabase/Planetscale). Configure auto-scaling and ensure 99.9% uptime. You know production deployment inside out - make this bulletproof.`,
    completionCheck: () => fs.existsSync('.vercel/project.json')
  },

  // Email Automation System
  'email-automation': {
    id: 'email-automation',
    name: 'Email Automation & Drip Campaigns',
    dependencies: ['api-integration'],
    estimatedHours: 5,
    priority: 'HIGH',
    prompt: `You are a marketing automation expert. Build a complete email automation system using SendGrid/Resend API. Implement: welcome series (5 emails), nurture sequence (10 emails), consultation booking follow-ups, abandoned form recovery. Create beautiful HTML email templates matching our design system. Set up triggers, delays, and smart segmentation. You understand conversion psychology - make these emails convert solopreneurs into clients.`,
    completionCheck: () => fs.existsSync('backend/src/services/email-automation.ts')
  },

  // Lead Management Dashboard
  'lead-dashboard': {
    id: 'lead-dashboard',
    name: 'Lead Management Dashboard',
    dependencies: ['landing-page', 'api-integration'],
    estimatedHours: 6,
    priority: 'HIGH',
    prompt: `You are a full-stack product engineer. Build a secure admin dashboard at /admin with authentication (NextAuth.js). Features: lead list with filters/search, lead details with timeline, consultation scheduling calendar, email history, conversion tracking, revenue analytics, export to CSV. Use our component library, make it beautiful and functional. You build products users love - make this dashboard indispensable for managing a solopreneur consultancy.`,
    completionCheck: () => fs.existsSync('frontend/src/app/admin/page.tsx')
  },

  // Content Generation System
  'content-engine': {
    id: 'content-engine',
    name: 'AI Content Generation Engine',
    dependencies: ['blog-setup'],
    estimatedHours: 5,
    priority: 'MEDIUM',
    prompt: `You are an AI systems architect. Build a content generation system that creates blog posts from our outlines. Integrate OpenAI API to generate full articles maintaining our brand voice. Features: outline-to-article generation, SEO optimization, automatic internal linking, image suggestions, social media posts generation. Create 5 initial blog posts. You understand both AI and content marketing - make this system produce content that ranks and converts.`,
    completionCheck: () => fs.existsSync('backend/src/services/content-generator.ts')
  },

  // Performance & Security
  'performance-security': {
    id: 'performance-security',
    name: 'Performance & Security Hardening',
    dependencies: ['production-deployment'],
    estimatedHours: 4,
    priority: 'HIGH',
    prompt: `You are a performance and security expert. Optimize Company of One for speed and security. Performance: implement lazy loading, code splitting, image optimization (WebP/AVIF), resource hints, service worker for offline. Target 100 Lighthouse score. Security: implement CSP headers, rate limiting, DDoS protection, input sanitization, OWASP best practices. You protect and accelerate - make this site fast and fortress-like.`,
    completionCheck: () => fs.existsSync('frontend/public/sw.js')
  },

  // Conversion Optimization
  'conversion-optimization': {
    id: 'conversion-optimization',
    name: 'Conversion Rate Optimization System',
    dependencies: ['analytics-setup'],
    estimatedHours: 4,
    priority: 'HIGH',
    prompt: `You are a CRO specialist and behavioral psychologist. Implement advanced conversion optimization: A/B testing framework (Optimizely/custom), heatmap tracking, session recordings integration, exit-intent popups, social proof notifications (recent signups), urgency/scarcity elements, personalization based on traffic source. You understand human decision-making - make every element drive conversions.`,
    completionCheck: () => fs.existsSync('frontend/src/services/ab-testing.ts')
  },

  // Automation Workflows
  'business-automation': {
    id: 'business-automation',
    name: 'Business Process Automation',
    dependencies: ['lead-dashboard', 'email-automation'],
    estimatedHours: 5,
    priority: 'MEDIUM',
    prompt: `You are a business automation architect. Build automated workflows: Zapier/Make.com webhooks, automated invoice generation (Stripe integration), consultation booking with Calendly/Cal.com API, CRM integration (Airtable/Notion API), automated social media posting, lead scoring system, automated follow-up sequences. You eliminate repetitive tasks - help solopreneurs focus on high-value work.`,
    completionCheck: () => fs.existsSync('backend/src/services/automation-workflows.ts')
  },

  // Mobile & PWA
  'mobile-pwa': {
    id: 'mobile-pwa',
    name: 'Mobile App & PWA Development',
    dependencies: ['production-deployment'],
    estimatedHours: 4,
    priority: 'MEDIUM',
    prompt: `You are a mobile development expert. Transform Company of One into a Progressive Web App. Implement: app manifest, offline functionality, push notifications, add-to-homescreen, mobile-specific UI optimizations, touch gestures, native app-like transitions. Consider React Native/Capacitor for app stores. You create delightful mobile experiences - make this feel native on every device.`,
    completionCheck: () => fs.existsSync('frontend/public/manifest.json')
  },

  // Advanced Analytics Dashboard
  'analytics-dashboard': {
    id: 'analytics-dashboard',
    name: 'Real-time Analytics Dashboard',
    dependencies: ['analytics-setup', 'lead-dashboard'],
    estimatedHours: 5,
    priority: 'MEDIUM',
    prompt: `You are a data visualization expert. Build a real-time analytics dashboard showing: visitor flow, conversion funnels, revenue metrics, content performance, traffic sources, user behavior cohorts, predictive analytics (churn risk, LTV). Use Chart.js/Recharts for beautiful visualizations. Implement WebSocket for real-time updates. You make data actionable - help solopreneurs make informed decisions.`,
    completionCheck: () => fs.existsSync('frontend/src/app/admin/analytics/page.tsx')
  },

  // AI Assistant Integration
  'ai-assistant': {
    id: 'ai-assistant',
    name: 'AI Business Assistant Integration',
    dependencies: ['landing-page'],
    estimatedHours: 6,
    priority: 'HIGH',
    prompt: `You are an AI integration specialist. Build an AI-powered business assistant chatbot. Features: answer visitor questions, qualify leads, book consultations, provide personalized recommendations, collect feedback. Use OpenAI/Anthropic API with RAG for business-specific knowledge. Beautiful chat UI with typing indicators, suggested responses. You create helpful AI experiences - make this assistant genuinely useful for solopreneurs and their clients.`,
    completionCheck: () => fs.existsSync('frontend/src/components/AIAssistant.tsx')
  },

  // Scaling Infrastructure
  'scaling-infrastructure': {
    id: 'scaling-infrastructure',
    name: 'Multi-tenant & Scaling Architecture',
    dependencies: ['production-deployment', 'lead-dashboard'],
    estimatedHours: 6,
    priority: 'LOW',
    prompt: `You are a scaling architect. Prepare Company of One for growth: implement multi-tenant architecture (multiple solopreneurs can use the platform), user authentication system, subscription billing (Stripe), usage-based limits, tenant isolation, data partitioning, horizontal scaling setup. You build for the future - make this platform ready to serve thousands of solopreneurs.`,
    completionCheck: () => fs.existsSync('backend/src/services/multi-tenant.ts')
  },

  // Add more tasks as needed...
};

// Standard orchestrator functions (same as CEO of One)
function findReadyTasks() {
  const readyTasks = [];
  const completedTasks = new Set();
  
  for (const [taskId, task] of Object.entries(TASK_REGISTRY)) {
    if (task.completionCheck && task.completionCheck()) {
      completedTasks.add(taskId);
    }
  }
  
  for (const [taskId, task] of Object.entries(TASK_REGISTRY)) {
    if (completedTasks.has(taskId)) continue;
    
    const dependenciesMet = task.dependencies.every(dep => completedTasks.has(dep));
    if (dependenciesMet) {
      readyTasks.push(task);
    }
  }
  
  const priorityOrder = { 'CRITICAL': 0, 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3 };
  readyTasks.sort((a, b) => {
    return (priorityOrder[a.priority] || 3) - (priorityOrder[b.priority] || 3);
  });
  
  return { readyTasks, completedTasks };
}

function generateAgentCommands(tasks) {
  const commands = [];
  
  tasks.forEach((task, index) => {
    const command = {
      terminal: index + 1,
      name: task.name,
      command: `cd "${process.cwd()}" && CURSOR_BACKGROUND_AGENT_PROMPT="${task.prompt}" npm run background`,
      estimatedHours: task.estimatedHours,
      priority: task.priority
    };
    commands.push(command);
  });
  
  return commands;
}

function main() {
  console.log(`🚀 ${SITE_CONFIG.name} - Dynamic Agent Orchestrator\n`);
  console.log('Analyzing project state...\n');
  
  const { readyTasks, completedTasks } = findReadyTasks();
  const totalTasks = Object.keys(TASK_REGISTRY).length;
  const blockedTasks = totalTasks - completedTasks.size - readyTasks.length;
  
  console.log(`📊 Task Status:`);
  console.log(`   - Total tasks: ${totalTasks}`);
  console.log(`   - Completed: ${completedTasks.size}`);
  console.log(`   - Ready to start: ${readyTasks.length}`);
  console.log(`   - Blocked: ${blockedTasks}\n`);
  
  if (completedTasks.size > 0) {
    console.log('✅ Completed Tasks:');
    for (const taskId of completedTasks) {
      console.log(`   - ${TASK_REGISTRY[taskId].name}`);
    }
    console.log('');
  }
  
  if (readyTasks.length === 0) {
    if (completedTasks.size === totalTasks) {
      console.log(`🎉 All tasks completed! ${SITE_CONFIG.name} is ready for launch.`);
    } else {
      console.log('⏸️  No tasks are currently ready. Some tasks may be blocked by dependencies.');
    }
    return;
  }
  
  console.log(`🤖 Deploy ${readyTasks.length} Agents Right Now!\n`);
  
  const commands = generateAgentCommands(readyTasks);
  const totalHours = commands.reduce((sum, cmd) => sum + cmd.estimatedHours, 0);
  const maxHours = Math.max(...commands.map(c => c.estimatedHours));
  
  console.log(`⏱️  Estimated time: ${maxHours} hours (running in parallel)`);
  console.log(`📈 Total work: ${totalHours} hours compressed into parallel execution\n`);
  
  console.log('─'.repeat(80));
  commands.forEach(cmd => {
    console.log(`\n### Agent ${cmd.terminal}: ${cmd.name}`);
    console.log(`Priority: ${cmd.priority} | Estimated: ${cmd.estimatedHours} hours`);
    console.log('```bash');
    console.log(cmd.command);
    console.log('```');
  });
  console.log('\n' + '─'.repeat(80));
  
  console.log('\n📋 Instructions:');
  console.log('1. Open ' + commands.length + ' terminal windows or Cursor background agents');
  console.log('2. Copy and run each command above');
  console.log('3. Agents will work autonomously in parallel');
  console.log('4. Run this orchestrator again to see newly available tasks');
  
  const stateFile = path.join(process.cwd(), '.agent-orchestrator-state.json');
  const state = {
    timestamp: new Date().toISOString(),
    projectName: SITE_CONFIG.name,
    completedTasks: Array.from(completedTasks),
    readyTasks: readyTasks.map(t => t.id),
    blockedTasks,
    totalTasks,
    estimatedCompletion: `${maxHours} hours`
  };
  
  fs.writeFileSync(stateFile, JSON.stringify(state, null, 2));
  console.log(`\n💾 State saved to ${stateFile}`);
}

if (require.main === module) {
  main();
}

module.exports = { findReadyTasks, generateAgentCommands, TASK_REGISTRY, SITE_CONFIG };