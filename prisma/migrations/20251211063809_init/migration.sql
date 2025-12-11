BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Users] (
    [UserID] INT NOT NULL IDENTITY(1,1),
    [Email] NVARCHAR(255) NOT NULL,
    [PhoneNumber] NVARCHAR(20) NOT NULL,
    [PaymentsNumber] NVARCHAR(20),
    [FullName] NVARCHAR(255) NOT NULL,
    [PasswordHash] NVARCHAR(255),
    [OAuthProvider] NVARCHAR(50),
    [OAuthProviderId] NVARCHAR(255),
    [ProfilePictureURL] NVARCHAR(500),
    [Location] NVARCHAR(255),
    [IsActive] BIT NOT NULL CONSTRAINT [Users_IsActive_df] DEFAULT 1,
    [IsAdmin] BIT NOT NULL CONSTRAINT [Users_IsAdmin_df] DEFAULT 0,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Users_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Users_pkey] PRIMARY KEY CLUSTERED ([UserID]),
    CONSTRAINT [Users_Email_key] UNIQUE NONCLUSTERED ([Email])
);

-- CreateTable
CREATE TABLE [dbo].[Categories] (
    [CategoryID] INT NOT NULL IDENTITY(1,1),
    [CategoryName] NVARCHAR(100) NOT NULL,
    [Description] NVARCHAR(500),
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Categories_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Categories_pkey] PRIMARY KEY CLUSTERED ([CategoryID])
);

-- CreateTable
CREATE TABLE [dbo].[Posts] (
    [PostID] INT NOT NULL IDENTITY(1,1),
    [UserID] INT NOT NULL,
    [Title] NVARCHAR(255) NOT NULL,
    [CategoryID] INT NOT NULL,
    [Brand] NVARCHAR(100),
    [Description] NVARCHAR(max) NOT NULL,
    [Price] DECIMAL(18,2) NOT NULL,
    [Location] NVARCHAR(255) NOT NULL,
    [GPSLocation] NVARCHAR(1000),
    [DeliveryMethod] NVARCHAR(100),
    [ContactNumber] NVARCHAR(20) NOT NULL,
    [EmailAddress] NVARCHAR(255),
    [Status] NVARCHAR(50) NOT NULL,
    [ScheduledPublishTime] DATETIME2,
    [PublishedAt] DATETIME2,
    [ExpiresAt] DATETIME2,
    [ViewCount] INT NOT NULL CONSTRAINT [Posts_ViewCount_df] DEFAULT 0,
    [LikeCount] INT NOT NULL CONSTRAINT [Posts_LikeCount_df] DEFAULT 0,
    [Tier] INT,
    [InstagramPostID] NVARCHAR(255),
    [InstagramPostedAt] DATETIME2,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Posts_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Posts_pkey] PRIMARY KEY CLUSTERED ([PostID])
);

-- CreateTable
CREATE TABLE [dbo].[PostImages] (
    [ImageID] INT NOT NULL IDENTITY(1,1),
    [PostID] INT NOT NULL,
    [ImageURL] NVARCHAR(500) NOT NULL,
    [DisplayOrder] INT NOT NULL CONSTRAINT [PostImages_DisplayOrder_df] DEFAULT 0,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [PostImages_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PostImages_pkey] PRIMARY KEY CLUSTERED ([ImageID])
);

-- CreateTable
CREATE TABLE [dbo].[Likes] (
    [LikeID] INT NOT NULL IDENTITY(1,1),
    [PostID] INT NOT NULL,
    [UserID] INT NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Likes_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Likes_pkey] PRIMARY KEY CLUSTERED ([LikeID]),
    CONSTRAINT [UQ_Likes_PostID_UserID] UNIQUE NONCLUSTERED ([PostID],[UserID])
);

-- CreateTable
CREATE TABLE [dbo].[Messages] (
    [MessageID] INT NOT NULL IDENTITY(1,1),
    [SenderID] INT NOT NULL,
    [RecipientID] INT NOT NULL,
    [PostID] INT,
    [MessageContent] NVARCHAR(max) NOT NULL,
    [MessageType] NVARCHAR(20) NOT NULL CONSTRAINT [Messages_MessageType_df] DEFAULT 'text',
    [AttachmentURL] NVARCHAR(500),
    [IsRead] BIT NOT NULL CONSTRAINT [Messages_IsRead_df] DEFAULT 0,
    [ReadAt] DATETIME2,
    [IsDeleted] BIT NOT NULL CONSTRAINT [Messages_IsDeleted_df] DEFAULT 0,
    [DeletedBy] INT,
    [IsEdited] BIT NOT NULL CONSTRAINT [Messages_IsEdited_df] DEFAULT 0,
    [EditedAt] DATETIME2,
    [ParentMessageID] INT,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Messages_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Messages_pkey] PRIMARY KEY CLUSTERED ([MessageID])
);

-- CreateTable
CREATE TABLE [dbo].[Payments] (
    [PaymentID] INT NOT NULL IDENTITY(1,1),
    [PostID] INT NOT NULL,
    [UserID] INT NOT NULL,
    [Amount] DECIMAL(18,2) NOT NULL,
    [Currency] NVARCHAR(3) NOT NULL CONSTRAINT [Payments_Currency_df] DEFAULT 'UGX',
    [PaymentMethod] NVARCHAR(50) NOT NULL,
    [TransactionReference] NVARCHAR(255),
    [Status] NVARCHAR(50) NOT NULL,
    [ConfirmedAt] DATETIME2,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Payments_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Payments_pkey] PRIMARY KEY CLUSTERED ([PaymentID])
);

