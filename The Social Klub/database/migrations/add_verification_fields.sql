-- Migration to add email verification to the users table
-- Run this if you already have the database initialized.

USE social_klub;

ALTER TABLE users 
ADD COLUMN is_verified BOOLEAN DEFAULT FALSE AFTER role,
ADD COLUMN verification_token VARCHAR(255) DEFAULT NULL AFTER is_verified;
