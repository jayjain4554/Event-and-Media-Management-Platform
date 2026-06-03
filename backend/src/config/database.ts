import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../utils/logger';
import { User } from '../modules/user/userModel';
import { Event } from '../modules/event/eventModel';
import bcrypt from 'bcryptjs';

const seedMockData = async (): Promise<void> => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) return;

    logger.info('🌱 Seeding mock data for development...');

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password', salt);

    const systemAdmin = await User.create({
      name: 'System Admin',
      email: 'admin@eventsphere.com',
      passwordHash,
      role: 'Admin',
      referenceSelfieUrl: '',
    });

    logger.info(`👤 Seeded Default Admin User: ${systemAdmin.email} (Password: password)`);

    const mockEvents = [
      {
        title: 'Beach Cleanup Campaign',
        description: 'Join us in keeping our coastlines clean and plastic-free! Bring gloves and standard bags. Free refreshments provided.',
        date: new Date(),
        location: 'Marina Coastal Beach',
        category: 'Social',
        coverImage: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800',
        visibility: 'public',
        createdBy: systemAdmin._id,
      },
      {
        title: 'Annual Innovation Hackathon 2026',
        description: 'Vibrant innovation, endless coding and prototype demonstrations. Form groups of 4 and bring your best ideas to light!',
        date: new Date(Date.now() - 86400000),
        location: 'Engineering Tech Lab 4',
        category: 'Academic',
        coverImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
        visibility: 'public',
        createdBy: systemAdmin._id,
      },
      {
        title: 'Graduation Gala Ceremony',
        description: 'An elegant celebration of academic achievements, diplomas presentation, and final milestones with families and club members.',
        date: new Date(Date.now() - 172800000),
        location: 'Grand Millennium Ballroom',
        category: 'Ceremony',
        coverImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
        visibility: 'private',
        createdBy: systemAdmin._id,
      },
    ];

    await Event.create(mockEvents);
    logger.info('📅 Seeded 3 default Events successfully.');
  } catch (seedError: any) {
    logger.error(`❌ Error seeding mock data: ${seedError.message}`);
  }
};

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = env.MONGO_URI;
    const conn = await mongoose.connect(mongoUri, { dbName: undefined });
    logger.info(`💾 MongoDB Connected: ${conn.connection.host}`);
    // Seed standard events if DB is empty (only in non-production)
    if (env.NODE_ENV !== 'production') {
      seedMockData();
    }
  } catch (error: any) {
    logger.error(`❌ MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};