-- CreateTable
CREATE TABLE [dbo].[PricingTiers] (
    [TierID] INT NOT NULL IDENTITY(1,1),
    [TierName] NVARCHAR(100) NOT NULL,
    [VisibilityDays] INT NOT NULL,
    [Price] DECIMAL(18,2) NOT NULL,
    [Description] NVARCHAR(500),
    [IsActive] BIT NOT NULL CONSTRAINT [PricingTiers_IsActive_df] DEFAULT 1,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [PricingTiers_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PricingTiers_pkey] PRIMARY KEY CLUSTERED ([TierID])
);

-- CreateTable
CREATE TABLE [dbo].[Views] (
    [ViewID] INT NOT NULL IDENTITY(1,1),
    [PostID] INT NOT NULL,
    [UserID] INT,
    [IPAddress] NVARCHAR(45),
    [UserAgent] NVARCHAR(500),
    [ReferrerURL] NVARCHAR(500),
    [SessionID] NVARCHAR(100),
    [ViewDuration] INT,
    [IsUnique] BIT NOT NULL CONSTRAINT [Views_IsUnique_df] DEFAULT 1,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Views_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Views_pkey] PRIMARY KEY CLUSTERED ([ViewID])
);

-- CreateTable
CREATE TABLE [dbo].[ViewAnalytics] (
    [AnalyticsID] INT NOT NULL IDENTITY(1,1),
    [PostID] INT NOT NULL,
    [Date] DATE NOT NULL,
    [TotalViews] INT NOT NULL CONSTRAINT [ViewAnalytics_TotalViews_df] DEFAULT 0,
    [UniqueViews] INT NOT NULL CONSTRAINT [ViewAnalytics_UniqueViews_df] DEFAULT 0,
    [AuthenticatedViews] INT NOT NULL CONSTRAINT [ViewAnalytics_AuthenticatedViews_df] DEFAULT 0,
    [AnonymousViews] INT NOT NULL CONSTRAINT [ViewAnalytics_AnonymousViews_df] DEFAULT 0,
    [AverageViewDuration] INT,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [ViewAnalytics_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [ViewAnalytics_pkey] PRIMARY KEY CLUSTERED ([AnalyticsID]),
    CONSTRAINT [UQ_ViewAnalytics_PostID_Date] UNIQUE NONCLUSTERED ([PostID],[Date])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_Users_Email] ON [dbo].[Users]([Email]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_Users_PhoneNumber] ON [dbo].[Users]([PhoneNumber]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_Posts_Status_PublishedAt] ON [dbo].[Posts]([Status], [PublishedAt] DESC);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_Posts_CategoryID] ON [dbo].[Posts]([CategoryID]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_Posts_UserID] ON [dbo].[Posts]([UserID]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_Likes_PostID] ON [dbo].[Likes]([PostID]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_Likes_UserID] ON [dbo].[Likes]([UserID]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_Views_PostID] ON [dbo].[Views]([PostID]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_Views_UserID] ON [dbo].[Views]([UserID]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_Views_CreatedAt] ON [dbo].[Views]([CreatedAt]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_Views_SessionID] ON [dbo].[Views]([SessionID]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_Views_PostID_UserID] ON [dbo].[Views]([PostID], [UserID]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_Views_PostID_IPAddress] ON [dbo].[Views]([PostID], [IPAddress]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_ViewAnalytics_PostID] ON [dbo].[ViewAnalytics]([PostID]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_ViewAnalytics_Date] ON [dbo].[ViewAnalytics]([Date] DESC);

-- AddForeignKey
ALTER TABLE [dbo].[Posts] ADD CONSTRAINT [Posts_UserID_fkey] FOREIGN KEY ([UserID]) REFERENCES [dbo].[Users]([UserID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Posts] ADD CONSTRAINT [Posts_CategoryID_fkey] FOREIGN KEY ([CategoryID]) REFERENCES [dbo].[Categories]([CategoryID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[PostImages] ADD CONSTRAINT [PostImages_PostID_fkey] FOREIGN KEY ([PostID]) REFERENCES [dbo].[Posts]([PostID]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Likes] ADD CONSTRAINT [Likes_PostID_fkey] FOREIGN KEY ([PostID]) REFERENCES [dbo].[Posts]([PostID]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Likes] ADD CONSTRAINT [Likes_UserID_fkey] FOREIGN KEY ([UserID]) REFERENCES [dbo].[Users]([UserID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Messages] ADD CONSTRAINT [Messages_SenderID_fkey] FOREIGN KEY ([SenderID]) REFERENCES [dbo].[Users]([UserID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Messages] ADD CONSTRAINT [Messages_RecipientID_fkey] FOREIGN KEY ([RecipientID]) REFERENCES [dbo].[Users]([UserID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Messages] ADD CONSTRAINT [Messages_PostID_fkey] FOREIGN KEY ([PostID]) REFERENCES [dbo].[Posts]([PostID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Messages] ADD CONSTRAINT [Messages_ParentMessageID_fkey] FOREIGN KEY ([ParentMessageID]) REFERENCES [dbo].[Messages]([MessageID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Payments] ADD CONSTRAINT [Payments_PostID_fkey] FOREIGN KEY ([PostID]) REFERENCES [dbo].[Posts]([PostID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Payments] ADD CONSTRAINT [Payments_UserID_fkey] FOREIGN KEY ([UserID]) REFERENCES [dbo].[Users]([UserID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Views] ADD CONSTRAINT [Views_PostID_fkey] FOREIGN KEY ([PostID]) REFERENCES [dbo].[Posts]([PostID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Views] ADD CONSTRAINT [Views_UserID_fkey] FOREIGN KEY ([UserID]) REFERENCES [dbo].[Users]([UserID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ViewAnalytics] ADD CONSTRAINT [ViewAnalytics_PostID_fkey] FOREIGN KEY ([PostID]) REFERENCES [dbo].[Posts]([PostID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
