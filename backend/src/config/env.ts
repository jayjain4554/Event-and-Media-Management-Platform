import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables
dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  // Primary connection strings: allow either a standard MONGO_URI or an Atlas-style MONGO_ATLAS_URI
  MONGO_URI: z.string().optional(),
  MONGO_ATLAS_URI: z.string().optional(),
  JWT_SECRET: z.string().min(8, { message: "JWT_SECRET must be at least 8 characters" }),
  JWT_EXPIRES_IN: z.string().default('7d'),
  AWS_ACCESS_KEY_ID: z.string().optional().or(z.literal('')),
  AWS_SECRET_ACCESS_KEY: z.string().optional().or(z.literal('')),
  AWS_REGION: z.string().default('us-east-1'),
  AWS_S3_BUCKET_NAME: z.string().optional().or(z.literal('')),
  CLOUDFRONT_URL: z.string().optional().or(z.literal('')),
  CLOUDINARY_CLOUD_NAME: z.string().optional().or(z.literal('')),
  CLOUDINARY_API_KEY: z.string().optional().or(z.literal('')),
  CLOUDINARY_API_SECRET: z.string().optional().or(z.literal('')),
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

export const env = finalEnv;
export type EnvConfig = z.infer<typeof envSchema>;
