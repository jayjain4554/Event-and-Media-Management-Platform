"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
const logger_1 = require("../utils/logger");
const userModel_1 = require("../modules/user/userModel");
const eventModel_1 = require("../modules/event/eventModel");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const seedMockData = async () => {
    try {
        const userCount = await userModel_1.User.countDocuments();
        if (userCount > 0)
            return;
        logger_1.logger.info('🌱 Seeding mock data for development...');
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash('password', salt);
        const systemAdmin = await userModel_1.User.create({
            name: 'System Admin',
            email: 'admin@eventsphere.com',
            passwordHash,
            role: 'Admin',
            referenceSelfieUrl: '',
        });
        logger_1.logger.info(`👤 Seeded Default Admin User: ${systemAdmin.email} (Password: password)`);
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
        await eventModel_1.Event.create(mockEvents);
        logger_1.logger.info('📅 Seeded 3 default Events successfully.');
    }
    catch (seedError) {
        logger_1.logger.error(`❌ Error seeding mock data: ${seedError.message}`);
    }
};
const connectDB = async () => {
    try {
        const mongoUri = env_1.env.MONGO_URI;
        const conn = await mongoose_1.default.connect(mongoUri, { dbName: undefined });
        logger_1.logger.info(`💾 MongoDB Connected: ${conn.connection.host}`);
        // Seed standard events if DB is empty (only in non-production)
        if (env_1.env.NODE_ENV !== 'production') {
            seedMockData();
        }
    }
    catch (error) {
        logger_1.logger.error(`❌ MongoDB connection failed: ${error.message}`);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
