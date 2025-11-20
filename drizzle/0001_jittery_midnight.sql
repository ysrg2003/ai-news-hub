CREATE TABLE `article_tags` (
	`articleId` int NOT NULL,
	`tagId` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `articles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`excerpt` text,
	`content` text NOT NULL,
	`categoryId` int NOT NULL,
	`authorId` int,
	`authorName` varchar(100),
	`articleType` enum('trending','evergreen') NOT NULL,
	`image` text,
	`imageAltText` varchar(255),
	`metaTitle` varchar(60),
	`metaDescription` varchar(160),
	`readTime` int,
	`viewCount` int DEFAULT 0,
	`conceptualIcon` varchar(100),
	`published` int DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `articles_id` PRIMARY KEY(`id`),
	CONSTRAINT `articles_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`description` text,
	`icon` varchar(50),
	`color` varchar(20),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_name_unique` UNIQUE(`name`),
	CONSTRAINT `categories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `job_queue` (
	`id` int AUTO_INCREMENT NOT NULL,
	`jobId` varchar(100) NOT NULL,
	`categoryId` int NOT NULL,
	`articleType` enum('trending','evergreen') NOT NULL,
	`status` varchar(100) NOT NULL,
	`attempts` int DEFAULT 1,
	`lastAttempted` timestamp,
	`intermediateData` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `job_queue_id` PRIMARY KEY(`id`),
	CONSTRAINT `job_queue_jobId_unique` UNIQUE(`jobId`)
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`slug` varchar(50) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tags_id` PRIMARY KEY(`id`),
	CONSTRAINT `tags_name_unique` UNIQUE(`name`),
	CONSTRAINT `tags_slug_unique` UNIQUE(`slug`)
);
