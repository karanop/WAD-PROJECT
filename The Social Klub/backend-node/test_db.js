const db = require('./config/database');

async function checkDb() {
  try {
    const [tables] = await db.query('SHOW TABLES');
    console.log('Tables:', tables);

    const [columns] = await db.query('DESCRIBE events');
    console.log('events table schema:', columns);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

checkDb();
