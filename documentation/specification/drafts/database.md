#### Users Table ☑

```sql
CREATE TABLE Users (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    Email NVARCHAR(255) UNIQUE NOT NULL,
    PhoneNumber NVARCHAR(20) NOT NULL,
    PaymentsNumber NVARCHAR(20),
    FullName NVARCHAR(255) NOT NULL,
    PasswordHash NVARCHAR(255), -- NULL for OAuth users
    OAuthProvider NVARCHAR(50), -- 'Google', 'Microsoft', NULL
    OAuthProviderId NVARCHAR(255),
    ProfilePictureURL NVARCHAR(500),
    Location NVARCHAR(255),
    IsActive BIT DEFAULT 1,
    IsAdmin BIT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);
```

#### Categories Table ☑

```sql
CREATE TABLE Categories (
    CategoryID INT PRIMARY KEY IDENTITY(1,1),
    CategoryName NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500),
    CreatedAt DATETIME2 DEFAULT GETDATE()
);
```

#### Posts Table ☑

```sql
CREATE TABLE Posts (
    PostID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL,
    Title NVARCHAR(255) NOT NULL,
    CategoryID INT NOT NULL,
    Brand NVARCHAR(100),
    Description NVARCHAR(MAX) NOT NULL,
    Price DECIMAL(18,2) NOT NULL, -- UGX
    Location NVARCHAR(255) NOT NULL,
    GPSLocation geography,
    DeliveryMethod NVARCHAR(100), -- 'Private Pickup', 'Private Boda', 'SafeBoda'
    ContactNumber NVARCHAR(20) NOT NULL,
    EmailAddress NVARCHAR(255),
    Status NVARCHAR(50) NOT NULL, -- 'Draft', 'Scheduled', 'PendingPayment', 'Active', 'Expired', 'Rejected'
    ScheduledPublishTime DATETIME2,
    PublishedAt DATETIME2,
    ExpiresAt DATETIME2,
    ViewCount INT DEFAULT 0,
    LikeCount INT DEFAULT 0,
    Tier INT,
    InstagramPostID NVARCHAR(255), -- Instagram post identifier
    InstagramPostedAt DATETIME2,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID)
);
```

#### PostImages Table ☑

```sql
CREATE TABLE PostImages (
    ImageID INT PRIMARY KEY IDENTITY(1,1),
    PostID INT NOT NULL,
    ImageURL NVARCHAR(500) NOT NULL,
    DisplayOrder INT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (PostID) REFERENCES Posts(PostID) ON DELETE CASCADE
);
```

#### Likes Table ☑

```sql
CREATE TABLE Likes (
    LikeID INT PRIMARY KEY IDENTITY(1,1),
    PostID INT NOT NULL,
    UserID INT NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (PostID) REFERENCES Posts(PostID) ON DELETE CASCADE,
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    UNIQUE (PostID, UserID) -- Prevent duplicate likes
);
```

#### Payments Table ☑

```sql
CREATE TABLE Payments (
    PaymentID INT PRIMARY KEY IDENTITY(1,1),
    PostID INT NOT NULL,
    UserID INT NOT NULL,
    Amount DECIMAL(18,2) NOT NULL,
    Currency NVARCHAR(3) DEFAULT 'UGX',
    PaymentMethod NVARCHAR(50) NOT NULL, -- 'MobileMoney'
    TransactionReference NVARCHAR(255),
    Status NVARCHAR(50) NOT NULL, -- 'Pending', 'Confirmed', 'Failed'
    ConfirmedAt DATETIME2,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (PostID) REFERENCES Posts(PostID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);
```

#### PricingTiers Table ☑

```sql
CREATE TABLE PricingTiers (
    TierID INT PRIMARY KEY IDENTITY(1,1),
    TierName NVARCHAR(100) NOT NULL,
    VisibilityDays INT NOT NULL,
    Price DECIMAL(18,2) NOT NULL,
    Description NVARCHAR(500),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE()
);
```

