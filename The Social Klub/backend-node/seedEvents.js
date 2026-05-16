const db = require('./config/database');

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
  { id: 32, title: 'Language Exchange Cafe', category: 'Social', description: 'Practice a new language with native speakers in a casual setting.', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop' },
  { id: 33, title: 'Introduction to Python', category: 'Workshop', description: 'A crash course in Python programming for absolute beginners.', image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&h=300&fit=crop' },
  { id: 34, title: 'Outdoor Watercolors', category: 'Creative', description: 'Paint landscapes en plein air in the botanical gardens.', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=300&fit=crop' },
  { id: 35, title: 'Mixology 101', category: 'Food & Drink', description: 'Learn to craft classic cocktails like a pro bartender.', image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=300&fit=crop' },
  { id: 36, title: 'Financial Literacy Seminar', category: 'Workshop', description: 'Practical advice on budgeting, investing, and personal finance.', image: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=400&h=300&fit=crop' },
  { id: 37, title: 'Sunrise Beach Cleanup', category: 'Social', description: 'Volunteer to clean up our local shoreline at sunrise.', image: 'https://images.unsplash.com/photo-1618477461853-cf6ed80fcaac?w=400&h=300&fit=crop' },
  { id: 38, title: 'Chess Club Gathering', category: 'Social', description: 'Play informal chess matches with players of all skill levels.', image: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=400&h=300&fit=crop' },
  { id: 39, title: 'Improv Comedy Workshop', category: 'Creative', description: 'Learn the fundamentals of improvisational theater and think on your feet.', image: 'https://images.unsplash.com/photo-1516280440502-864b4c732959?w=400&h=300&fit=crop' },
  { id: 40, title: 'Street Food Festival', category: 'Food & Drink', description: 'Taste culinary delights from over 20 local food trucks.', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop' },
  { id: 41, title: 'Freelancer Coworking Day', category: 'Networking', description: 'Work alongside other freelancers and independent contractors.', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop' },
  { id: 42, title: 'Knit & Chat Gathering', category: 'Social', description: 'Bring your knitting project and chat with fellow crafters.', image: 'https://images.unsplash.com/photo-1584988295697-7c70c0c6e00b?w=400&h=300&fit=crop' },
  { id: 43, title: 'Cryptocurrency Basics', category: 'Workshop', description: 'Understand the fundamentals of blockchain and crypto.', image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&h=300&fit=crop' },
  { id: 44, title: 'Gourmet Chocolate Tasting', category: 'Food & Drink', description: 'Sample handcrafted chocolates from local chocolatiers.', image: 'https://images.unsplash.com/photo-1548596489-0f624e5445aa?w=400&h=300&fit=crop' },
  { id: 45, title: 'Poetry Slam Event', category: 'Entertainment', description: 'Listen to powerful spoken word performances.', image: 'https://images.unsplash.com/photo-1478147424098-de76652d87e0?w=400&h=300&fit=crop' },
  { id: 46, title: 'Zumba Fitness Party', category: 'Wellness', description: 'A high-energy dance workout celebrating global rhythms.', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop' },
  { id: 47, title: 'Intro to DJing', category: 'Workshop', description: 'Learn the basics of beatmatching and mixing tracks.', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=300&fit=crop' },
  { id: 48, title: 'Anime Watch Party', category: 'Social', description: 'Screening classic anime films with fellow enthusiasts.', image: 'https://images.unsplash.com/photo-1580477655848-038c35bb5723?w=400&h=300&fit=crop' },
  { id: 49, title: 'Urban Sketching Meetup', category: 'Creative', description: 'Draw the city architecture and street scenes on location.', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=300&fit=crop' },
  { id: 50, title: 'Zero Waste Living Workshop', category: 'Workshop', description: 'Tips and tricks for reducing your household waste footprint.', image: 'https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?w=400&h=300&fit=crop' }
];

async function seedData() {
  console.log('Seeding existing events to the database and ensuring user 1 is present...');
  try {
    // 1. We should have at least one user to assign 'created_by'
    const [users] = await db.query('SELECT * FROM users LIMIT 1');
    let userId = 1;

    if (users.length === 0) {
      console.log('No user found, creating a dummy admin user.');
      const [insertUser] = await db.query(
        "INSERT INTO users (first_name, last_name, email, password_hash) VALUES ('Admin', 'Admin', 'admin@example.com', 'dummyhash')"
      );
      userId = insertUser.insertId;
    } else {
      userId = users[0].id;
    }

    // 2. Iterate through eventsCatalog and insert
    // I am randomizing the date slightly in the future so they aren't all marked 'past'
    let insertedCount = 0;
    
    for (const ev of eventsCatalog) {
      // Create a nice future date for these mocked events
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 30));
      const year = futureDate.getFullYear();
      const month = String(futureDate.getMonth() + 1).padStart(2, '0');
      const day = String(futureDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      const timeStr = '18:00:00';
      const max_guests = 50 + Math.floor(Math.random() * 50);

      // Check if title already exists to avoid duplicates
      const [existing] = await db.query('SELECT id FROM events WHERE title = ?', [ev.title]);
      
      if (existing.length === 0) {
        await db.query(
          `INSERT INTO events (title, description, event_date, event_time, location, category, capacity, slots_available, price, status, image_url, created_by) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            ev.title, 
            ev.description, 
            dateStr, 
            timeStr, 
            'Local Venue', // default since content.js has no location
            ev.category || 'Other', 
            max_guests, 
            max_guests, 
            ev.price || 0.00, 
            'live', 
            ev.image || null, 
            userId
          ]
        );
        insertedCount++;
      }
    }

    console.log(`Successfully seeded ${insertedCount} new events!`);
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    process.exit();
  }
}

seedData();
