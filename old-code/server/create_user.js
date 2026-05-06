const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

async function createUser() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    const name = "Gaurav Rai";
    const college = "United University";
    const uniqueId = "23150010042";
    const passwordText = "Gaurav2004";

    // Check if user already exists
    let user = await User.findOne({ uniqueId });
    if (user) {
      console.log('User already exists with this UID!');
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(passwordText, salt);

    user = new User({
      name,
      uniqueId,
      college,
      password: hashedPassword
    });

    await user.save();
    console.log('User created successfully!');
    console.log(`Name: ${name}`);
    console.log(`UID: ${uniqueId}`);
    console.log(`College: ${college}`);
    
    process.exit(0);
  } catch (err) {
    console.error('Error creating user:', err);
    process.exit(1);
  }
}

createUser();
