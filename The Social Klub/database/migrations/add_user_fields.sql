-- Migration to add phone_number, date_of_birth, and city to the users table
-- Run this if you already have the database initialized.

USE social_klub;

ALTER TABLE users 
ADD COLUMN phone_number VARCHAR(20) AFTER email,
ADD COLUMN date_of_birth DATE AFTER phone_number,
ADD COLUMN city VARCHAR(100) AFTER date_of_birth;
