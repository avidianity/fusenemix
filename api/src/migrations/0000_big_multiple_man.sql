CREATE TABLE `finance_transactions` (
	`id` char(26) NOT NULL,
	`date` date NOT NULL,
	`amount` float NOT NULL,
	`category` varchar(256) NOT NULL,
	`sub_category` varchar(256),
	`payment_method` varchar(256) NOT NULL,
	`recipient` varchar(256) NOT NULL,
	`type` varchar(256) NOT NULL,
	`user_id` char(26) NOT NULL,
	CONSTRAINT `finance_transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` char(26) NOT NULL,
	`first_name` varchar(256) NOT NULL,
	`last_name` varchar(256) NOT NULL,
	`email` varchar(256) NOT NULL,
	`password` varchar(256) NOT NULL,
	`created_at` timestamp NOT NULL,
	`updated_at` timestamp NOT NULL,
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `finance_transactions` ADD CONSTRAINT `finance_transactions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;