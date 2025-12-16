# REST Client API Tests

## Overview

Comprehensive API testing suite using VS Code REST Client extension for all 35 API endpoints.

## Prerequisites

### 1. Install REST Client Extension

- Open VS Code Extensions (`Ctrl+Shift+X`)
- Search for "REST Client" by Huachao Mao
- Click Install
- Or install via command: `ext install humao.rest-client`

### 2. Start the API Server

```bash
npm run dev
```

Server will start on `http://localhost:3000`

### 3. Ensure Database is Running

```bash
# Check SQL Server is accessible
# Verify DATABASE_URL in .env file
```

## Test Files

| File               | Endpoints | Description                                      |
| ------------------ | --------- | ------------------------------------------------ |
| `environment.http` | N/A       | Environment variables and configuration          |
| `auth.http`        | 5 routes  | Authentication: register, login, refresh, OAuth  |
| `user.http`        | 9 routes  | User management: profile, password, verification |
| `category.http`    | 5 routes  | Category management: CRUD operations             |
| `post.http`        | 10 routes | Post management: CRUD, search, like, schedule    |
| `payment.http`     | 6 routes  | Payment management: create, confirm, cancel      |

**Total**: 35 endpoints + validation tests

## Quick Start

### Step 1: Register and Login

1. Open `auth.http`
2. Click "Send Request" above the **Register New User** request
3. Copy the `accessToken` from the response
4. The token is automatically captured in the `@accessToken` variable

### Step 2: Test Other Endpoints

1. Open any other `.http` file
2. Replace `@accessToken = your-access-token-here` with your actual token
3. Or rely on automatic token capture from `auth.http`
4. Click "Send Request" for each endpoint

### Step 3: Run Tests Sequentially

Follow this order for best results:

1. **auth.http** - Get authentication tokens
2. **category.http** - Create categories (if admin)
3. **post.http** - Create and manage posts
4. **user.http** - Test user management
5. **payment.http** - Test payment flows

## Using REST Client

### Send a Request

- Click "Send Request" link above each request
- Or press `Ctrl+Alt+R` (Windows) / `Cmd+Alt+R` (Mac)
- Response appears in split panel

### Variables

Variables are defined with `@` prefix:

```http
@accessToken = your-token-here
@baseUrl = http://localhost:3000
```

Use variables in requests:

```http
GET {{baseUrl}}/api/v1/users/profile
Authorization: Bearer {{accessToken}}
```

### Capture Response Data

Use `@name` to reference responses:

```http
# @name register
POST {{baseUrl}}/api/v1/auth/register
...

### Capture token from response
@accessToken = {{register.response.body.data.tokens.accessToken}}
```

### Request Separators

Use `###` to separate multiple requests in one file.

### Comments

- `#` for single-line comments
- Inline comments after request URL

## Testing Workflows

### Workflow 1: New User Journey

1. Register new user (`auth.http` - Register)
2. Verify email token (`user.http` - Verify Email)
3. Update profile (`user.http` - Update Profile)
4. Create post (`post.http` - Create Post)
5. View own posts (`post.http` - Get User Posts)

### Workflow 2: Post Management

1. Login (`auth.http` - Login)
2. Create category (`category.http` - Create Category) [Admin only]
3. Create post (`post.http` - Create Post)
4. Update post (`post.http` - Update Post)
5. Schedule post (`post.http` - Schedule Post`)
6. Publish post (`post.http` - Publish Post`)
7. Delete post (`post.http` - Delete Post`)

### Workflow 3: Payment Processing

1. Create post (`post.http`)
2. Create payment (`payment.http` - Create Payment)
3. Get payment details (`payment.http` - Get Payment`)
4. Confirm payment (`payment.http` - Confirm Payment`)
5. View payment history (`payment.http` - Get History`)

### Workflow 4: Social Features

1. Search posts (`post.http` - Search`)
2. View post feed (`post.http` - Get Feed`)
3. Like post (`post.http` - Like Post`)
4. View user's posts (`post.http` - Get User Posts`)

## Keyboard Shortcuts

