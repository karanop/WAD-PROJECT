const db = require('../config/database');

const EVENT_COLUMN_PATCHES = [
  "ALTER TABLE events ADD COLUMN category ENUM('Social', 'Music & Live', 'Art & Culture', 'Food & Drink', 'Rooftop', 'Networking', 'Other') DEFAULT 'Other' AFTER location",
  "ALTER TABLE events ADD COLUMN price DECIMAL(10, 2) DEFAULT 0.00 AFTER capacity",
  "ALTER TABLE events ADD COLUMN status ENUM('live', 'upcoming', 'past', 'draft') DEFAULT 'draft' AFTER price",
];

async function promoteLegacyDraftEvents() {
  const [[counts]] = await db.query(`
    SELECT
      SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) AS draftCount,
      SUM(CASE WHEN status != 'draft' THEN 1 ELSE 0 END) AS publicCount
    FROM events
  `);

  const draftCount = Number(counts?.draftCount || 0);
  const publicCount = Number(counts?.publicCount || 0);

  if (!draftCount || publicCount > 0) {
    return;
  }

  const [result] = await db.query(`
    UPDATE events
    SET status = CASE
      WHEN event_date < CURDATE() THEN 'past'
      ELSE 'upcoming'
    END
    WHERE status = 'draft'
  `);

  if (result.affectedRows > 0) {
    console.log(`[schema] Promoted ${result.affectedRows} legacy draft events so they appear in public discovery`);
  }
}

async function ensureEventSchema() {
  try {
    const [tables] = await db.query("SHOW TABLES LIKE 'events'");
    if (!tables.length) {
      console.warn('[schema] Events table not found. Run database/schema.sql before starting the API.');
      return;
    }

    for (const statement of EVENT_COLUMN_PATCHES) {
      try {
        await db.query(statement);
      } catch (error) {
        if (error.code !== 'ER_DUP_FIELDNAME') {
          throw error;
        }
      }
    }

    await promoteLegacyDraftEvents();
    console.log('[schema] Event table verified');
  } catch (error) {
    console.error('[schema] Failed to verify event table:', error.message);
  }
}

module.exports = {
  ensureEventSchema,
};
