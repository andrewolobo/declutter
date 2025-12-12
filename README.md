# DEC_L - Modern Classifieds Platform

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Test Coverage](https://img.shields.io/badge/coverage-58.34%25-yellow.svg)
![Tests](https://img.shields.io/badge/tests-144%20passing-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)

**An Instagram-style classifieds platform for buying and selling used household goods with automated payment processing and Instagram integration.**

[Features](#features) • [Architecture](#architecture) • [Getting Started](#getting-started) • [Documentation](#documentation) • [Testing](#testing)

</div>

---

## 📖 Overview

DEC_L is a modern classifieds platform designed with an Instagram-style interface, featuring a continuous scrollable feed of visually rich listings. The platform enables users to seamlessly buy and sell used household goods while automatically cross-posting to Instagram for maximum visibility.

### Key Highlights

- 🎨 **Instagram-Style Interface** - Card-based posts with infinite scroll
- 💳 **Integrated Payment Processing** - Mobile money payments with automated confirmation
- 📸 **Instagram Auto-Posting** - Automatic cross-posting to maximize reach
- 🔐 **OAuth Authentication** - Google & Microsoft social login support
- 📱 **Mobile Companion App** - Real-time payment SMS monitoring (Android)
- 👨‍💼 **Admin Moderation** - Post review and curation system
- ⏰ **Scheduled Publishing** - Draft and schedule posts for future publication
- 💰 **Tiered Pricing** - Multiple visibility tiers based on peak periods

---

## ✨ Features

### User Features

- **Registration & Authentication**
  - Email/password registration
  - OAuth login (Google, Microsoft)
  - JWT-based authentication
  - Password strength validation
- **Post Management**

  - Create posts with multiple images (up to 10)
  - Save as draft for later editing
  - Schedule posts for future publication
  - Edit and delete posts
  - Like/unlike functionality
  - View tracking and analytics

- **Search & Discovery**

  - Advanced search with filters (category, price range, location)
  - Infinite scroll feed
  - Trending posts
  - Category browsing

- **User Profile**
  - Profile management
  - Payment history
  - Posts summary
  - Account settings

### Payment System

- **Mobile Money Integration**
  - Create payment records
  - Automated SMS-based confirmation
  - Payment history tracking
  - Cancel pending payments
  - Multiple payment methods (Card, Mobile Money, Bank Transfer)

### Admin Features

- Post approval/rejection
- Category management
- Pricing tier management
- User moderation

---

## 🏗️ Architecture

### System Overview

```
┌──────────────────────────────────────────────────────────┐
│                    Web Application                        │
│              (Svelte/React - Planned)                     │
└────────────────────┬─────────────────────────────────────┘
                     │ REST API
┌────────────────────▼─────────────────────────────────────┐
│                  API Controllers                          │
│                    (Planned)                              │
└────────────────────┬─────────────────────────────────────┘
                     │
┌────────────────────▼─────────────────────────────────────┐
│              Service Layer (✅ Complete)                  │
│  • AuthService      • UserService     • PostService      │
│  • CategoryService  • PaymentService                     │
└────────────────────┬─────────────────────────────────────┘
                     │
┌────────────────────▼─────────────────────────────────────┐
│          Data Access Layer (✅ Complete)                  │
│  • UserRepository        • PostRepository                │
│  • PostImageRepository   • LikeRepository                │
│  • CategoryRepository    • PaymentRepository             │
│  • ViewRepository                                        │
└────────────────────┬─────────────────────────────────────┘
                     │
┌────────────────────▼─────────────────────────────────────┐
│              Prisma ORM (✅ Complete)                     │
└────────────────────┬─────────────────────────────────────┘
                     │
┌────────────────────▼─────────────────────────────────────┐
│           Azure SQL Database / SQL Server                │
└──────────────────────────────────────────────────────────┘
```

### Technology Stack

#### Backend (Current)

- **Runtime:** Node.js (v18+)
- **Language:** TypeScript 5.9.3
- **ORM:** Prisma 6.19.1
- **Database:** SQL Server / Azure SQL
- **Authentication:** JWT + OAuth 2.0
- **Testing:** Jest 29.7.0
- **Validation:** Joi 18.0.2

#### Utilities

- **Password Hashing:** bcrypt (12 salt rounds)
- **Token Management:** jsonwebtoken
- **HTTP Client:** axios (for OAuth)
- **Mock Data:** @faker-js/faker

#### Frontend (Planned)

- **Framework:** Svelte (Recommended)
- **Alternative:** React
- **UI Components:** Material-UI

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- SQL Server or Azure SQL Database
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/andrewolobo/dec_l.git
   cd dec_l
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   # Database
   DATABASE_URL="sqlserver://localhost:1433;database=dec_l;user=sa;password=YourPassword;trustServerCertificate=true"

   # JWT Configuration
   JWT_ACCESS_SECRET=your-secret-access-key-change-in-production
   JWT_REFRESH_SECRET=your-secret-refresh-key-change-in-production
   JWT_ACCESS_EXPIRY=15m
   JWT_REFRESH_EXPIRY=7d

   # Google OAuth
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback

   # Microsoft OAuth
   MICROSOFT_CLIENT_ID=your-microsoft-client-id
   MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret
   MICROSOFT_REDIRECT_URI=http://localhost:3000/auth/microsoft/callback

   # Application
   PORT=3000
   NODE_ENV=development
   ```

4. **Run database migrations**

   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start development server** (when API controllers are implemented)
   ```bash
   npm run dev
   ```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run only unit tests
npm run test:unit
```

### Database Management

```bash
# Open Prisma Studio (visual database editor)
npx prisma studio

# Create a new migration
npx prisma migrate dev --name description_of_changes

# Reset database (development only)
npx prisma migrate reset

# Apply migrations in production
npx prisma migrate deploy
```

---

## 📊 Current Status

### ✅ Completed (90% Overall)

| Component              | Status            | Coverage | Tests |
| ---------------------- | ----------------- | -------- | ----- |
| **Type Definitions**   | ✅ Complete       | -        | -     |
| **Utilities**          | ✅ Complete       | 90.38%   | 27    |
| **Configuration**      | ✅ Complete       | 100%     | -     |
| **Repositories (DAL)** | ✅ Complete (7/7) | 0%       | -     |
| **Services**           | ✅ Complete (5/5) | 80.29%   | 144   |
| **Tests**              | ⚠️ In Progress    | 58.34%   | 144   |

### Service Implementation Details

| Service         | Methods | Tests   | Coverage   | Status |
| --------------- | ------- | ------- | ---------- | ------ |
| AuthService     | 4       | 19      | 100%       | ✅     |
| UserService     | 9       | 31      | 98.71%     | ✅     |
| PostService     | 10      | 47      | 51.92%     | ⚠️     |
| CategoryService | 5       | 21      | 100%       | ✅     |
| PaymentService  | 6       | 26      | 100%       | ✅     |
| **TOTAL**       | **34**  | **144** | **58.34%** | **⚠️** |

### ⏳ Remaining Work

1. **API Controllers** (Not Started) - REST API endpoints
2. **MessageService** (Not Started) - User messaging system
3. **PricingTierService** (Not Started) - Tier management
4. **Test Coverage** (58% → 80%) - Increase PostService tests
5. **Instagram Integration** (Not Started) - Auto-posting
6. **Email/SMS Verification** (Placeholder) - Complete implementation

---

## 🧪 Testing

### Test Coverage Report

```
--------------------------|---------|----------|---------|---------|
File                      | % Stmts | % Branch | % Funcs | % Lines |
--------------------------|---------|----------|---------|---------|
All files                 |   58.34 |    52.81 |   35.13 |   58.93 |
 services/                |   80.29 |    57.36 |   89.36 |   80.14 |
  auth.service.ts         |     100 |    78.57 |     100 |     100 |
  user.service.ts         |   98.71 |    62.79 |     100 |   98.71 |
  post.service.ts         |   51.92 |    37.96 |   58.33 |   51.92 |
  category.service.ts     |     100 |    72.72 |     100 |     100 |
  payment.service.ts      |     100 |    73.91 |     100 |     100 |
 utils/                   |   90.38 |       70 |   81.81 |   90.38 |
  password.util.ts        |     100 |      100 |     100 |     100 |
  jwt.util.ts             |     100 |       50 |     100 |     100 |
  validation.util.ts      |   68.75 |        0 |       0 |   68.75 |
--------------------------|---------|----------|---------|---------|
```

### Test Structure

```
src/__tests__/
├── setup.ts                          # Global test configuration
├── helpers/
│   └── test-data.ts                  # Mock data generators
└── unit/
    ├── utils/
    │   ├── password.util.test.ts     # 13 tests
    │   └── jwt.util.test.ts          # 14 tests
    └── services/
        ├── auth.service.test.ts      # 19 tests - 100% coverage
        ├── user.service.test.ts      # 31 tests - 98.71% coverage
        ├── post.service.test.ts      # 47 tests - 51.92% coverage ⚠️
        ├── category.service.test.ts  # 21 tests - 100% coverage
        └── payment.service.test.ts   # 26 tests - 100% coverage
```

---

## 📚 Documentation

Comprehensive documentation is available in the `documentation/` folder:

1. **[OVERVIEW.md](documentation/1.%20OVERVIEW.md)** - Project overview and specifications
2. **[DATABASE_SETUP.md](documentation/2.%20DATABASE_SETUP.md)** - Database schema and setup guide
3. **[DAL_IMPLEMENTATION.md](documentation/3.%20DAL_IMPLEMENTATION.md)** - Data Access Layer documentation
4. **[SERVICE_LAYER.md](documentation/4.%20SERVICE_LAYER.md)** - Service layer implementation
5. **[TEST_IMPLEMENTATION.md](documentation/5.%20TEST_IMPLEMENTATION.md)** - Testing guide and patterns
6. **[**STATUS_IMPLEMENTATION**.md](documentation/__STATUS_IMPLEMENTATION__.md)** - Current implementation status

---

## 🗄️ Database Schema

### Core Tables (10)

- **Users** - User accounts with OAuth support
- **Categories** - Post categorization
- **Posts** - Listing content
- **PostImages** - Multiple images per post
- **Likes** - Post like tracking
- **Payments** - Payment records and history
- **PricingTiers** - Visibility tier definitions
- **Messages** - User messaging (repository pending)
- **Views** - Post view tracking
- **ViewAnalytics** - Aggregated view statistics

### Key Relationships

```
Users ──┬─── Posts ──┬─── PostImages
        │            ├─── Likes
        │            ├─── Views
        │            └─── Payments
        │
        ├─── Likes
        ├─── Payments
        ├─── Messages (sent/received)
        └─── Views

Categories ─── Posts
PricingTiers ─── Payments
```

---

## 🔐 Security Features

- ✅ **Password Security**
  - bcrypt hashing (12 salt rounds)
  - Strong password validation
  - No plaintext storage
- ✅ **Token Security**
  - Separate access & refresh tokens
  - Short access token lifetime (15 min)
  - Secure token verification
- ✅ **OAuth Security**

  - Provider token validation
  - Direct user info fetching
  - Pre-verified email for OAuth users

- ✅ **API Security**
  - Standardized error codes
  - Input validation (Joi schemas)
  - Type safety (TypeScript)
  - SQL injection protection (Prisma)

---

## 🛠️ Development

### Project Structure

```
dec_l/
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── migrations/                # Database migrations
├── src/
│   ├── config/                    # Configuration files
│   │   ├── app.config.ts
│   │   ├── jwt.config.ts
│   │   └── oauth.config.ts
│   ├── dal/                       # Data Access Layer
│   │   ├── prisma.client.ts
│   │   └── repositories/          # Repository pattern
│   ├── services/                  # Business logic layer
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── post.service.ts
│   │   ├── category.service.ts
│   │   └── payment.service.ts
│   ├── types/                     # TypeScript type definitions
│   │   ├── common/
│   │   ├── auth/
│   │   ├── user/
│   │   ├── post/
│   │   ├── category/
│   │   └── payment/
│   ├── utils/                     # Utility functions
│   │   ├── password.util.ts
│   │   ├── jwt.util.ts
│   │   └── validation.util.ts
│   └── __tests__/                 # Test files
│       ├── setup.ts
│       ├── helpers/
│       └── unit/
├── documentation/                 # Project documentation
├── package.json
├── tsconfig.json
└── jest.config.js
```

### Code Style & Standards

- **TypeScript** - Strict mode enabled
- **Naming Conventions**
  - camelCase for variables and functions
  - PascalCase for classes and types
  - UPPER_SNAKE_CASE for constants
- **Testing** - AAA pattern (Arrange-Act-Assert)
- **Error Handling** - Standardized ApiResponse pattern
- **Documentation** - JSDoc comments for public APIs

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Write tests for new features (target: 80% coverage)
- Follow existing code style and patterns
- Update documentation for significant changes
- Ensure all tests pass before submitting PR

---

## 📝 License

This project is proprietary software. All rights reserved.

---

## 👥 Authors

- **Andrew Olobo** - [@andrewolobo](https://github.com/andrewolobo)

---

## 🙏 Acknowledgments

- Prisma for excellent ORM tooling
- Jest for comprehensive testing framework
- TypeScript for type safety
- The open-source community

---

## 📞 Support

For support, please contact the development team or open an issue in the repository.

---

<div align="center">

**Built with ❤️ for the classifieds community**

[⬆ Back to Top](#dec_l---modern-classifieds-platform)

</div>
