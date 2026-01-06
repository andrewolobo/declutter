# Credit-Based System Implementation Plan

## Overview
This document outlines the complete implementation plan for a credit-based system where users purchase credits and spend them to create posts. The system ensures transactional integrity, prevents race conditions, and provides comprehensive error handling.

---

## 1. Database Schema Changes

### 1.1 User Credit Balance
Add credit tracking to the Users table:

```prisma
model User {
  // ... existing fields
  creditBalance     Int       @default(0) @map("credit_balance")  // Current credit balance
  totalCreditsEarned Int      @default(0) @map("total_credits_earned")  // Lifetime credits purchased
  lastCreditPurchase DateTime? @map("last_credit_purchase") @db.Timestamptz
  
  // New Relations
  creditTransactions CreditTransaction[]
  creditPurchases    CreditPurchase[]
}
```

### 1.2 Credit Transaction Log
Track all credit movements for audit and reconciliation:

```prisma
model CreditTransaction {
  id              Int       @id @default(autoincrement()) @map("transaction_id")
  userId          Int       @map("user_id")
  transactionType String    @db.VarChar(50) @map("transaction_type") // 'PURCHASE', 'DEDUCTION', 'REFUND', 'ADJUSTMENT'
  amount          Int       @map("amount") // Positive for credit, negative for debit
  balanceBefore   Int       @map("balance_before")
  balanceAfter    Int       @map("balance_after")
  referenceType   String?   @db.VarChar(50) @map("reference_type") // 'POST', 'PURCHASE', 'ADMIN'
  referenceId     Int?      @map("reference_id")
  description     String?   @db.VarChar(500) @map("description")
  metadata        Json?     @map("metadata") // Additional context
  createdBy       Int?      @map("created_by") // For admin adjustments
  createdAt       DateTime  @default(now()) @map("created_at") @db.Timestamptz
  
  // Relations
  user            User      @relation(fields: [userId], references: [id], onDelete: NoAction, onUpdate: NoAction)
  
  @@index([userId, createdAt(sort: Desc)], map: "ix_credit_transactions_user_date")
  @@index([transactionType], map: "ix_credit_transactions_type")
  @@index([referenceType, referenceId], map: "ix_credit_transactions_reference")
  @@map("credit_transactions")
}
```

### 1.3 Credit Purchase Records
Link purchases to credit packages:

```prisma
model CreditPurchase {
  id                   Int       @id @default(autoincrement()) @map("purchase_id")
  userId               Int       @map("user_id")
  pricingTierId        Int       @map("pricing_tier_id")
  creditsAmount        Int       @map("credits_amount")
  amountPaid           Decimal   @db.Decimal(18, 2) @map("amount_paid")
  currency             String    @default("UGX") @db.VarChar(3) @map("currency")
  paymentMethod        String    @db.VarChar(50) @map("payment_method")
  transactionReference String?   @db.VarChar(255) @map("transaction_reference")
  status               String    @db.VarChar(50) @map("status") // 'PENDING', 'COMPLETED', 'FAILED', 'CANCELLED'
  paymentProviderId    String?   @db.VarChar(255) @map("payment_provider_id")
  paymentMetadata      Json?     @map("payment_metadata")
  completedAt          DateTime? @map("completed_at") @db.Timestamptz
  failedAt             DateTime? @map("failed_at") @db.Timestamptz
  failureReason        String?   @db.VarChar(500) @map("failure_reason")
  ipAddress            String?   @db.VarChar(45) @map("ip_address")
  userAgent            String?   @db.VarChar(500) @map("user_agent")
  createdAt            DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt            DateTime  @updatedAt @map("updated_at") @db.Timestamptz
  
  // Relations
  user                 User         @relation(fields: [userId], references: [id], onDelete: NoAction, onUpdate: NoAction)
  pricingTier          PricingTier  @relation(fields: [pricingTierId], references: [id], onDelete: NoAction, onUpdate: NoAction)
  
  @@index([userId, status], map: "ix_credit_purchases_user_status")
  @@index([status, createdAt(sort: Desc)], map: "ix_credit_purchases_status_date")
  @@index([transactionReference], map: "ix_credit_purchases_reference")
  @@map("credit_purchases")
}
```

