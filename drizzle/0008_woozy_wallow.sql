CREATE TABLE `opportunities` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text DEFAULT 'default' NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`type` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`space_id` text,
	`posted_by_id` text NOT NULL,
	`contact_info` text,
	`expires_at` integer,
	`createdAt` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updatedAt` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_opportunities_tenant` ON `opportunities` (`tenant_id`);--> statement-breakpoint
CREATE INDEX `idx_opportunities_type` ON `opportunities` (`type`);--> statement-breakpoint
CREATE INDEX `idx_opportunities_status` ON `opportunities` (`status`);--> statement-breakpoint
CREATE INDEX `idx_opportunities_space` ON `opportunities` (`space_id`);--> statement-breakpoint
CREATE INDEX `idx_opportunities_posted_by` ON `opportunities` (`posted_by_id`);--> statement-breakpoint
CREATE TABLE `opportunity_comments` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text DEFAULT 'default' NOT NULL,
	`opportunity_id` text NOT NULL,
	`user_id` text NOT NULL,
	`content` text NOT NULL,
	`createdAt` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_opp_comments_tenant` ON `opportunity_comments` (`tenant_id`);--> statement-breakpoint
CREATE INDEX `idx_opp_comments_opp` ON `opportunity_comments` (`opportunity_id`);--> statement-breakpoint
CREATE TABLE `spaces` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text DEFAULT 'default' NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`short_description` text,
	`neighborhood` text,
	`address` text,
	`image_url` text,
	`website_url` text,
	`contact_email` text,
	`contact_phone` text,
	`tools` text,
	`is_beginner_friendly` integer DEFAULT false NOT NULL,
	`requires_membership` integer DEFAULT false NOT NULL,
	`organizer_id` text,
	`is_verified` integer DEFAULT false NOT NULL,
	`is_featured` integer DEFAULT false NOT NULL,
	`createdAt` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updatedAt` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_spaces_tenant` ON `spaces` (`tenant_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_spaces_slug` ON `spaces` (`tenant_id`,`slug`);--> statement-breakpoint
CREATE INDEX `idx_spaces_neighborhood` ON `spaces` (`neighborhood`);--> statement-breakpoint
CREATE INDEX `idx_spaces_featured` ON `spaces` (`is_featured`);--> statement-breakpoint
DROP INDEX `members_userId_unique`;--> statement-breakpoint
ALTER TABLE `members` ADD `tenant_id` text DEFAULT 'default' NOT NULL;--> statement-breakpoint
CREATE INDEX `idx_members_tenant` ON `members` (`tenant_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_members_tenant_user` ON `members` (`tenant_id`,`userId`);--> statement-breakpoint
DROP INDEX `users_phone_unique`;--> statement-breakpoint
ALTER TABLE `users` ADD `tenant_id` text DEFAULT 'default' NOT NULL;--> statement-breakpoint
CREATE INDEX `idx_users_tenant` ON `users` (`tenant_id`);--> statement-breakpoint
CREATE INDEX `idx_users_tenant_phone` ON `users` (`tenant_id`,`phone`);--> statement-breakpoint
CREATE INDEX `idx_users_tenant_email` ON `users` (`tenant_id`,`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_users_renaissance_id` ON `users` (`renaissanceId`);--> statement-breakpoint
ALTER TABLE `broadcasts` ADD `tenant_id` text DEFAULT 'default' NOT NULL;--> statement-breakpoint
CREATE INDEX `idx_broadcasts_tenant` ON `broadcasts` (`tenant_id`);--> statement-breakpoint
CREATE INDEX `idx_broadcasts_tenant_status` ON `broadcasts` (`tenant_id`,`status`);--> statement-breakpoint
ALTER TABLE `event_rsvps` ADD `tenant_id` text DEFAULT 'default' NOT NULL;--> statement-breakpoint
CREATE INDEX `idx_rsvps_tenant` ON `event_rsvps` (`tenant_id`);--> statement-breakpoint
CREATE INDEX `idx_rsvps_event` ON `event_rsvps` (`eventId`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_rsvps_event_user` ON `event_rsvps` (`eventId`,`userId`);--> statement-breakpoint
ALTER TABLE `events` ADD `tenant_id` text DEFAULT 'default' NOT NULL;--> statement-breakpoint
CREATE INDEX `idx_events_tenant` ON `events` (`tenant_id`);--> statement-breakpoint
CREATE INDEX `idx_events_tenant_date` ON `events` (`tenant_id`,`eventDate`);--> statement-breakpoint
ALTER TABLE `messages` ADD `tenant_id` text DEFAULT 'default' NOT NULL;--> statement-breakpoint
CREATE INDEX `idx_messages_tenant` ON `messages` (`tenant_id`);--> statement-breakpoint
CREATE INDEX `idx_messages_tenant_created` ON `messages` (`tenant_id`,`createdAt`);--> statement-breakpoint
ALTER TABLE `post_comments` ADD `tenant_id` text DEFAULT 'default' NOT NULL;--> statement-breakpoint
CREATE INDEX `idx_comments_tenant` ON `post_comments` (`tenant_id`);--> statement-breakpoint
CREATE INDEX `idx_comments_post` ON `post_comments` (`postId`);--> statement-breakpoint
ALTER TABLE `post_likes` ADD `tenant_id` text DEFAULT 'default' NOT NULL;--> statement-breakpoint
CREATE INDEX `idx_likes_tenant` ON `post_likes` (`tenant_id`);--> statement-breakpoint
CREATE INDEX `idx_likes_post` ON `post_likes` (`postId`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_likes_post_user` ON `post_likes` (`postId`,`userId`);--> statement-breakpoint
ALTER TABLE `posts` ADD `tenant_id` text DEFAULT 'default' NOT NULL;--> statement-breakpoint
CREATE INDEX `idx_posts_tenant` ON `posts` (`tenant_id`);--> statement-breakpoint
CREATE INDEX `idx_posts_tenant_created` ON `posts` (`tenant_id`,`createdAt`);--> statement-breakpoint
CREATE INDEX `idx_posts_user` ON `posts` (`userId`);