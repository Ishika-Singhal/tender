require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Tender = require('../models/Tender');
const Bid = require('../models/Bid');
const { hashPassword } = require('../utils/passwords');

console.log(process.env.MONGODB_URI);
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📊 MongoDB connected for seeding');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Tender.deleteMany({});
    await Bid.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Create users
    const adminPassword = await hashPassword('Admin@123');
    const buyerPassword = await hashPassword('Buyer@123');
    const sellerPassword = await hashPassword('Seller@123');

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@ti.com',
      passwordHash: adminPassword,
      role: 'admin'
    });

    const buyer = await User.create({
      name: 'John Buyer',
      email: 'buyer@ti.com',
      passwordHash: buyerPassword,
      role: 'buyer'
    });

    const seller = await User.create({
      name: 'Jane Seller',
      email: 'seller@ti.com',
      passwordHash: sellerPassword,
      role: 'seller'
    });

    console.log('👥 Created users');

    // Create tenders
    const tender1 = await Tender.create({
      buyerId: buyer._id,
      title: 'E-commerce Website Development',
      description: 'Need a modern e-commerce website with payment integration, user authentication, and admin panel. Should be mobile responsive and SEO optimized.',
      category: 'IT & Software',
      budgetMin: 5000,
      budgetMax: 15000,
      location: 'Mumbai, India',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      documents: []
    });

    const tender2 = await Tender.create({
      buyerId: buyer._id,
      title: 'Office Building Construction',
      description: 'Construction of a 5-story office building with modern amenities, parking facility, and green building certification requirements.',
      category: 'Construction',
      budgetMin: 500000,
      budgetMax: 800000,
      location: 'Delhi, India',
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
      documents: []
    });

    console.log('📝 Created tenders');

    // Create bids
    const bid1 = await Bid.create({
      tenderId: tender1._id,
      sellerId: seller._id,
      amount: 12000,
      proposal: 'I have 5+ years of experience in e-commerce development using MERN stack. I can deliver a fully functional website with all the mentioned features within 6 weeks.',
      attachments: [],
      status: 'pending'
    });

    const bid2 = await Bid.create({
      tenderId: tender2._id,
      sellerId: seller._id,
      amount: 650000,
      proposal: 'Our construction company has completed 20+ commercial projects. We specialize in green building construction and can complete this project in 18 months.',
      attachments: [],
      status: 'pending'
    });

    console.log('💰 Created bids');

    console.log('\n🎉 Seed data created successfully!');
    console.log('\n📧 Demo Login Credentials:');
    console.log('Admin: admin@ti.com / Admin@123');
    console.log('Buyer: buyer@ti.com / Buyer@123');
    console.log('Seller: seller@ti.com / Seller@123');

  } catch (error) {
    console.error('❌ Seeding error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

const runSeed = async () => {
  await connectDB();
  await seedData();
};

runSeed();
