"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
// Load environment variables
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    PORT: zod_1.z.coerce.number().default(5000),
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    // Primary connection strings: allow either a standard MONGO_URI or an Atlas-style MONGO_ATLAS_URI
    MONGO_URI: zod_1.z.string().optional(),
    MONGO_ATLAS_URI: zod_1.z.string().optional(),
    JWT_SECRET: zod_1.z.string().min(8, { message: "JWT_SECRET must be at least 8 characters" }),
    JWT_EXPIRES_IN: zod_1.z.string().default('7d'),
    AWS_ACCESS_KEY_ID: zod_1.z.string().optional().or(zod_1.z.literal('')),
    AWS_SECRET_ACCESS_KEY: zod_1.z.string().optional().or(zod_1.z.literal('')),
    AWS_REGION: zod_1.z.string().default('us-east-1'),
    AWS_S3_BUCKET_NAME: zod_1.z.string().optional().or(zod_1.z.literal('')),
    CLOUDFRONT_URL: zod_1.z.string().optional().or(zod_1.z.literal('')),
    CLOUDINARY_CLOUD_NAME: zod_1.z.string().optional().or(zod_1.z.literal('')),
    CLOUDINARY_API_KEY: zod_1.z.string().optional().or(zod_1.z.literal('')),
    CLOUDINARY_API_SECRET: zod_1.z.string().optional().or(zod_1.z.literal('')),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    console.error("❌ Invalid environment configuration:");
    console.error(JSON.stringify(parsed.error.format(), null, 2));
    process.exit(1);
}
// Allow caller to provide either MONGO_ATLAS_URI (preferred) or MONGO_URI.
const chosenMongo = parsed.data.MONGO_ATLAS_URI || parsed.data.MONGO_URI;
if (!chosenMongo) {
    console.error('❌ MONGO_ATLAS_URI or MONGO_URI must be provided in the environment.');
    process.exit(1);
}
// Expose a normalized env object where MONGO_URI holds the final connection string
const finalEnv = {
    ...parsed.data,
    MONGO_URI: chosenMongo,
};
exports.env = finalEnv;
