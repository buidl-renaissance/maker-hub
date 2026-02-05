-- Spaces table
CREATE TABLE IF NOT EXISTS `spaces` (
  `id` text PRIMARY KEY NOT NULL,
  `tenant_id` text NOT NULL DEFAULT 'default',
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
  `is_beginner_friendly` integer NOT NULL DEFAULT 0,
  `requires_membership` integer NOT NULL DEFAULT 0,
  `organizer_id` text,
  `is_verified` integer NOT NULL DEFAULT 0,
  `is_featured` integer NOT NULL DEFAULT 0,
  `createdAt` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
  `updatedAt` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);

CREATE INDEX IF NOT EXISTS `idx_spaces_tenant` ON `spaces` (`tenant_id`);
CREATE UNIQUE INDEX IF NOT EXISTS `idx_spaces_slug` ON `spaces` (`tenant_id`, `slug`);
CREATE INDEX IF NOT EXISTS `idx_spaces_neighborhood` ON `spaces` (`neighborhood`);
CREATE INDEX IF NOT EXISTS `idx_spaces_featured` ON `spaces` (`is_featured`);

-- Opportunities table
CREATE TABLE IF NOT EXISTS `opportunities` (
  `id` text PRIMARY KEY NOT NULL,
  `tenant_id` text NOT NULL DEFAULT 'default',
  `title` text NOT NULL,
  `description` text NOT NULL,
  `type` text NOT NULL,
  `status` text NOT NULL DEFAULT 'active',
  `space_id` text,
  `posted_by_id` text NOT NULL,
  `contact_info` text,
  `expires_at` integer,
  `createdAt` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
  `updatedAt` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);

CREATE INDEX IF NOT EXISTS `idx_opportunities_tenant` ON `opportunities` (`tenant_id`);
CREATE INDEX IF NOT EXISTS `idx_opportunities_type` ON `opportunities` (`type`);
CREATE INDEX IF NOT EXISTS `idx_opportunities_status` ON `opportunities` (`status`);
CREATE INDEX IF NOT EXISTS `idx_opportunities_space` ON `opportunities` (`space_id`);
CREATE INDEX IF NOT EXISTS `idx_opportunities_posted_by` ON `opportunities` (`posted_by_id`);

-- Opportunity Comments table
CREATE TABLE IF NOT EXISTS `opportunity_comments` (
  `id` text PRIMARY KEY NOT NULL,
  `tenant_id` text NOT NULL DEFAULT 'default',
  `opportunity_id` text NOT NULL,
  `user_id` text NOT NULL,
  `content` text NOT NULL,
  `createdAt` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);

CREATE INDEX IF NOT EXISTS `idx_opp_comments_tenant` ON `opportunity_comments` (`tenant_id`);
CREATE INDEX IF NOT EXISTS `idx_opp_comments_opp` ON `opportunity_comments` (`opportunity_id`);
