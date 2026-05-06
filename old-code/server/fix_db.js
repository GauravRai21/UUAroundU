const mongoose = require('mongoose');
require('dotenv').config();

async function fixDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campusconnect');
    console.log('Connected to DB');

    // Drop the entire users collection to reset it and fix index issues
    try {
      await mongoose.connection.collection('users').drop();
      console.log('Dropped users collection successfully');
    } catch (e) {
      console.log('Could not drop users collection, maybe it does not exist', e.message);
    }

    // Also drop posts and comments to avoid orphaned data
    try {
      await mongoose.connection.collection('posts').drop();
      console.log('Dropped posts collection successfully');
    } catch (e) {
      console.log('Could not drop posts collection', e.message);
    }
    
    try {
      await mongoose.connection.collection('comments').drop();
      console.log('Dropped comments collection successfully');
    } catch (e) {
      console.log('Could not drop comments collection', e.message);
    }

    console.log('Done cleaning up database.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

fixDb();
