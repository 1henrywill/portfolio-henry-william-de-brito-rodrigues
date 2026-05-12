CREATE TABLE `reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`session_id` int NOT NULL,
	`technician_id` int NOT NULL,
	`client_name` varchar(255) NOT NULL,
	`problem_description` longtext,
	`solution` longtext,
	`summary` longtext,
	`duration` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `support_rooms` (
	`id` int AUTO_INCREMENT NOT NULL,
	`technician_id` int NOT NULL,
	`room_code` varchar(16) NOT NULL,
	`room_name` varchar(255) NOT NULL,
	`status` enum('waiting','in_progress','completed') NOT NULL DEFAULT 'waiting',
	`client_name` text,
	`jitsi_room_name` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`started_at` timestamp,
	`ended_at` timestamp,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `support_rooms_id` PRIMARY KEY(`id`),
	CONSTRAINT `support_rooms_room_code_unique` UNIQUE(`room_code`)
);
--> statement-breakpoint
CREATE TABLE `support_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`room_id` int NOT NULL,
	`technician_id` int NOT NULL,
	`client_name` varchar(255) NOT NULL,
	`duration` int,
	`transcription` longtext,
	`summary` longtext,
	`problem_description` longtext,
	`solution` longtext,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `support_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transcriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`session_id` int NOT NULL,
	`audio_url` text,
	`transcription_text` longtext,
	`status` enum('pending','processing','completed','failed') NOT NULL DEFAULT 'pending',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `transcriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','technician') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `isTechnician` boolean DEFAULT false NOT NULL;