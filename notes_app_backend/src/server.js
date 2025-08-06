const app = require('./app');
const db = require('./models');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

async function startServer() {
  try {
    // Sync database on launch (disable in prod if needed; for now for dev convenience)
    await db.sequelize.authenticate();
    console.log('Database connected!');
    // Warning: .sync({alter: true}) in prod can cause data loss; migrate properly in prod.
    await db.sequelize.sync();
    console.log('Database synchronized.');

    const server = app.listen(PORT, HOST, () => {
      console.log(`Server running at http://${HOST}:${PORT}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
        db.sequelize.close().then(() => {
          console.log('Database connection closed');
          process.exit(0);
        });
      });
    });

    module.exports = server;
  } catch (error) {
    console.error('Failed to initialize server/database:', error);
    process.exit(1);
  }
}

startServer();
