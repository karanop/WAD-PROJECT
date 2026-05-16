const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const eventsCatalog = [
  { id: 1, title: 'Urban Gardening Workshop', category: 'Workshop', description: 'Learn the basics of urban gardening in small spaces.', image: 'https://images.unsplash.com/photo-1416879598555-585a08db14dc?w=400&h=300&fit=crop' },
  { id: 2, title: 'Rooftop Jazz Night', category: 'Entertainment', description: 'Enjoy smooth jazz under the stars on a beautiful city rooftop.', image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&h=300&fit=crop' },
  { id: 3, title: 'Tech Startup Mixer', category: 'Networking', description: 'Network with local tech founders and investors.', image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop' },
  { id: 4, title: 'Late Night Board Games', category: 'Social', description: 'Join us for a cozy evening of strategic board games and snacks.', image: 'https://images.unsplash.com/photo-1610890716171-469b3be28bd5?w=400&h=300&fit=crop' },
  { id: 5, title: 'Local Pottery Class', category: 'Creative', description: 'Get your hands dirty and create your own ceramic masterpiece.', image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&h=300&fit=crop' },
  { id: 6, title: 'Morning Yoga in the Park', category: 'Wellness', description: 'Start your day right with a guided yoga session in the city park.', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop' },
  { id: 7, title: 'Vintage Clothing Pop-up', category: 'Shopping', description: 'Discover unique vintage finds from local curators.', image: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=400&h=300&fit=crop' },
  { id: 8, title: 'Artisanal Coffee Tasting', category: 'Food & Drink', description: 'Explore single-origin coffees with expert local roasters.', image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400&h=300&fit=crop' },
  { id: 9, title: 'Indie Film Screening', category: 'Entertainment', description: 'Watch independent short films produced by local filmmakers.', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=300&fit=crop' },
  { id: 10, title: 'Street Photography Walk', category: 'Creative', description: 'Capture the essence of the city in this guided photography tour.', image: 'https://images.unsplash.com/photo-1516961642265-531546e84af2?w=400&h=300&fit=crop' },
  { id: 11, title: 'Salsa Dancing Basics', category: 'Workshop', description: 'Learn the foundational steps of salsa dancing.', image: 'https://images.unsplash.com/photo-1504609774528-69473fbfa07c?w=400&h=300&fit=crop' },
  { id: 12, title: 'Vegan Cooking Masterclass', category: 'Food & Drink', description: 'Prepare delicious plant-based meals with a professional chef.', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop' },
  { id: 13, title: 'Book Club: Sci-Fi Edition', category: 'Social', description: 'Discuss classic science fiction literature with fellow enthusiasts.', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop' },
  { id: 14, title: 'Open Mic Night', category: 'Entertainment', description: 'Share your music, poetry, or comedy on stage.', image: 'https://images.unsplash.com/photo-1516280440502-864b4c732959?w=400&h=300&fit=crop' },
  { id: 15, title: 'Weekend Hiking Excursion', category: 'Wellness', description: 'Join a group hike exploring the scenic trails just outside the city.', image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop' },
  { id: 16, title: 'Mural Painting Workshop', category: 'Creative', description: 'Collaborate on a community mural guided by a local street artist.', image: 'https://images.unsplash.com/photo-1499803270242-467fc83411cb?w=400&h=300&fit=crop' },
  { id: 17, title: 'Wine and Cheese Pairing', category: 'Food & Drink', description: 'Savor regional wines paired with artisanal cheeses.', image: 'https://images.unsplash.com/photo-1505075908611-c9670f5e7146?w=400&h=300&fit=crop' },
  { id: 18, title: 'Startup Pitch Night', category: 'Networking', description: 'Watch emerging startups pitch their ideas to investors.', image: 'https://images.unsplash.com/photo-1475721025505-c08945a60e0d?w=400&h=300&fit=crop' },
  { id: 19, title: 'Meditation Mini-Retreat', category: 'Wellness', description: 'A half-day retreat focused on mindfulness and relaxation.', image: 'https://images.unsplash.com/photo-1528315651484-ec409f5faeed?w=400&h=300&fit=crop' },
  { id: 20, title: 'Craft Beer Brewery Tour', category: 'Food & Drink', description: 'Tour a local brewery and sample their latest craft beers.', image: 'https://images.unsplash.com/photo-1532634922-8fe0b757fb13?w=400&h=300&fit=crop' },
  { id: 21, title: 'Creative Writing Circle', category: 'Creative', description: 'Share and refine your creative writing in a supportive group.', image: 'https://images.unsplash.com/photo-1455390582262-044cdead27d6?w=400&h=300&fit=crop' },
  { id: 22, title: 'Local History Walking Tour', category: 'Social', description: 'Learn about the fascinating history of our downtown area.', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop' },
  { id: 23, title: 'DIY Terrarium Building', category: 'Workshop', description: 'Create your own miniature indoor garden in a glass jar.', image: 'https://images.unsplash.com/photo-1497987258384-98cdd8d2feac?w=400&h=300&fit=crop' },
  { id: 24, title: 'Acoustic Guitar Jam Session', category: 'Social', description: 'Bring your acoustic guitar and jam with local musicians.', image: 'https://images.unsplash.com/photo-1549298240-0d8e60513026?w=400&h=300&fit=crop' },
  { id: 25, title: 'Intro to Graphic Design', category: 'Workshop', description: 'A beginner-friendly workshop on digital design basics.', image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=300&fit=crop' },
  { id: 26, title: 'Sustainable Fashion Swap', category: 'Shopping', description: 'Trade gently used clothing and promote sustainable fashion.', image: 'https://images.unsplash.com/photo-1489987707025-afc220f81d11?w=400&h=300&fit=crop' },
  { id: 27, title: 'Stand-up Comedy Showcase', category: 'Entertainment', description: 'Laugh out loud with local up-and-coming comedians.', image: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=400&h=300&fit=crop' },
  { id: 28, title: 'Introduction to Astrology', category: 'Workshop', description: 'Learn the basics of reading natal charts and astrology.', image: 'https://images.unsplash.com/photo-1532968961962-811c7ce2c8bb?w=400&h=300&fit=crop' },
  { id: 29, title: 'Baking Artisan Bread', category: 'Food & Drink', description: 'Master the art of sourdough and rustic breads.', image: 'https://images.unsplash.com/photo-1509440159596-0249033322aa?w=400&h=300&fit=crop' },
  { id: 30, title: 'Women in Tech Meetup', category: 'Networking', description: 'Connect with female professionals in the tech industry.', image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=400&h=300&fit=crop' },
  { id: 31, title: 'Analog Photography Basics', category: 'Creative', description: 'Explore shooting on film and darkroom techniques.', image: 'https://images.unsplash.com/photo-1496030743588-44fb74b41984?w=400&h=300&fit=crop' },
  { id: 32, title: 'Language Exchange Cafe', category: 'Social', description: 'Practice a new language with native speakers in a casual setting.', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop' }
];

async function setupDatabaseAndSeed() {
  console.log('Connecting to MySQL...');
  let conn;
  try {
    conn = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'social_klub'
    });
    console.log('Connected!');

    // 1. Ensure events schema is fully updated to avoid "Server error parsing database insert"
    console.log('Checking database table structures...');
    
    // Add missing columns if they don't exist
    try {
      await conn.query("ALTER TABLE events ADD COLUMN category ENUM('Social', 'Music & Live', 'Art & Culture', 'Food & Drink', 'Rooftop', 'Networking', 'Other') DEFAULT 'Other'");
      console.log('Added category column to events.');
    } catch(e) { if (e.code !== 'ER_DUP_FIELDNAME') throw e; }

    try {
      await conn.query("ALTER TABLE events ADD COLUMN price DECIMAL(10, 2) DEFAULT 0.00");
      console.log('Added price column to events.');
    } catch(e) { if (e.code !== 'ER_DUP_FIELDNAME') throw e; }

    try {
      await conn.query("ALTER TABLE events ADD COLUMN status ENUM('live', 'upcoming', 'past', 'draft') DEFAULT 'draft'");
      console.log('Added status column to events.');
    } catch(e) { if (e.code !== 'ER_DUP_FIELDNAME') throw e; }
    
    // Ensure user 1 exists for seeded events foreign key
    const [users] = await conn.query('SELECT * FROM users LIMIT 1');
    let userId = 1;
    if (users.length === 0) {
      console.log('Creating a dummy admin user as none was found...');
      const [r] = await conn.query("INSERT INTO users (first_name, last_name, email, password_hash) VALUES ('Admin', 'User', 'admin@example.com', 'dummyhash')");
      userId = r.insertId;
    } else {
      userId = users[0].id;
    }

    // Seed Data
    console.log('Seeding existing events into the database...');
    let insertedCount = 0;
    
    for (const ev of eventsCatalog) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 30));
      const year = futureDate.getFullYear();
      const month = String(futureDate.getMonth() + 1).padStart(2, '0');
      const day = String(futureDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      const timeStr = '18:00:00';
      const max_guests = 50 + Math.floor(Math.random() * 50);

      const [existing] = await conn.query('SELECT id FROM events WHERE title = ?', [ev.title]);
      if (existing.length === 0) {
        await conn.query(
          `INSERT INTO events (title, description, event_date, event_time, location, category, capacity, slots_available, price, status, image_url, created_by) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            ev.title, ev.description, dateStr, timeStr, 
            'Local Venue', ev.category || 'Other', max_guests, max_guests, 
            ev.price || 0.00, 'live', ev.image || null, userId
          ]
        );
        insertedCount++;
      }
    }
    console.log(`Successfully seeded ${insertedCount} events!`);

  } catch (err) {
    console.error('Database setup error:', err);
  } finally {
    if (conn) await conn.end();
    process.exit();
  }
}

setupDatabaseAndSeed();
