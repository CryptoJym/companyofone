# Company of One - Backend API

Express.js API backend for Company of One - The solopreneur success hub.

## 🚀 Features

- **Express.js** with TypeScript
- **Vercel-ready** deployment configuration
- **Security** with Helmet, CORS, and rate limiting
- **Validation** with express-validator
- **Error handling** with custom middleware
- **Health checks** for monitoring
- **RESTful API** design

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Vercel CLI (for deployment)

## 🛠️ Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update environment variables in `.env`

## 🏃‍♂️ Development

Run the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## 📚 API Endpoints

### Health Check
- `GET /health` - Basic health check
- `GET /health/ready` - Readiness check

### API v1
- `GET /api/v1` - API information
- `POST /api/v1/consultation` - Book consultation
- `GET /api/v1/resources` - Get resources
- `GET /api/v1/tools` - Get available tools

### Contact
- `POST /api/v1/contact` - Submit contact form
- `GET /api/v1/contact/info` - Get contact information

## 🧪 Testing

Run tests:
```bash
npm test
```

Run linter:
```bash
npm run lint
```

Type check:
```bash
npm run type-check
```

## 📦 Build

Build for production:
```bash
npm run build
```

## 🚀 Deployment

### Vercel Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to link to your Vercel project

### Environment Variables

Set these in your Vercel project settings:
- `NODE_ENV`
- `JWT_SECRET`
- `DATABASE_URL`
- `CORS_ORIGIN`
- Any other production secrets

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── api/
│   │   └── server.ts       # Express app entry point
│   ├── config/
│   │   └── config.ts       # Configuration
│   ├── middleware/
│   │   ├── errorHandler.ts
│   │   ├── notFoundHandler.ts
│   │   └── requestValidator.ts
│   ├── routes/
│   │   ├── api.ts
│   │   ├── contact.ts
│   │   └── health.ts
│   ├── services/          # Business logic
│   ├── types/             # TypeScript types
│   └── utils/             # Utilities
├── .env.example
├── package.json
├── tsconfig.json
└── vercel.json           # Vercel configuration
```

## 🔒 Security

- Helmet for security headers
- CORS configuration
- Rate limiting
- Input validation and sanitization
- Environment variable management

## 📝 License

MIT - Part of the Utlyze "Of One" suite