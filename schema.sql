DROP DATABASE IF EXISTS smile;

CREATE DATABASE IF NOT EXISTS smile
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_general_ci;

USE smile;

CREATE TABLE `accounts`(
    `id` INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `username` VARCHAR(15) NOT NULL UNIQUE KEY,
    `name` VARCHAR(100) NOT NULL,
    `role` ENUM('staff', 'admin') NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `last_login` DATETIME DEFAULT NULL,
    `created_at` DATETIME NOT NULL,
    `updated_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `clients`(
    `id` INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `mac` VARCHAR(50) NULL,
    `ip` VARCHAR(15) NULL,
    `hostname` VARCHAR(100) NULL,
    `username` VARCHAR(25) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `is_logged` BOOLEAN DEFAULT FALSE,
    `status` ENUM('pending', 'active', 'dropping', 'paused', 'outOfTime'),
    `time_remaining` BIGINT DEFAULT 0,
    `time_earned` BIGINT DEFAULT 0,
    `expire_at` DATETIME DEFAULT NULL,
    `connection_start_at` DATETIME DEFAULT NULL,
    `created_at` DATETIME NOT NULL,
    `updated_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `logs`(
    `id`INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `timestamp` DATETIME NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `level` ENUM('INFO', 'WARN', 'ERROR') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `waste`(
    `code` VARCHAR(5) NOT NULL PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `time` INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `waste_transactions`(
    `id` INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `client_id` INT NULL,
    `waste_code` VARCHAR(5) NOT NULL,
    `quantity` INT NOT NULL,
    `earned_time` INT NOT NULL,
    `transaction_date` DATETIME NOT NULL,
    FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`waste_code`) REFERENCES `waste`(`code`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `bins` (
    `id` INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `bin_code` ENUM('PBTL', 'PPRS', 'GWST') NOT NULL UNIQUE,
    `name` ENUM('Plastic Bottle', 'Paper', 'General Waste') NOT NULL,
    `created_at` DATETIME NOT NULL,
    `updated_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `bin_logs` (
    `id` INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `bin_code` ENUM('PBTL', 'PPRS', 'GWST') NOT NULL,
    `created_at` DATETIME NOT NULL,
    FOREIGN KEY (`bin_code`) REFERENCES `bins`(`bin_code`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `accessed_links`(
    `id` INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `client_id` INT NOT NULL,
    `link` VARCHAR(255) NOT NULL,
    `accessed_at` DATETIME NOT NULL,
    FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci; 

CREATE TABLE `prohibited_links`(
    `id` INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `link` VARCHAR(255) NOT NULL,
    `created_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `settings`(
    `id` INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `utility_mode` BOOLEAN DEFAULT FALSE,
    `auto_backup` BOOLEAN DEFAULT TRUE,
    `backup_freq` ENUM('hourly', 'daily', 'weekly', 'monthly') DEFAULT 'hourly',
    `compression` ENUM('none', 'gzip', 'zip') DEFAULT 'zip',
    `location` VARCHAR(100) DEFAULT '/root/backup/smile',
    `retention` INT DEFAULT 30,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- DUMP DATA
-- INSERT INTO `clients` (`ip`, `name`, `course`, `yearlevel`, `status`, `time_remaining`, `time_earned`, `expire_at`, `connection_start_at`, `created_at`, `updated_at`) VALUES ('127.0.0.1', 'localhost', 'BSCS', 4, 'pending', 0, 0, NULL, NULL, NOW(), NOW());

INSERT INTO `accounts` (`username`, `name`, `role`, `password`, `created_at`, `updated_at`)
VALUES
    ('local', 'local', 'admin', 'd88207f8bfaacc49b53e53f89569628b170a1c551f8bbbec49c8556f294677bd', NOW(), NOW());

INSERT INTO `waste` (`code`, `name`, `time`)
VALUES
    ('PBTL', 'Plastic Bottle', 8),
    ('PPRS', 'Paper', 5),
    ('GWST', 'General Waste', 2);

INSERT INTO `bins` (`bin_code`, `name`, `created_at`, `updated_at`)
VALUES
    ('PBTL', 'Plastic Bottle', NOW(), NOW()),
    ('PPRS', 'Paper', NOW(), NOW()),
    ('GWST', 'General Waste', NOW(), NOW());

INSERT INTO `prohibited_links` (`link`, `created_at`)
VALUES 
    ('pornhub.com', NOW()),
    ('nhentai.net', NOW()),
    ('onlyfans.com', NOW());

INSERT INTO `settings` (`utility_mode`, `auto_backup`, `backup_freq`, `compression`, `location`, `retention`) 
VALUES
    (FALSE, TRUE, 'daily', 'zip', '/root/backup/smile', 30);