### 1.4 Updated PricingTier Model
Extend to support credit packages:

```prisma
model PricingTier {
  // ... existing fields
  creditAmount       Int       @map("credit_amount") // Number of credits in this package
  tierType           String    @default("POST") @db.VarChar(50) @map("tier_type") // 'POST', 'CREDIT_PACKAGE'
  isFeatured         Boolean   @default(false) @map("is_featured")
  displayOrder       Int       @default(0) @map("display_order")
  bonusCredits       Int       @default(0) @map("bonus_credits") // Extra credits for promotions
  validityDays       Int?      @map("validity_days") // Optional credit expiry
  
  // New Relations
  creditPurchases    CreditPurchase[]
}
```

### 1.5 Post Credit Tracking
Add credit deduction tracking to posts:

```prisma
model Post {
  // ... existing fields
  creditsCost        Int       @default(0) @map("credits_cost") // Credits deducted for this post
  creditTransactionId Int?     @map("credit_transaction_id") // Reference to deduction transaction
  
  @@index([creditsCost], map: "ix_posts_credits_cost")
}
```

---

## 2. Credit Purchase Flow

### 2.1 Purchase Initiation

**Endpoint**: `POST /api/credits/purchase`

**Request Body**:
```typescript
{
  pricingTierId: number;
  paymentMethod: 'MOBILE_MONEY' | 'CARD' | 'BANK_TRANSFER';
  phoneNumber?: string; // For mobile money
  returnUrl?: string; // Redirect after payment
}
```

**Process**:
1. Validate user authentication
2. Validate pricing tier exists and is active
3. Verify pricing tier is a credit package (`tierType === 'CREDIT_PACKAGE'`)
4. Create `CreditPurchase` record with status 'PENDING'
5. Calculate total credits (base + bonus)
6. Initiate payment with provider (MTN, Airtel, Flutterwave, etc.)
7. Store payment provider response
8. Return purchase ID and payment instructions

**Response**:
```typescript
{
  purchaseId: number;
  status: 'PENDING';
  amount: number;
  currency: string;
  creditsAmount: number;
  paymentInstructions: {
    provider: string;
    reference: string;
    instructions: string;
    expiresAt: string;
  }
}
```

### 2.2 Payment Webhook/Callback

**Endpoint**: `POST /api/webhooks/payment/:provider`

**Process** (Within Database Transaction):
1. Verify webhook signature/authenticity
2. Extract payment status and reference
3. Find corresponding `CreditPurchase` record
4. If payment successful:
   - Begin database transaction
   - Lock user record for update (`SELECT ... FOR UPDATE`)
   - Create `CreditTransaction` with:
     - `transactionType: 'PURCHASE'`
     - `amount: creditsAmount`
     - `balanceBefore: current balance`
     - `balanceAfter: current balance + creditsAmount`
     - `referenceType: 'PURCHASE'`
     - `referenceId: purchaseId`
   - Update `User.creditBalance` += creditsAmount
   - Update `User.totalCreditsEarned` += creditsAmount
   - Update `User.lastCreditPurchase` = now
   - Update `CreditPurchase.status` = 'COMPLETED'
   - Update `CreditPurchase.completedAt` = now
   - Commit transaction
   - Send success notification to user
5. If payment failed:
   - Update `CreditPurchase.status` = 'FAILED'
   - Update `CreditPurchase.failedAt` = now
   - Record failure reason
   - Send failure notification

**Error Handling**:
- Idempotency: Check if credits already added (prevent double-crediting)
- Use unique transaction references
- Log all webhook attempts
- Retry mechanism for failed database operations

### 2.3 Purchase Status Check