#### Indexes (Performance Optimization)

```sql
-- Posts feed queries
CREATE INDEX IX_Posts_Status_PublishedAt ON Posts(Status, PublishedAt DESC);
CREATE INDEX IX_Posts_CategoryID ON Posts(CategoryID);
CREATE INDEX IX_Posts_UserID ON Posts(UserID);

-- Likes queries
CREATE INDEX IX_Likes_PostID ON Likes(PostID);
CREATE INDEX IX_Likes_UserID ON Likes(UserID);

-- User lookup
CREATE INDEX IX_Users_Email ON Users(Email);
CREATE INDEX IX_Users_PhoneNumber ON Users(PhoneNumber);
```

### Messages ☑

```sql
-- Used for storing user messages
CREATE TABLE Messages (
    MessageID INT PRIMARY KEY IDENTITY(1,1),
    SenderID INT NOT NULL,
    RecipientID INT NOT NULL,
    PostID INT NULL, -- Optional: Link to the post being discussed
    MessageContent NVARCHAR(MAX) NOT NULL,
    MessageType NVARCHAR(20) DEFAULT 'text', -- 'text', 'image', 'system'
    AttachmentURL NVARCHAR(500) NULL, -- For images/files
    IsRead BIT DEFAULT 0, -- Track if recipient has read the message
    ReadAt DATETIME2 NULL, -- When the message was read
    IsDeleted BIT DEFAULT 0, -- Soft delete instead of IsActive
    DeletedBy INT NULL, -- Who deleted it (sender/recipient)
    IsEdited BIT DEFAULT 0, -- Track if message was edited
    EditedAt DATETIME2 NULL,
    ParentMessageID INT NULL, -- For replies/threading
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    -- No foreign keys as per your requirements (logical relationships only)
    CONSTRAINT CHK_Messages_DifferentUsers CHECK (SenderID != RecipientID)
);

```

---

#### Views Table ☑

```sql
CREATE TABLE Views (
    ViewID INT PRIMARY KEY IDENTITY(1,1),
    PostID INT NOT NULL,
    UserID INT NULL, -- NULL for anonymous/guest views
    IPAddress NVARCHAR(45) NULL, -- IPv4 or IPv6
    UserAgent NVARCHAR(500) NULL, -- Browser/device info
    ReferrerURL NVARCHAR(500) NULL, -- Where the user came from
    SessionID NVARCHAR(100) NULL, -- Track unique sessions
    ViewDuration INT NULL, -- Time spent viewing in seconds
    IsUnique BIT DEFAULT 1, -- First view from this user/session
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    -- No foreign keys as per your requirements (logical relationships only)
    INDEX IX_Views_PostID (PostID),
    INDEX IX_Views_UserID (UserID),
    INDEX IX_Views_CreatedAt (CreatedAt),
    INDEX IX_Views_SessionID (SessionID),
    INDEX IX_Views_PostID_UserID (PostID, UserID),
    INDEX IX_Views_PostID_IPAddress (PostID, IPAddress)
);
```

---

### View Analytics Table ☑

```sql
CREATE TABLE ViewAnalytics (
    AnalyticsID INT PRIMARY KEY IDENTITY(1,1),
    PostID INT NOT NULL,
    Date DATE NOT NULL, -- Daily aggregation
    TotalViews INT DEFAULT 0,
    UniqueViews INT DEFAULT 0,
    AuthenticatedViews INT DEFAULT 0,
    AnonymousViews INT DEFAULT 0,
    AverageViewDuration INT NULL, -- Average in seconds
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    -- No foreign keys as per your requirements
    UNIQUE (PostID, Date),
    INDEX IX_ViewAnalytics_PostID (PostID),
    INDEX IX_ViewAnalytics_Date (Date DESC)
);
```

---

#### Notes

- Implement this with logical/implicit relationships. Avoid using defined relationship constraints
