# Card & List Components

This directory contains card and list components for displaying various types of content throughout the application.

## Components

### PostCard

Display post information in various layouts (feed, grid, list).

**Features:**

- Three layout variants: feed, grid, list
- Image carousel for multiple images
- Like button with count
- Price display with currency formatting
- Status badge (active/expired/pending)
- Location and timestamp
- User avatar and name
- Dropdown menu with actions (edit/delete/report)
- Click to view details

**Props:**

```typescript
interface Post {
	id: string;
	title: string;
	description: string;
	price: number;
	images: string[];
	status: 'active' | 'expired' | 'pending';
	location: string;
	createdAt: Date;
	likesCount: number;
	liked: boolean;
	user: {
		id: string;
		name: string;
		avatar?: string;
	};
}

interface PostCardProps {
	post: Post;
	variant?: 'feed' | 'grid' | 'list';
	showUser?: boolean;
	onLike?: () => void;
	onClick?: () => void;
	onEdit?: () => void;
	onDelete?: () => void;
}
```

**Usage:**

```svelte
<script>
	import { PostCard } from '$lib/components/cards';

	const post = {
		id: '1',
		title: 'iPhone 12 Pro Max',
		description: 'Excellent condition, barely used...',
		price: 2500000,
		images: ['/images/iphone1.jpg', '/images/iphone2.jpg'],
		status: 'active',
		location: 'Kampala, Central',
		createdAt: new Date('2024-12-15'),
		likesCount: 24,
		liked: false,
		user: {
			id: 'user1',
			name: 'John Doe',
			avatar: '/avatars/john.jpg'
		}
	};
</script>

<!-- Feed variant (default) -->
<PostCard {post} onClick={() => console.log('Navigate to post')} />

<!-- Grid variant -->
<PostCard {post} variant="grid" />

<!-- List variant -->
<PostCard {post} variant="list" />

<!-- With edit/delete actions -->
<PostCard
	{post}
	onEdit={() => console.log('Edit post')}
	onDelete={() => console.log('Delete post')}
/>
```

---

### PostCardSkeleton

Loading placeholder that matches PostCard dimensions.

**Props:**

```typescript
interface PostCardSkeletonProps {
	variant?: 'feed' | 'grid' | 'list';
	count?: number;
}
```

**Usage:**

```svelte
<script>
	import { PostCardSkeleton } from '$lib/components/cards';
</script>

<!-- Single skeleton -->
<PostCardSkeleton />

<!-- Multiple skeletons -->
<PostCardSkeleton count={3} variant="grid" />
```

---

### UserCard

Display user profile information with stats and follow button.

**Features:**

- Avatar with status indicator
- Name with verified badge
- Bio (optional)
- Stats (posts, followers, following)
- Follow/Unfollow button
- Online status
- Clickable to navigate to profile

**Props:**

```typescript
interface User {
	id: string;
	name: string;
	avatar?: string;
	bio?: string;
	verified?: boolean;
	isOnline?: boolean;
	stats?: {
		posts: number;
		followers: number;
		following?: number;
	};
}

interface UserCardProps {
	user: User;
	showStats?: boolean;
	showBio?: boolean;
	showFollowButton?: boolean;
	following?: boolean;
	onClick?: () => void;
	onFollow?: (following: boolean) => void;
}
```

**Usage:**

```svelte
<script>
	import { UserCard } from '$lib/components/cards';

	const user = {
		id: 'user1',
		name: 'Jane Smith',
		avatar: '/avatars/jane.jpg',
		bio: 'Tech enthusiast | Gadget lover',
		verified: true,
		isOnline: true,
		stats: {
			posts: 145,
			followers: 2340,
			following: 892
		}
	};
</script>

<UserCard
	{user}
	following={false}
	onClick={() => console.log('Navigate to profile')}
	onFollow={(isFollowing) => console.log('Follow status:', isFollowing)}
/>

<!-- Minimal version without stats -->
<UserCard {user} showStats={false} showBio={false} />
```

---

### MessagePreviewCard

Display conversation preview in message list.

**Features:**

- User avatar with online status
- Last message preview (truncated)
- Timestamp with smart formatting
- Unread badge
- Active state highlight
- Read/unread indicator

**Props:**