**Endpoint**: `GET /api/credits/purchase/:purchaseId`

Returns current status of purchase for user polling.

---

## 3. Credit Deduction During Post Creation

### 3.1 Pre-Creation Validation

**Endpoint**: `POST /api/posts`

**Before Creating Post**:
1. Determine required credits based on `pricingTierId`
2. Query `PricingTier` to get `creditAmount`
3. Check user's `creditBalance` >= required credits
4. If insufficient, return error immediately (fail fast)

### 3.2 Transactional Post Creation

**Process** (Within Database Transaction):
```typescript
async function createPostWithCreditDeduction(postData, userId) {
  return await prisma.$transaction(async (tx) => {
    // 1. Lock user record to prevent concurrent deductions
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { creditBalance: true }
    });
    
    // Use raw query for pessimistic locking
    await tx.$executeRaw`
      SELECT credit_balance FROM users 
      WHERE user_id = ${userId} 
      FOR UPDATE
    `;
    
    // 2. Get pricing tier details
    const pricingTier = await tx.pricingTier.findUnique({
      where: { id: postData.pricingTierId }
    });
    
    if (!pricingTier || !pricingTier.isActive) {
      throw new Error('Invalid pricing tier');
    }
    
    const requiredCredits = pricingTier.creditAmount;
    
    // 3. Verify sufficient balance (double-check with lock)
    if (user.creditBalance < requiredCredits) {
      throw new InsufficientCreditsError(
        `Insufficient credits. Required: ${requiredCredits}, Available: ${user.creditBalance}`
      );
    }
    
    // 4. Create credit transaction record
    const creditTransaction = await tx.creditTransaction.create({
      data: {
        userId: userId,
        transactionType: 'DEDUCTION',
        amount: -requiredCredits, // Negative for deduction
        balanceBefore: user.creditBalance,
        balanceAfter: user.creditBalance - requiredCredits,
        referenceType: 'POST',
        description: `Credits deducted for post: ${postData.title}`,
        metadata: {
          pricingTierId: postData.pricingTierId,
          postTitle: postData.title
        }
      }
    });
    
    // 5. Deduct credits from user balance
    await tx.user.update({
      where: { id: userId },
      data: {
        creditBalance: {
          decrement: requiredCredits
        }
      }
    });
    
    // 6. Create the post with credit tracking
    const post = await tx.post.create({
      data: {
        ...postData,
        creditsCost: requiredCredits,
        creditTransactionId: creditTransaction.id,
        status: 'PUBLISHED', // Or based on schedule
        publishedAt: postData.scheduledPublishTime || new Date()
      }
    });
    
    // 7. Update referenceId in transaction now that we have postId
    await tx.creditTransaction.update({
      where: { id: creditTransaction.id },
      data: { referenceId: post.id }
    });
    
    return {
      post,
      creditTransaction,
      remainingBalance: user.creditBalance - requiredCredits
    };
  }, {
    isolationLevel: 'Serializable', // Highest isolation level
    maxWait: 5000, // Wait up to 5 seconds for lock
    timeout: 10000 // Transaction timeout
  });
}
```

### 3.3 Post Creation Response

```typescript
{
  success: true,
  post: {
    id: number,
    title: string,
    // ... other post fields
  },
  credits: {
    deducted: number,
    remainingBalance: number,
    transactionId: number
  }
}
```

---

## 4. Data Consistency & Transaction Handling

### 4.1 ACID Guarantees

**Atomicity**: 
- All credit operations wrapped in database transactions
- Either all steps succeed or all rollback
- No partial state changes

**Consistency**:
- Credit balance constraints enforced at database level
- Add CHECK constraint: `ALTER TABLE users ADD CONSTRAINT chk_credit_balance CHECK (credit_balance >= 0)`
- Transaction logs always reconcile with balance changes

**Isolation**:
- Use `Serializable` isolation for credit deductions
- Pessimistic locking with `SELECT ... FOR UPDATE`
- Prevents race conditions in concurrent operations

