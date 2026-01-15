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
    `created_at` DATETIME NOT NULL,
    `updated_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `clients`(
    `id` INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `ip` VARCHAR(15) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `course` VARCHAR(10) NOT NULL,
    `yearlevel` INT NOT NULL,
    `status` ENUM('pending', 'active', 'dropping', 'paused'),
    `time_remaining` BIGINT DEFAULT 0,
    `time_earned` BIGINT DEFAULT 0,
    `connection_start_at` DATETIME DEFAULT NULL,
    `created_at` DATETIME NOT NULL,
    `updated_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;