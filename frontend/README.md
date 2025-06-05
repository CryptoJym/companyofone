# Company of One - Frontend

This is the Next.js 14 frontend for Company of One, built with TypeScript, Tailwind CSS, and following Utlyze design standards.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Icons**: React Icons
- **Deployment**: Vercel-ready

## 📁 Project Structure

```
frontend/
├── app/                 # Next.js App Router pages
├── src/
│   ├── components/     # React components
│   │   ├── ui/        # Reusable UI components
│   │   ├── sections/  # Page sections
│   │   └── layout/    # Layout components
│   ├── lib/           # Utility functions
│   ├── hooks/         # Custom React hooks
│   ├── types/         # TypeScript type definitions
│   └── utils/         # Helper functions
├── public/            # Static assets
└── styles/           # Global styles
```

## 🎨 Design System

- **Primary Color**: #4169E1 (Utlyze Blue)
- **Accent Color**: #E74C3C (Company of One accent)
- **Font**: Inter

## 🔧 Configuration

1. Copy `.env.example` to `.env.local`
2. Update environment variables
3. Configure API endpoints

## 📦 Key Dependencies

- `next`: Next.js framework
- `react` & `react-dom`: React library
- `tailwindcss`: Utility-first CSS framework
- `framer-motion`: Animation library
- `react-icons`: Icon library
- `clsx` & `tailwind-merge`: Utility for conditional classes

## 🚀 Deployment

This project is configured for Vercel deployment:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run clean` - Clean build artifacts

## 🏗️ Component Guidelines

1. Use TypeScript for all components
2. Follow the Utlyze component structure
3. Use the `cn()` utility for className merging
4. Implement responsive design with Tailwind
5. Add proper TypeScript types for all props

---

Part of the Utlyze "Of One" suite