**Durability**:
- All transactions committed to database
- Audit trail in `CreditTransaction` table
- Regular database backups

### 4.2 Concurrency Control

**Problem**: Two posts created simultaneously by same user

**Solution**:
```typescript
// Pessimistic locking approach
const lockedUser = await prisma.$executeRaw`
  SELECT * FROM users 
  WHERE user_id = ${userId} 
  FOR UPDATE NOWAIT
`;

// If lock can't be acquired immediately, fail fast
// Prevents deadlocks and long waits
```

**Alternative** (Optimistic Locking):
```prisma
model User {
  creditBalance Int
  version       Int @default(0) // Optimistic lock version
}

// Update with version check
UPDATE users 
SET credit_balance = credit_balance - ${credits},
    version = version + 1
WHERE user_id = ${userId} 
  AND version = ${currentVersion}
  AND credit_balance >= ${credits}
```

### 4.3 Idempotency

**Purchase Idempotency**:
- Use unique payment provider transaction IDs
- Check if `CreditPurchase` already processed before adding credits
- Prevent webhook replay attacks

```typescript
async function processPaymentWebhook(webhookData) {
  const existingPurchase = await prisma.creditPurchase.findFirst({
    where: {
      transactionReference: webhookData.reference,
      status: 'COMPLETED'
    }
  });
  
  if (existingPurchase) {
    // Already processed, return success without duplicating
    return { success: true, duplicate: true };
  }
  
  // Process payment...
}
```

**Post Creation Idempotency**:
- Use client-generated idempotency key
- Store key with transaction
- Reject duplicate requests with same key

### 4.4 Audit Trail

Every credit movement recorded:
- Purchase completed → Transaction log entry
- Post created → Transaction log entry  
- Admin adjustment → Transaction log entry

**Reconciliation Query**:
```sql
SELECT 
  u.user_id,
  u.credit_balance as current_balance,
  COALESCE(SUM(ct.amount), 0) as calculated_balance
FROM users u
LEFT JOIN credit_transactions ct ON u.user_id = ct.user_id
GROUP BY u.user_id, u.credit_balance
HAVING u.credit_balance != COALESCE(SUM(ct.amount), 0);
```

---

## 5. Error Handling

### 5.1 Insufficient Credits Error

**Custom Error Class**:
```typescript
class InsufficientCreditsError extends Error {
  constructor(
    public required: number,
    public available: number,
    public userId: number
  ) {
    super(`Insufficient credits. Required: ${required}, Available: ${available}`);
    this.name = 'InsufficientCreditsError';
  }
}
```

**API Response**:
```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_CREDITS",
    "message": "You don't have enough credits to create this post",
    "details": {
      "required": 10,
      "available": 5,
      "shortfall": 5
    },
    "actions": [
      {
        "label": "Purchase Credits",
        "endpoint": "/api/credits/packages"
      }
    ]
  }
}
```

### 5.2 Payment Failures

**Scenarios**:
1. User cancels payment
2. Insufficient funds
3. Network timeout
4. Payment provider error

**Handling**:
```typescript
async function handlePaymentFailure(purchaseId, reason) {
  await prisma.creditPurchase.update({
    where: { id: purchaseId },
    data: {
      status: 'FAILED',
      failedAt: new Date(),
      failureReason: reason
    }
  });
  
  // Notify user with retry option
  await sendNotification(userId, {
    type: 'PAYMENT_FAILED',
    message: 'Your credit purchase failed',
    reason: reason,
    retryUrl: `/credits/retry/${purchaseId}`
  });
}
```

### 5.3 Transaction Rollback

**Automatic Rollback**:
- Any error in transaction block triggers rollback
- Database returns to pre-transaction state
- No partial credit deductions

