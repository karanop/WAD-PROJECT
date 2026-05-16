const mysql = require('mysql2/promise');
const axios = require('axios');
require('dotenv').config();

/**
 * ============================================================================
 * 📌 PINTEREST API DATABASE SEEDER
 * ============================================================================
 * 
 * This utility script programmatically fetches event-appropriate images from 
 * Pinterest based on search queries and inserts new event records into the 
 * local MySQL database with those unique image URLs.
 * 
 * ============================================================================
 * 🔐 SECURITY & ENVIRONMENT SETUP (.env)
 * ============================================================================
 * 
 * 1. Ensure you have a `.env` file in the root of your `backend-node` folder.
 * 2. Add the following environment variables:
 * 
 *    # --- Database Credentials ---
 *    DB_HOST=localhost
 *    DB_USER=root
 *    DB_PASSWORD=your_mysql_password
 *    DB_NAME=social_klub
 * 
 *    # --- Pinterest API Credentials ---
 *    # Note: Because the official Pinterest API is highly restricted for search 
 *    # purposes, developers commonly use a RapidAPI Pinterest scraper for features 
 *    # like this. Sign up on RapidAPI and subscribe to a Pinterest scraper API.
 *    PINTEREST_API_KEY=your_rapidapi_key_here
 *    PINTEREST_API_HOST=pinterest-api-host.p.rapidapi.com
 * 
 * 3. NEVER commit your `.env` file. Keep it in your `.gitignore` to protect 
 *    database credentials and API keys.
 * 
 * ============================================================================
 * 🚀 USAGE
 * ============================================================================
 * 
 * 1. Install dependencies: `npm install mysql2 axios dotenv`
 * 2. Run script: `node scripts/pinterest-seeder.js`
 */

// Sample event queries you want to seed
const PINTEREST_SEARCH_TERMS = [
    { title: "Live Jazz Night", location: "Blue Note Club", desc: "A relaxing evening of smooth jazz." },
    { title: "Art Gallery Opening", location: "Downtown Canvas Studio", desc: "Contemporary abstract showcase." },
    { title: "Indie Rock Festival", location: "The Garage", desc: "Local indie bands performing live." },
    { title: "Sunday Morning Yoga", location: "Central Park", desc: "Outdoor stretching and meditation." }
];

/**
 * Validates a given image URL by sending a fast HEAD request.
 * It discards invalid or extremely slow-loading URLs.
 * 
 * @param {string} url - The image URL to test
 * @returns {boolean}
 */
async function isValidImage(url) {
    try {
        // Enforce a strict timeout (e.g., 3 seconds) to ensure frontend performance won't suffer
        const response = await axios.head(url, { timeout: 3000 });
        const contentType = response.headers['content-type'];
        
        // Check if response is 200 OK and is actually an image format
        return response.status === 200 && contentType && contentType.startsWith('image/');
    } catch (error) {
        return false;
    }
}

/**
 * Searches Pinterest and extracts the best quality image URL from the top 5 results.
 * 
 * @param {string} query - The search term
 * @returns {string|null} - The validated image URL, or null if none found
 */
async function getPinterestImage(query) {
    try {
        console.log(`🔍 Searching Pinterest for: "${query}"...`);
        
        // Refining search for better aesthetic quality on Pinterest
        const enhancedQuery = `${query} event aesthetic high quality`;
        
        // This request structure assumes a standard RapidAPI Pinterest Scraper.
        // Adjust the URL and data parsing according to your specific API provider.
        const response = await axios.get(`https://${process.env.PINTEREST_API_HOST}/search/pins`, {
            params: { q: enhancedQuery },
            headers: {
                'X-RapidAPI-Key': process.env.PINTEREST_API_KEY,
                'X-RapidAPI-Host': process.env.PINTEREST_API_HOST
            }
        });

        // Parse results based on typical API responses
        const results = response.data.pins || response.data.results || [];
        
        if (results.length === 0) {
            console.warn(`   ⚠️ No Pinterest results found for: "${query}"`);
            return null;
        }

        // Check the first 5 results to find the best functioning image
        for (let i = 0; i < Math.min(5, results.length); i++) {
            const pin = results[i];
            
            // Different APIs return image structures differently. 
            // We look for 'orig' (original quality) or a flat 'image_url'
            let imageUrl = null;
            if (pin.images && pin.images.orig && pin.images.orig.url) {
                imageUrl = pin.images.orig.url;
            } else if (pin.image_url) {
                imageUrl = pin.image_url;
            }

            if (imageUrl) {
                const isValid = await isValidImage(imageUrl);
                if (isValid) {
                    console.log(`   ✅ Found fast, valid image: ${imageUrl}`);
                    return imageUrl;
                }
            }
        }
        
        console.warn(`   ❌ Top 5 images for "${query}" were invalid or too slow.`);
        return null;

    } catch (error) {
        console.error(`   🔥 Pinterest API Error for "${query}":`, error.message);
        return null;
    }
}

/**
 * Main function that orchestrates fetching images and inserting records into MySQL.
 */
async function runSeeder() {
    let db;
    try {
        console.log("🔌 Connecting to the database...");
        db = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'social_klub'
        });
        console.log("✅ Database connected successfully.\n");

        for (const item of PINTEREST_SEARCH_TERMS) {
            // 1. Fetch image from Pinterest API
            let imageUrl = await getPinterestImage(item.title);
            
            // 2. Fallback logic if Pinterest fails or max limits reached
            if (!imageUrl) {
                imageUrl = `https://via.placeholder.com/800x600?text=${encodeURIComponent(item.title)}`;
                console.log(`   ℹ️ Applied fallback placeholder image.`);
            }

            // Dummy configuration for required fields in schema.sql
            const targetDate = new Date();
            targetDate.setDate(targetDate.getDate() + 14); // Set event to 2 weeks from now
            const eventDate = targetDate.toISOString().split('T')[0];
            const eventTime = '19:00:00';
            const capacity = 100;
            const slotsAvailable = capacity;
            const createdBy = 1; // Requires an existing user ID in the 'users' table

            // 3. Batch DB Insert
            const query = `
                INSERT INTO events 
                (title, description, event_date, event_time, location, image_url, capacity, slots_available, created_by) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const values = [
                item.title, 
                item.desc, 
                eventDate, 
                eventTime, 
                item.location, 
                imageUrl, 
                capacity, 
                slotsAvailable, 
                createdBy
            ];

            await db.execute(query, values);
            console.log(`💾 Successfully inserted new event into DB: "${item.title}"\n`);
        }

        console.log("🎉 Seeding completed successfully! Check your frontend to see the Pinterest masonry grid.");

    } catch (error) {
        console.error("💥 Critical error occurred:", error);
    } finally {
        if (db) {
            await db.end();
            console.log("🔒 Database connection terminated.");
        }
    }
}

// Execute the scrapper
runSeeder();