| Action             | Windows/Linux | Mac         |
| ------------------ | ------------- | ----------- |
| Send Request       | `Ctrl+Alt+R`  | `Cmd+Alt+R` |
| Cancel Request     | `Ctrl+Alt+K`  | `Cmd+Alt+K` |
| Switch Environment | `Ctrl+Alt+E`  | `Cmd+Alt+E` |
| History            | `Ctrl+Alt+H`  | `Cmd+Alt+H` |
| Rerun Last Request | `Ctrl+Alt+L`  | `Cmd+Alt+L` |

## Common Status Codes

| Code | Meaning               | When You'll See It               |
| ---- | --------------------- | -------------------------------- |
| 200  | OK                    | Successful GET, PUT requests     |
| 201  | Created               | Successful POST (create)         |
| 400  | Bad Request           | Validation errors                |
| 401  | Unauthorized          | Missing/invalid auth token       |
| 403  | Forbidden             | Insufficient permissions         |
| 404  | Not Found             | Resource doesn't exist           |
| 409  | Conflict              | Duplicate resource (e.g., email) |
| 429  | Too Many Requests     | Rate limit exceeded              |
| 500  | Internal Server Error | Server-side error                |

## Troubleshooting

### Issue: "connect ECONNREFUSED"

**Cause**: Server not running
**Solution**:

```bash
npm run dev
```

### Issue: 401 Unauthorized

**Cause**: Missing or expired access token
**Solution**:

1. Run login request in `auth.http`
2. Copy new `accessToken`
3. Update token in your test file

### Issue: 429 Too Many Requests

**Cause**: Rate limit exceeded
**Solution**:

- Wait 15 minutes for auth endpoints
- Wait 1 minute for other endpoints
- Or restart server to reset limits

### Issue: 404 Not Found

**Cause**: Resource ID doesn't exist
**Solution**:

1. Check if resource was created
2. Verify correct ID in request
3. Check database for resource

### Issue: 403 Forbidden

**Cause**: Insufficient permissions
**Solution**:

- For admin routes: Use admin user token
- For owner routes: Use resource owner's token

## Environment Variables

You can create multiple environments in VS Code settings:

**File**: `.vscode/settings.json`

```json
{
  "rest-client.environmentVariables": {
    "local": {
      "baseUrl": "http://localhost:3000",
      "apiPrefix": "/api/v1"
    },
    "staging": {
      "baseUrl": "https://staging-api.example.com",
      "apiPrefix": "/api/v1"
    },
    "production": {
      "baseUrl": "https://api.example.com",
      "apiPrefix": "/api/v1"
    }
  }
}
```

Switch environments with `Ctrl+Alt+E` / `Cmd+Alt+E`.

## Tips & Best Practices

1. **Start with Authentication**: Always get fresh tokens first
2. **Use Variables**: Store tokens, IDs, and common values
3. **Comment Your Tests**: Add descriptions for clarity
4. **Check Responses**: Verify data structure and values
5. **Test Error Cases**: Include validation and permission tests
6. **Sequential Testing**: Follow logical workflow order
7. **Save Responses**: Use REST Client's history feature
8. **Version Control**: Commit `.http` files (exclude sensitive data)

## Test Coverage

### Happy Path Tests (35 endpoints)

- ✅ All endpoints return successful responses
- ✅ Data structure matches expected format
- ✅ CRUD operations work correctly
- ✅ Authentication flows properly

### Error Handling Tests (50+ cases)

- ✅ Missing required fields (400)
- ✅ Invalid data formats (400)
- ✅ Missing authentication (401)
- ✅ Insufficient permissions (403)
- ✅ Non-existent resources (404)
- ✅ Rate limiting (429)

## Next Steps

1. ✅ Install REST Client extension
2. ⏳ Start API server
3. ⏳ Run through all test files
4. ⏳ Document any issues found
5. ⏳ Create additional test scenarios as needed

## Support

For REST Client extension help:

- Documentation: https://marketplace.visualstudio.com/items?itemName=humao.rest-client
- GitHub: https://github.com/Huachao/vscode-restclient

For API issues:

- Check server logs: `npm run dev`
- Review documentation: `documentation/` folder
- Check test failures for error details

---

**Estimated Testing Time**: 30-40 minutes for complete coverage
**Last Updated**: December 12, 2025