**Rollback Logging**:
```typescript
try {
  await createPostWithCreditDeduction(postData, userId);
} catch (error) {
  logger.error('Post creation failed - transaction rolled back', {
    userId,
    error: error.message,
    postData: sanitize(postData),
    timestamp: new Date()
  });
  
  if (error instanceof InsufficientCreditsError) {
    // User-friendly error
    return formatInsufficientCreditsResponse(error);
  }
  
  // Generic error
  throw error;
}
```

### 5.4 Deadlock Resolution

**Detection**:
```typescript
try {
  await transaction();
} catch (error) {
  if (error.code === 'P2034') { // Prisma deadlock code
    // Retry with exponential backoff
    await retryWithBackoff(transaction, 3);
  }
}
```

**Prevention**:
- Always acquire locks in same order
- Use `NOWAIT` or timeout for lock acquisition
- Keep transactions short

### 5.5 Balance Reconciliation

**Scheduled Job** (Daily):
```typescript
async function reconcileCreditBalances() {
  const discrepancies = await prisma.$queryRaw`
    SELECT 
      u.user_id,
      u.credit_balance,
      COALESCE(SUM(ct.amount), 0) as transaction_sum
    FROM users u
    LEFT JOIN credit_transactions ct ON u.user_id = ct.user_id
    GROUP BY u.user_id
    HAVING u.credit_balance != COALESCE(SUM(ct.amount), 0)
  `;
  
  if (discrepancies.length > 0) {
    // Alert admin
    await alertAdmin({
      type: 'CREDIT_DISCREPANCY',
      affected: discrepancies.length,
      details: discrepancies
    });
    
    // Log for investigation
    logger.error('Credit balance discrepancies found', {
      count: discrepancies.length,
      users: discrepancies
    });
  }
}
```

---

## 6. API Endpoints Specification

### 6.1 Credit Management Endpoints

**Get Credit Balance**
```
GET /api/credits/balance
Response: { balance: number, lastPurchase: string | null }
```

**Get Credit History**
```
GET /api/credits/transactions?page=1&limit=20&type=all
Response: {
  transactions: Array<CreditTransaction>,
  pagination: { total, page, limit, pages }
}
```

**Get Available Credit Packages**
```
GET /api/credits/packages
Response: {
  packages: Array<{
    id: number,
    name: string,
    credits: number,
    bonusCredits: number,
    price: number,
    currency: string,
    description: string,
    isFeatured: boolean
  }>
}
```

**Purchase Credits**
```
POST /api/credits/purchase
Body: {
  pricingTierId: number,
  paymentMethod: string,
  phoneNumber?: string
}
Response: {
  purchaseId: number,
  status: string,
  paymentInstructions: object
}
```

**Check Purchase Status**
```
GET /api/credits/purchase/:purchaseId
Response: {
  purchaseId: number,
  status: 'PENDING' | 'COMPLETED' | 'FAILED',
  credits: number,
  completedAt?: string,
  failureReason?: string
}
```

### 6.2 Post Creation with Credits

**Create Post**
```
POST /api/posts
Body: {
  title: string,
  description: string,
  categoryId: number,
  pricingTierId: number,
  // ... other post fields
}
Response: {
  success: true,
  post: Post,
  credits: {
    deducted: number,
    remaining: number,
    transactionId: number
  }
}
```

**Get Post Creation Cost**
```
GET /api/posts/cost/:pricingTierId
Response: {
  pricingTier: {
    id: number,
    name: string,
    creditsRequired: number,
    visibilityDays: number,
    description: string
  },
  userBalance: number,
  canAfford: boolean,
  shortfall?: number
}
```

---

## 7. Implementation Phases

### Phase 1: Database Setup (Week 1)
- [ ] Create migration for credit-related tables
- [ ] Add credit balance to users table
- [ ] Create credit transaction log table
- [ ] Create credit purchase table
- [ ] Update pricing tiers for credit packages
- [ ] Add database constraints and indexes
- [ ] Test migrations on staging database

