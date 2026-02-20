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
    `ip` VARCHAR(15) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `course` VARCHAR(10) NOT NULL,
    `yearlevel` INT NOT NULL,
    `status` ENUM('pending', 'active', 'dropping', 'paused', 'outOfTime'),
    `time_remaining` BIGINT DEFAULT 0,
    `time_earned` BIGINT DEFAULT 0,
    `connection_start_at` DATETIME DEFAULT NULL,
    `created_at` DATETIME NOT NULL,
    `updated_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `logs`(
    `id`INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `timestamp` DATETIME NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `level` ENUM('INFO', 'WARN', 'ERR') NOT NULL,
    `message` VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `waste`(
    `code` VARCHAR(5) NOT NULL PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `time` INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `waste_transactions`(
    `id` INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `client_id` INT NOT NULL,
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

-- DUMP DATA
INSERT INTO `clients` (`ip`, `name`, `course`, `yearlevel`, `status`, `time_remaining`, `time_earned`, `connection_start_at`, `waste_collected`, `created_at`, `updated_at`) VALUES ('127.0.0.1', 'localhost', 'BSCS', 4, 'pending', 0, 0, NULL, 0, NOW(), NOW());
INSERT INTO `clients` (`ip`, `name`, `course`, `yearlevel`, `status`, `time_remaining`, `time_earned`, `connection_start_at`, `waste_collected`, `created_at`, `updated_at`) VALUES ('127.0.0.1', 'localhost1', 'BSCS', 4, 'active', 0, 0, NULL, 0, NOW(), NOW());
INSERT INTO `clients` (`ip`, `name`, `course`, `yearlevel`, `status`, `time_remaining`, `time_earned`, `connection_start_at`, `waste_collected`, `created_at`, `updated_at`) VALUES ('127.0.0.1', 'localhost12', 'BSCS', 4, 'active', 0, 0, NULL, 0, NOW(), NOW());

INSERT INTO `accounts` (`username`, `name`, `role`, `password`, `created_at`, `updated_at`) VALUES ('mikeru', 'Michael Alexis Ponce', 'admin', '83a1a3270b33c5a549e70cb938d904e058680a9f226238498641e17860aac924', NOW(), NOW());
INSERT INTO `accounts` (`username`, `name`, `role`, `password`, `created_at`, `updated_at`) VALUES ('BlancheTinsleye', 'Bj Ashley Mercado', 'admin', '2148d5ff3881c92d22f60c8f5d41cc1ff6856840079bd87e45dd6c728d8235ff', NOW(), NOW());
INSERT INTO `accounts` (`username`, `name`, `role`, `password`, `created_at`, `updated_at`) VALUES ('ConcepcionPaul', 'Paul Dexter Concepcion', 'admin', '384e1bfb71a6311fe977064a42f1bd31295f2d9f0b9faf74fe63820903f44755', NOW(), NOW());
INSERT INTO `accounts` (`username`, `name`, `role`, `password`, `created_at`, `updated_at`) VALUES ('gerigreizelle', 'Geri Greizelle Pineda', 'admin', 'a57d35cfc0f395f1950e0c01be9cdb87df03f25bb2c8061e4e967973845a7a2d', NOW(), NOW());
INSERT INTO `accounts` (`username`, `name`, `role`, `password`, `created_at`, `updated_at`) VALUES ('RodienJillian', 'Rodien Jillan Ellorando', 'admin', '249eef78f05a7831aa45c1be16ba5c80d8781d1895d8613c412f0534aa193e07', NOW(), NOW());

INSERT INTO `waste` (`code`, `name`, `time`) VALUES ('PBTL', 'Plastic Bottle', 5);
INSERT INTO `waste` (`code`, `name`, `time`) VALUES ('PPRS', 'Paper', 2);
INSERT INTO `waste` (`code`, `name`, `time`) VALUES ('GWST', 'General Waste', 1);

INSERT INTO `bins` (`bin_code`, `name`, `created_at`, `updated_at`) VALUES ('PBTL', 'Plastic Bottle', NOW(), NOW());
INSERT INTO `bins` (`bin_code`, `name`, `created_at`, `updated_at`) VALUES ('PPRS', 'Paper', NOW(), NOW());
INSERT INTO `bins` (`bin_code`, `name`, `created_at`, `updated_at`) VALUES ('GWST', 'General Waste', NOW(), NOW());