const mongoose = require('mongoose');

// Connects to MongoDB using the URI in .env (MONGODB_URI).
// Called once from src/index.js before the Express server starts listening.
async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      'MONGODB_URI is not set. Copy .env.example to .env and add a real connection string ' +
        '(a free MongoDB Atlas cluster or a local mongod instance).'
    );
  }

  mongoose.connection.on('connected', () => {
    console.log('[db] MongoDB connected');
  });

  mongoose.connection.on('error', (err) => {
    console.error('[db] MongoDB connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[db] MongoDB disconnected');
  });

  await mongoose.connect(uri);
}

module.exports = { connectDB };