### Phase 2: Credit Purchase Flow (Week 2)
- [ ] Implement pricing tier management (admin)
- [ ] Create credit package listing endpoint
- [ ] Implement purchase initiation endpoint
- [ ] Integrate payment provider(s)
- [ ] Implement payment webhook handler
- [ ] Add transaction logging
- [ ] Implement idempotency checks
- [ ] Create purchase status endpoint
- [ ] Write unit tests for purchase flow
- [ ] Write integration tests with mock payment provider

### Phase 3: Credit Deduction System (Week 3)
- [ ] Implement credit balance check service
- [ ] Create transactional post creation service
- [ ] Add pessimistic locking mechanism
- [ ] Implement credit deduction logging
- [ ] Create insufficient credits error handler
- [ ] Add post-credit linking
- [ ] Write unit tests for deduction logic
- [ ] Write integration tests for concurrent deductions
- [ ] Load testing for race conditions

### Phase 4: Balance Management & Monitoring (Week 4)
- [ ] Implement credit balance query endpoints
- [ ] Create transaction history endpoint
- [ ] Build credit reconciliation job
- [ ] Add balance discrepancy alerts
- [ ] Create admin credit adjustment endpoint
- [ ] Implement audit logging
- [ ] Create admin dashboard for credit monitoring
- [ ] Write tests for reconciliation logic

### Phase 5: Error Handling & Edge Cases (Week 5)
- [ ] Implement comprehensive error handling
- [ ] Add retry mechanisms for failed transactions
- [ ] Create user-friendly error messages
- [ ] Implement webhook replay protection
- [ ] Add deadlock detection and recovery
- [ ] Create rollback logging
- [ ] Test all failure scenarios
- [ ] Document error codes and responses

### Phase 6: Frontend Integration (Week 6)
- [ ] Create credit balance display component
- [ ] Build credit purchase modal/page
- [ ] Implement payment flow UI
- [ ] Add insufficient credits messaging
- [ ] Create transaction history page
- [ ] Update post creation flow with credit check
- [ ] Add loading states and error displays
- [ ] Test end-to-end user flows

### Phase 7: Testing & Optimization (Week 7)
- [ ] Comprehensive integration testing
- [ ] Load testing for concurrent operations
- [ ] Performance optimization
- [ ] Security audit
- [ ] Documentation review
- [ ] Staging environment testing
- [ ] User acceptance testing

### Phase 8: Deployment & Monitoring (Week 8)
- [ ] Deploy to production with feature flag
- [ ] Enable monitoring and alerting
- [ ] Gradual rollout to users
- [ ] Monitor for issues
- [ ] Gather user feedback
- [ ] Performance monitoring
- [ ] Final documentation updates

---

## 8. Security Considerations

### 8.1 Payment Security
- Use HTTPS for all payment-related endpoints
- Verify webhook signatures from payment providers
- Store sensitive data encrypted at rest
- Implement rate limiting on purchase endpoints
- Use secure session management
- Log all payment attempts for fraud detection

### 8.2 Credit Manipulation Prevention
- All credit changes require authentication
- Admin adjustments require multi-factor auth
- Audit trail for all credit modifications
- Regular balance reconciliation checks
- Alerts for unusual credit patterns
- Database-level constraints (non-negative balance)

### 8.3 API Security
- JWT authentication for all endpoints
- Rate limiting on credit endpoints
- Input validation and sanitization
- CSRF protection
- SQL injection prevention (parameterized queries)
- Implement request signing for webhooks

---

## 9. Monitoring & Alerts

### 9.1 Key Metrics
- Total credits purchased (daily/monthly)
- Total credits spent (daily/monthly)
- Average credits per user
- Purchase conversion rate
- Failed payment rate
- Balance reconciliation status
- Transaction processing time
- Concurrent transaction load

### 9.2 Alerts
- **Critical**: Credit balance discrepancy detected
- **Critical**: Payment webhook processing failure
- **Warning**: High rate of insufficient credit errors
- **Warning**: Unusual purchase pattern detected
- **Info**: Daily reconciliation complete
- **Info**: Large credit purchase (threshold-based)

