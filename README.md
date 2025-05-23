# 🚀 ResumeRocket Backend

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-5.x-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-API-412991?style=flat-square&logo=openai)](https://openai.com/)

A powerful Node.js + TypeScript backend infrastructure for ResumeRocket - the intelligent career acceleration platform that handles resume analysis, tailoring, cover letter generation, and GitHub portfolio optimization.

## 🔍 Overview

The ResumeRocket backend is built on a scalable microservices-inspired architecture that manages:

- AI-powered resume analysis and scoring
- Intelligent resume tailoring based on job descriptions
- Dynamic cover letter generation with customization options
- User authentication with email/password and GitHub OAuth
- Secure document storage and retrieval with AWS S3
- GitHub repository analysis and portfolio enhancement

## 📦 Project Structure

```
src/
│
├── base_classes/           # Abstract base classes for inheritance patterns
│   ├── BaseController.ts   # Core controller functionality
│   ├── BaseRepository.ts   # Data access patterns
│   └── BaseService.ts      # Business logic foundations
│
├── common_middleware/      # Application-wide middleware components
│   ├── auth.middleware.ts  # JWT authentication and session validation
│   ├── error.middleware.ts # Centralized error handling
│   ├── upload.middleware.ts # Document upload processing
│   └── validation.middleware.ts # Request payload validation
│
├── db/                     # Data persistence layer
│   ├── cover_letter/       # Cover letter CRUD operations
│   ├── extracted_resume/   # Resume parsing and extraction logic
│   ├── login/              # Authentication data services
│   ├── project_analysis/   # GitHub project metadata storage
│   ├── queries/            # Custom database queries
│   ├── report/             # Resume scoring report persistence
│   ├── resume_match/       # Job-resume matching algorithms
│   ├── tailored_resume/    # Personalized resume generation
│   ├── user/               # User profile management
│   ├── user_resume/        # User-resume relationship management
│   ├── connection.ts       # MongoDB connection configuration
│   └── index.ts            # Database initialization
│
├── helpers/                # Utility functions
│   ├── aws.helper.ts       # AWS S3 integration utilities
│   ├── pdf.helper.ts       # PDF manipulation functions
│   ├── resume.helper.ts    # Resume processing utilities
│   └── token.helper.ts     # JWT token management
│
├── interfaces/             # TypeScript type definitions
│   ├── controllers/        # Controller interface definitions
│   ├── requests/           # Request payload types
│   ├── responses/          # Response structure types
│   └── services/           # Service interface contracts
│
├── log/                    # Application log files
├── logger/                 # Logging configuration
│   ├── index.ts            # Logger initialization
│   └── winston.config.ts   # Winston logger setup
│
├── routes/                 # API route definitions
│   ├── auth.routes.ts      # Authentication endpoints
│   ├── cover-letter.routes.ts # Cover letter endpoints
│   ├── media.routes.ts     # File upload endpoints
│   ├── resume.routes.ts    # Resume management endpoints
│   ├── tailored-resume.routes.ts # Resume tailoring endpoints
│   ├── user.routes.ts      # User profile endpoints
│   └── index.ts            # Route registration
│
├── use_cases/              # Core business logic
│   ├── ai/                 # AI integration services
│   ├── auth/               # Authentication logic
│   ├── github/             # GitHub API integration
│   ├── pdf/                # PDF generation services
│   ├── resume/             # Resume processing logic
│   └── user/               # User management services
│
├── app.ts                  # Express application setup
├── config.ts               # Environment configuration
├── server.ts               # Server initialization
└── swagger.ts              # API documentation configuration
```

## 🔐 Authentication System

ResumeRocket implements a comprehensive authentication system:

- **JWT-based Authentication** - Secure token generation and validation
- **GitHub OAuth Integration** - Seamless connection with GitHub accounts
- **Multi-level Authorization** - Role-based access control
- **Secure Password Handling** - bcrypt hashing with appropriate salt rounds
- **Token Refresh Mechanism** - Maintain sessions securely

## 🌐 API Endpoints

All routes are versioned under the base path: `/api/v1`

### 🔑 Authentication

| Method | Path             | Description                   | Auth Required |
| ------ | ---------------- | ----------------------------- | ------------- |
| `POST` | `/auth/github`   | Authenticate via GitHub OAuth | No            |
| `POST` | `/auth/login`    | Email/password login          | No            |
| `POST` | `/auth/register` | Create new user account       | No            |
| `POST` | `/auth/refresh`  | Refresh authentication token  | Yes           |
| `POST` | `/auth/logout`   | Invalidate current session    | Yes           |

### 📄 Cover Letters

| Method   | Path                   | Description                     | Auth Required |
| -------- | ---------------------- | ------------------------------- | ------------- |
| `POST`   | `/cover-letter/create` | Generate new cover letter       | Yes           |
| `GET`    | `/cover-letter/list`   | Retrieve all user cover letters | Yes           |
| `GET`    | `/cover-letter/:id`    | Get specific cover letter       | Yes           |
| `PATCH`  | `/cover-letter/update` | Update existing cover letter    | Yes           |
| `DELETE` | `/cover-letter/:id`    | Delete cover letter             | Yes           |

### 📤 Media Management

| Method | Path                  | Description              | Auth Required |
| ------ | --------------------- | ------------------------ | ------------- |
| `POST` | `/media/upload-doc`   | Upload resume document   | Yes           |
| `GET`  | `/media/download/:id` | Download stored document | Yes           |

### 📑 Resume Management

| Method   | Path              | Description                   | Auth Required |
| -------- | ----------------- | ----------------------------- | ------------- |
| `POST`   | `/resume/create`  | Upload and process new resume | Yes           |
| `GET`    | `/resume/list`    | Get all user resumes          | Yes           |
| `GET`    | `/resume/:id`     | Get specific resume           | Yes           |
| `PATCH`  | `/resume/disable` | Archive/disable resume        | Yes           |
| `DELETE` | `/resume/:id`     | Remove resume                 | Yes           |

### 📊 Resume Analysis

| Method | Path                          | Description                       | Auth Required |
| ------ | ----------------------------- | --------------------------------- | ------------- |
| `POST` | `/resume/report/create`       | Generate resume scoring report    | Yes           |
| `GET`  | `/resume/report/:id`          | Get analysis report by resume ID  | Yes           |
| `POST` | `/resume/cover-letter/create` | Generate cover letter from resume | Yes           |

### 🎯 Tailored Resumes

| Method   | Path                      | Description                    | Auth Required |
| -------- | ------------------------- | ------------------------------ | ------------- |
| `POST`   | `/tailored-resume/create` | Generate job-specific resume   | Yes           |
| `GET`    | `/tailored-resume/list`   | List all tailored resumes      | Yes           |
| `GET`    | `/tailored-resume/:id`    | Get specific tailored resume   | Yes           |
| `POST`   | `/tailored-resume/match`  | Create resume-job match report | Yes           |
| `DELETE` | `/tailored-resume/:id`    | Delete tailored resume         | Yes           |

### 👤 User Management

| Method   | Path                   | Description                 | Auth Required |
| -------- | ---------------------- | --------------------------- | ------------- |
| `GET`    | `/user`                | Get current user profile    | Yes           |
| `GET`    | `/user/:id`            | Get user by ID (admin only) | Yes + Admin   |
| `PATCH`  | `/user/update`         | Update user profile         | Yes           |
| `PATCH`  | `/user/connect-github` | Link GitHub account         | Yes           |
| `DELETE` | `/user`                | Delete user account         | Yes           |

### 🔍 GitHub Project Analysis

| Method | Path                            | Description                   | Auth Required |
| ------ | ------------------------------- | ----------------------------- | ------------- |
| `POST` | `/user/project-analysis/create` | Analyze GitHub project        | Yes           |
| `GET`  | `/user/project-analysis/list`   | List analyzed projects        | Yes           |
| `GET`  | `/user/project-analysis/:id`    | Get specific project analysis | Yes           |

## 🛡️ Middleware Stack

ResumeRocket employs a comprehensive middleware stack:

### Core Middleware

- **Authentication Middleware** - Validates JWT tokens and user sessions
- **Authorization Middleware** - Enforces role-based permissions (`ADMIN_POLICY`, `OWNER_POLICY`)
- **Error Handling Middleware** - Centralizes error processing with appropriate responses
- **Request Logging** - Tracks API usage and performance metrics

### Request Processing

- **Body Parser** - Handles JSON and URL-encoded payloads
- **Multer** - Processes multipart/form-data for file uploads
- **Validation Middleware** - Ensures request payload validity using Joi/Zod
- **Rate Limiting** - Prevents abuse and ensures fair API usage
- **Compression** - Optimizes response payload size
- **CORS** - Configures Cross-Origin Resource Sharing policies

## 🧠 AI Integration

ResumeRocket leverages OpenAI's API for advanced natural language processing:

- **Resume Analysis** - Evaluates resume quality and provides scoring
- **Content Optimization** - Suggests improvements based on industry standards
- **Job Description Matching** - Identifies keyword alignment and skill gaps
- **Custom Prompt Engineering** - Specialized prompts for different document types
- **Content Generation** - Creates tailored resumes and cover letters

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- MongoDB 5.x
- AWS S3 bucket
- OpenAI API key
- GitHub OAuth application

### Installation

```bash
# Clone the repository
git clone https://github.com/Shubhankar-12/resume-grader-user-management
cd resumerocket-backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration details
```

### Configuration

Create a `.env` file with the following variables:

```
# ResumeRocket - Environment Configuration
# Copy this file to .env and replace placeholder values with your actual credentials

# ===========================================
# Server Configuration
# ===========================================
PORT=8010                                   # Application port
NODE_ENV=development                        # Environment (development, production, testing)
REPO_BASE_URL=http://localhost:8010         # Base URL for repository/API

# ===========================================
# Database Configuration
# ===========================================
DB_URI=mongodb://127.0.0.1:27017/resume-grader    # MongoDB connection string
DB_NAME=resume-grader                             # Database name (optional, can be part of URI)
DB_USER=                                          # Database username (if needed)
DB_PASSWORD=                                      # Database password (if needed)

# ===========================================
# Authentication & Security
# ===========================================
OWNER_POLICY_JWT_KEY=your_owner_policy_key       # JWT secret for owner access
ADMIN_POLICY_JWT_KEY=your_admin_policy_key       # JWT secret for admin access
CUSTOMER_POLICY_JWT_KEY=your_customer_policy_key # JWT secret for customer access
PASSWORD_SECRET_KEY=your_password_secret         # Secret for password hashing
JWT_EXPIRATION=7d                                # JWT expiration time
REFRESH_TOKEN_SECRET=your_refresh_token_secret   # Secret for refresh tokens
REFRESH_TOKEN_EXPIRY=30d                         # Refresh token expiry

# ===========================================
# Logging Configuration
# ===========================================
LOG_IN_DB=true                            # Enable database logging
LOG_IN_FILE=true                          # Enable file logging
LOG_LEVEL=info                            # Log level (debug, info, warn, error)
LOG_FILE_PATH=./logs                      # Path for log files

# ===========================================
# AWS S3 Storage Configuration
# ===========================================
ACCESS_KEY_ID=your_aws_access_key_id      # AWS access key ID
SECRET_ACCESS_KEY=your_aws_secret_key     # AWS secret access key
REGION=ap-southeast-2                     # AWS region
AWS_BUCKET_NAME=your_bucket_name          # AWS S3 bucket name
BUCKET_PROXY_URL=https://your-bucket-url.s3.your-region.amazonaws.com # S3 bucket URL

# ===========================================
# GitHub Integration
# ===========================================
GITHUB_CLIENT_ID=your_github_client_id         # GitHub OAuth client ID
GITHUB_CLIENT_SECRET=your_github_client_secret # GitHub OAuth client secret
GITHUB_CALLBACK_URL=http://localhost:8010/api/v1/auth/github/callback # OAuth callback URL

# ===========================================
# OpenAI API Configuration
# ===========================================
OPENAI_API_KEY=your_openai_api_key             # OpenAI API key
OPENAI_MODEL=gpt-4                            # OpenAI model to use
OPENAI_MAX_TOKENS=8192                        # Maximum tokens for OpenAI requests
OPENAI_TEMPERATURE=0.7                        # Temperature for AI responses

# ===========================================
# Email Configuration (Optional)
# ===========================================
SMTP_HOST=smtp.example.com                   # SMTP server host
SMTP_PORT=587                                # SMTP server port
SMTP_USER=your_smtp_username                 # SMTP username
SMTP_PASSWORD=your_smtp_password             # SMTP password
EMAIL_FROM=noreply@resumerocket.com          # From email address

# ===========================================
# Security & Rate Limiting
# ===========================================
RATE_LIMIT_WINDOW=15                         # Rate limit window in minutes
RATE_LIMIT_MAX_REQUESTS=100                  # Maximum requests per window
CORS_ORIGIN=http://localhost:3000            # CORS allowed origin
SESSION_SECRET=your_session_secret           # Session secret for cookie security

# ===========================================
# Feature Flags
# ===========================================
ENABLE_SWAGGER=true                          # Enable Swagger documentation
ENABLE_GITHUB_INTEGRATION=true               # Enable GitHub integration
ENABLE_EMAIL_NOTIFICATIONS=false             # Enable email notifications
```

### Running the Server

```bash
# Development mode with hot reloading
npm run dev

# Build TypeScript
npm run build

# Run production server
npm start

# Run tests
npm test
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test suite
npm test -- --grep "Auth"

# Generate coverage report
npm run test:coverage
```

## 🔄 CI/CD Pipeline

This project uses GitHub Actions for continuous integration:

- **Linting** - Ensures code quality standards
- **Testing** - Runs the test suite
- **Build Verification** - Confirms successful TypeScript compilation
- **Vulnerability Scanning** - Checks for security issues in dependencies
- **Deployment** - Automated deployment to staging/production environments

## 📚 Additional Documentation

- [Database Schema](docs/database-schema.md)
- [Authentication Flow](docs/auth-flow.md)
- [API Documentation](docs/api-docs.md)
- [Deployment Guide](docs/deployment.md)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<p align="center">
  Made with ❤️ 
</p>
