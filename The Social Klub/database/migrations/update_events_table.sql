-- Migration to adapt events table for enhanced API interaction logic

USE social_klub;

ALTER TABLE events
ADD COLUMN category ENUM('Social', 'Music & Live', 'Art & Culture', 'Food & Drink', 'Rooftop', 'Networking', 'Other') DEFAULT 'Other' AFTER location,
ADD COLUMN price DECIMAL(10, 2) DEFAULT 0.00 AFTER capacity,
ADD COLUMN status ENUM('live', 'upcoming', 'past', 'draft') DEFAULT 'draft' AFTER price;
-- Note: 'slots_available' might need logic updates to be managed, but for now we maintain its basic structure.