### 9.3 Logging
```typescript
// Purchase event
logger.info('Credit purchase completed', {
  userId,
  purchaseId,
  credits,
  amount,
  paymentMethod,
  timestamp
});

// Deduction event
logger.info('Credits deducted for post', {
  userId,
  postId,
  credits,
  remainingBalance,
  timestamp
});

// Reconciliation event
logger.info('Balance reconciliation completed', {
  totalUsers,
  discrepancies,
  timestamp
});
```

---

## 10. Migration Strategy

### 10.1 Existing Users
- All existing users start with 0 credit balance
- Option 1: Give promotional credits to existing users
- Option 2: Allow one free post per user
- Option 3: Grandfather existing users with different rules

### 10.2 Existing Posts
- Existing posts don't require credit deduction
- Mark legacy posts with `creditsCost: 0`
- Distinguish in analytics/reporting

### 10.3 Rollout Plan
1. Deploy database changes
2. Deploy backend with feature flag OFF
3. Test thoroughly in production environment
4. Enable for internal users/beta testers
5. Gradual rollout to percentage of users
6. Monitor metrics and feedback
7. Full rollout when stable

---

## 11. Testing Strategy

### 11.1 Unit Tests
- Credit calculation logic
- Balance validation
- Transaction logging
- Error handling
- Payment processing (mocked)

### 11.2 Integration Tests
- End-to-end purchase flow
- End-to-end post creation with deduction
- Webhook processing
- Concurrent deductions
- Rollback scenarios
- Balance reconciliation

### 11.3 Load Tests
- Concurrent post creation (100+ simultaneous)
- Rapid purchase requests
- Webhook flood handling
- Database lock contention

### 11.4 Edge Cases
- Exactly zero balance
- Exactly required balance
- Negative credit attempts (should fail)
- Duplicate webhook delivery
- Interrupted transactions
- Database connection loss

---

## 12. Documentation Requirements

### 12.1 User Documentation
- How to purchase credits
- Credit package descriptions
- How credits are deducted
- Transaction history access
- FAQ and troubleshooting

### 12.2 API Documentation
- All endpoint specifications
- Request/response examples
- Error codes and meanings
- Authentication requirements
- Rate limits

### 12.3 Admin Documentation
- Credit package management
- Manual adjustment procedures
- Reconciliation process
- Monitoring dashboards
- Troubleshooting guide

### 12.4 Developer Documentation
- Architecture overview
- Database schema
- Transaction flow diagrams
- Code examples
- Testing guidelines

---

## 13. Future Enhancements

### 13.1 Credit Promotions
- Referral bonuses
- First purchase bonus
- Seasonal promotions
- Loyalty rewards
- Bulk purchase discounts

### 13.2 Credit Expiry (Optional)
- Time-based credit expiration
- Expiry notifications
- Grace periods
- Use-it-or-lose-it mechanics

### 13.3 Credit Gifting
- Send credits to other users
- Gift cards/vouchers
- Corporate bulk purchases

### 13.4 Advanced Analytics
- Credit usage patterns
- User segmentation by spend
- Predictive credit needs
- Revenue forecasting

---

## Conclusion

This implementation plan provides a comprehensive, production-ready approach to implementing a credit-based system. The design prioritizes:

1. **Data Integrity**: Transactional guarantees prevent credit loss or duplication
2. **Concurrency Safety**: Locking mechanisms prevent race conditions
3. **Auditability**: Complete transaction history for reconciliation
4. **User Experience**: Clear error messages and smooth purchase flow
5. **Security**: Payment security and fraud prevention
6. **Scalability**: Efficient queries and proper indexing
7. **Maintainability**: Clear code structure and comprehensive testing

The phased implementation approach allows for incremental development, thorough testing, and safe deployment with minimal risk to existing operations.
