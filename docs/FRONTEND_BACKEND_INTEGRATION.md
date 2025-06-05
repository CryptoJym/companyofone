# Frontend-Backend Integration Documentation

## Overview

This document describes the frontend-backend integration implemented for the Company of One project. The integration connects the Next.js frontend with the Express.js backend API.

## Integration Components

### 1. API Client (`frontend/src/lib/api.ts`)

A centralized API client that handles all communication between frontend and backend:

- **Features:**
  - Type-safe interfaces for API requests/responses
  - Centralized error handling
  - JSON request/response handling
  - Configurable base URL

- **Endpoints:**
  - `POST /api/v1/contact` - Contact form submission
  - `POST /api/v1/consultation` - Consultation booking
  - `GET /api/v1/contact/info` - Contact information
  - `GET /health` - Health check

### 2. Form Components

#### Contact Form (`frontend/src/components/forms/ContactForm.tsx`)
- Full contact form with validation
- Handles name, email, subject, message, and business type
- Real-time error display and success messaging
- Integrates with backend contact API

#### Consultation Form (`frontend/src/components/forms/ConsultationForm.tsx`)
- Streamlined consultation booking form
- Handles name, email, business type, and goals
- Success state management
- Direct integration with consultation API

### 3. Landing Page Integration

#### Consultation Section (`frontend/src/components/sections/ConsultationSection.tsx`)
- Dedicated section for consultation form
- Embedded directly in main landing page
- Benefit highlights and trust badges
- Responsive design with form and benefits side-by-side

#### Updated Landing Page (`frontend/app/page.tsx`)
- Consultation section integrated between Pricing and FAQ
- Real functional forms replace placeholder CTAs
- End-to-end user flow from landing to form submission

## Backend API Endpoints

### Contact Endpoint (`/api/v1/contact`)
- **Method:** POST
- **Validation:** Name, email, subject, message (required), business type (optional)
- **Response:** Success confirmation with ticket ID
- **Error Handling:** Detailed validation error messages

### Consultation Endpoint (`/api/v1/consultation`)
- **Method:** POST  
- **Validation:** Name, email, business type, message (all required)
- **Response:** Success confirmation with confirmation ID
- **Features:** Placeholder for calendar integration and email notifications

### Health Check (`/health`)
- **Method:** GET
- **Purpose:** Verify API availability
- **Response:** Simple health status

## Configuration

### Environment Variables
- **Frontend:** `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:3001`)
- **Backend:** `CORS_ORIGIN` (configured for frontend domains)

### CORS Configuration
Backend is configured to accept requests from:
- `http://localhost:3000` (development)
- `https://companyofone.ai` (production)

## Development Setup

### Quick Start
```bash
# Run both frontend and backend
./scripts/dev.sh
```

### Manual Setup
```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm install
npm run dev
```

### Access Points
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Health Check:** http://localhost:3001/health
- **API Info:** http://localhost:3001/api/v1

## Testing the Integration

### Manual Testing
1. Visit http://localhost:3000
2. Scroll to "Get Your Free Business Consultation" section
3. Fill out and submit the consultation form
4. Verify form submission and success message
5. Check backend logs for request processing

### API Testing
```bash
# Test health endpoint
curl http://localhost:3001/health

# Test consultation submission
curl -X POST http://localhost:3001/api/v1/consultation \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com", 
    "businessType": "solopreneur",
    "message": "Test consultation request"
  }'
```

## Features Implemented

✅ **Complete API Client**
- Type-safe request/response handling
- Error management and logging
- Configurable endpoint base URL

✅ **Working Contact Forms**
- Real-time validation
- Success/error state management
- Business type categorization

✅ **Backend Integration** 
- Express.js API with validation
- CORS configuration for frontend
- Structured JSON responses

✅ **Landing Page Integration**
- Consultation form embedded in landing page
- Replace placeholder CTAs with real forms
- End-to-end user journey

✅ **Development Environment**
- Scripts for easy local development
- Both servers configured and running
- Environment variable management

## Next Steps

### Immediate Improvements
1. **Email Integration**: Connect forms to email service (SendGrid, etc.)
2. **Database Storage**: Persist form submissions to database
3. **Calendar Integration**: Book actual consultation appointments
4. **Analytics**: Track form conversions and API usage

### Advanced Features
1. **Real-time Validation**: Client-side validation with backend rules
2. **File Uploads**: Support for attachments in contact forms
3. **Authentication**: User accounts for consultation management
4. **Payment Integration**: Connect pricing plans to payment processing

## Troubleshooting

### Common Issues

**CORS Errors:**
- Verify backend CORS configuration includes frontend URL
- Check that frontend is making requests to correct API URL

**Form Submission Failures:**
- Check backend server is running on port 3001
- Verify API client configuration in frontend
- Check browser network tab for request details

**TypeScript Errors:**
- Ensure all type definitions are properly imported
- Verify API response interfaces match backend responses

### Debug Commands
```bash
# Check if backend is running
curl http://localhost:3001/health

# View backend logs
cd backend && npm run dev

# Check frontend API configuration
grep -r "API_URL" frontend/src/
```