```typescript
interface Conversation {
	id: string;
	user: {
		id: string;
		name: string;
		avatar?: string;
		isOnline?: boolean;
	};
	lastMessage: {
		content: string;
		timestamp: Date;
		isRead: boolean;
		senderId: string;
	};
	unreadCount: number;
}

interface MessagePreviewCardProps {
	conversation: Conversation;
	active?: boolean;
	onClick?: () => void;
}
```

**Usage:**

```svelte
<script>
	import { MessagePreviewCard } from '$lib/components/cards';

	const conversation = {
		id: 'conv1',
		user: {
			id: 'user2',
			name: 'Mike Johnson',
			avatar: '/avatars/mike.jpg',
			isOnline: true
		},
		lastMessage: {
			content: 'Is the laptop still available?',
			timestamp: new Date(),
			isRead: false,
			senderId: 'user2'
		},
		unreadCount: 3
	};
</script>

<MessagePreviewCard
	{conversation}
	active={false}
	onClick={() => console.log('Open conversation')}
/>
```

---

### NotificationCard

Display notification items with various types and actions.

**Features:**

- Type-based icons (like, comment, message, follow, post, admin)
- Color-coded by type
- User avatar
- Notification message with user name
- Timestamp
- Action button (optional)
- Dismiss button
- Mark as read
- Unread indicator

**Props:**

```typescript
interface Notification {
	id: string;
	type: 'like' | 'comment' | 'message' | 'follow' | 'post' | 'admin';
	user: {
		id: string;
		name: string;
		avatar?: string;
	};
	message: string;
	timestamp: Date;
	isRead: boolean;
	link?: string;
	actionLabel?: string;
}

interface NotificationCardProps {
	notification: Notification;
	onMarkRead?: () => void;
	onDismiss?: () => void;
	onAction?: () => void;
}
```

**Usage:**

```svelte
<script>
	import { NotificationCard } from '$lib/components/cards';

	const notification = {
		id: 'notif1',
		type: 'like',
		user: {
			id: 'user3',
			name: 'Sarah Lee',
			avatar: '/avatars/sarah.jpg'
		},
		message: 'liked your post "iPhone 12 Pro Max"',
		timestamp: new Date(Date.now() - 3600000),
		isRead: false,
		link: '/posts/123',
		actionLabel: 'View Post'
	};
</script>

<NotificationCard
	{notification}
	onMarkRead={() => console.log('Mark as read')}
	onDismiss={() => console.log('Dismiss notification')}
	onAction={() => console.log('View post')}
/>
```

**Type Icons & Colors:**

- `like`: Red heart icon
- `comment`: Blue chat bubble
- `message`: Cyan mail icon
- `follow`: Purple person add icon
- `post`: Green shopping bag icon
- `admin`: Orange admin panel icon

---

### StatCard

Display key metrics and statistics with trend indicators.

**Features:**

- Large value display
- Icon with colored background
- Trend indicator (up/down arrow with percentage)
- Multiple format options (number, currency, percentage)
- Loading state
- Color themes
- Smart number formatting (K, M suffixes)

**Props:**

```typescript
interface StatCardProps {
	title: string;
	value: number | string;
	icon?: string;
	trend?: number;
	trendLabel?: string;
	color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
	format?: 'number' | 'currency' | 'percentage';
	loading?: boolean;
}
```

**Usage:**

```svelte
<script>
	import { StatCard } from '$lib/components/cards';
</script>

<!-- Views stat -->
<StatCard
	title="Total Views"
	value={12543}
	icon="visibility"
	trend={12.5}
	trendLabel="vs last month"
	color="primary"
/>

<!-- Revenue stat -->
<StatCard
	title="Total Revenue"
	value={4560000}
	icon="payments"
	trend={-3.2}
	trendLabel="vs last month"
	color="success"
	format="currency"
/>

<!-- Conversion rate -->
<StatCard
	title="Conversion Rate"
	value={8.4}
	icon="trending_up"
	trend={1.8}
	color="info"
	format="percentage"
/>

<!-- Loading state -->
<StatCard title="Active Posts" value={0} icon="shopping_bag" loading={true} />
```

---

### CategoryCard

Display category with post count for browsing.

**Features:**

- Category icon or image
- Post count badge
- Color-coded or image background
- Hover effects
- Multiple sizes
- Clickable
- Aspect ratio maintained

