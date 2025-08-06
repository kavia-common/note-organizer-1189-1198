const db = require('./index');

// PUBLIC_INTERFACE
async function migrate() {
  /**
   * Synchronize all tables with database.
   * Usage: node src/models/migrate.js
   */
  try {
    await db.sequelize.sync({ alter: true });
    console.log('All tables migrated/synced successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  migrate();
}

module.exports = migrate;
