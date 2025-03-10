CREATE TABLE `we-edit_account` (
	`user_id` text(255) NOT NULL,
	`type` text(255) NOT NULL,
	`provider` text(255) NOT NULL,
	`provider_account_id` text(255) NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` integer,
	`token_type` text(255),
	`scope` text(255),
	`id_token` text,
	`session_state` text(255),
	PRIMARY KEY(`provider`, `provider_account_id`),
	FOREIGN KEY (`user_id`) REFERENCES `we-edit_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `we-edit_bookmark` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_by` text(255) NOT NULL,
	`url` text(2048) NOT NULL,
	`title` text(512) NOT NULL,
	`description` text(2048),
	`icon` text(1048576),
	`tags` text(2048),
	`parent_id` text(255),
	`index` integer,
	`date_added` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`created_by`) REFERENCES `we-edit_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `we-edit_post` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(256),
	`created_by` text(255) NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer,
	FOREIGN KEY (`created_by`) REFERENCES `we-edit_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `we-edit_session` (
	`session_token` text(255) PRIMARY KEY NOT NULL,
	`userId` text(255) NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `we-edit_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `we-edit_user` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`name` text(255),
	`email` text(255) NOT NULL,
	`email_verified` integer DEFAULT (unixepoch()),
	`image` text(255)
);
--> statement-breakpoint
CREATE TABLE `we-edit_verification_token` (
	`identifier` text(255) NOT NULL,
	`token` text(255) NOT NULL,
	`expires` integer NOT NULL,
	PRIMARY KEY(`identifier`, `token`)
);
--> statement-breakpoint
CREATE INDEX `account_user_id_idx` ON `we-edit_account` (`user_id`);--> statement-breakpoint
CREATE INDEX `bookmark_created_by_idx` ON `we-edit_bookmark` (`created_by`);--> statement-breakpoint
CREATE INDEX `bookmark_url_idx` ON `we-edit_bookmark` (`url`);--> statement-breakpoint
CREATE INDEX `bookmark_parent_id_idx` ON `we-edit_bookmark` (`parent_id`);--> statement-breakpoint
CREATE INDEX `created_by_idx` ON `we-edit_post` (`created_by`);--> statement-breakpoint
CREATE INDEX `name_idx` ON `we-edit_post` (`name`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `we-edit_session` (`userId`);