**Props:**

```typescript
interface Category {
	id: string;
	name: string;
	icon?: string;
	image?: string;
	postCount: number;
	color?: string;
}

interface CategoryCardProps {
	category: Category;
	size?: 'sm' | 'md' | 'lg';
	onClick?: () => void;
}
```

**Usage:**

```svelte
<script>
	import { CategoryCard } from '$lib/components/cards';

	const categories = [
		{
			id: 'electronics',
			name: 'Electronics',
			icon: 'devices',
			postCount: 1234,
			color: 'bg-gradient-to-br from-blue-500 to-blue-600'
		},
		{
			id: 'fashion',
			name: 'Fashion',
			icon: 'checkroom',
			postCount: 856,
			color: 'bg-gradient-to-br from-pink-500 to-pink-600'
		},
		{
			id: 'vehicles',
			name: 'Vehicles',
			image: '/categories/vehicles.jpg',
			postCount: 432
		}
	];
</script>

<!-- Default size -->
<CategoryCard category={categories[0]} onClick={() => console.log('Browse category')} />

<!-- Small size -->
<CategoryCard category={categories[1]} size="sm" />

<!-- Large size with image -->
<CategoryCard category={categories[2]} size="lg" />
```

---

### EmptyState

Display when no data is available with optional CTA.

**Features:**

- Customizable icon
- Title and description
- Optional action button
- Centered layout
- Consistent styling

**Props:**

```typescript
interface EmptyStateProps {
	icon?: string;
	title: string;
	description?: string;
	actionLabel?: string;
	onAction?: () => void;
}
```

**Usage:**

```svelte
<script>
	import { EmptyState } from '$lib/components/cards';
</script>

<!-- No posts -->
<EmptyState
	icon="inbox"
	title="No posts yet"
	description="Start selling by creating your first post"
	actionLabel="Create Post"
	onAction={() => console.log('Navigate to create post')}
/>

<!-- No messages -->
<EmptyState
	icon="chat_bubble_outline"
	title="No messages"
	description="Your inbox is empty. Start a conversation!"
/>

<!-- No search results -->
<EmptyState
	icon="search_off"
	title="No results found"
	description="Try adjusting your search or filters"
	actionLabel="Clear Filters"
	onAction={() => console.log('Clear filters')}
/>

<!-- No notifications -->
<EmptyState
	icon="notifications_none"
	title="All caught up!"
	description="You have no new notifications"
/>
```

---

## Design System

### Color Themes

- **Primary**: Cyan (#13ecec)
- **Success**: Green
- **Warning**: Yellow
- **Danger**: Red
- **Info**: Blue

### Typography

- **Title**: Font bold, size varies by component
- **Body**: Font medium, slate-600 (light) / slate-300 (dark)
- **Meta**: Font regular, small size, slate-500 (light) / slate-400 (dark)

### Spacing

- **Card Padding**: 4 (1rem) standard
- **Gap**: 2-4 (0.5-1rem) for internal spacing
- **Margin**: Use spacing utilities for layout

### Borders & Shadows

- **Border**: 1px solid slate-200 (light) / slate-700 (dark)
- **Radius**: rounded-xl (0.75rem)
- **Shadow**: shadow-sm default, shadow-md on hover

---

## Accessibility

All card components include:

- **Keyboard Navigation**: Tab, Enter, Escape support
- **ARIA Labels**: Descriptive labels for screen readers
- **Focus States**: Clear focus indicators
- **Semantic HTML**: Proper use of article, button, heading tags
- **Status Indicators**: Visual and textual indicators for state

---

## Usage Tips

1. **Layout Variants**: Use PostCard variants based on context:
   - `feed`: Main content feed (full-width)
   - `grid`: Category browsing (compact)
   - `list`: Search results (horizontal)

2. **Loading States**: Always use PostCardSkeleton during data fetching to maintain layout stability

3. **Empty States**: Provide clear guidance with EmptyState when lists are empty

4. **Statistics**: Use StatCard for dashboards and analytics with appropriate formatting

5. **Notifications**: Group NotificationCards by date and provide mark-all-as-read action

6. **Conversations**: Keep MessagePreviewCard list sorted by most recent message

7. **User Cards**: Show follow button only for other users, not for current user

8. **Categories**: Use consistent icons and colors across the app for category recognition
