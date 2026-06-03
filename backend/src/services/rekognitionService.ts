import {
  RekognitionClient,
  DetectLabelsCommand,
  CreateCollectionCommand,
  IndexFacesCommand,
  SearchFacesByImageCommand,
  DetectFacesCommand,
  DeleteFacesCommand,
} from '@aws-sdk/client-rekognition';
import sharp from 'sharp';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import { User } from '../modules/user/userModel';

const isAwsConfigured = (): boolean => {
  return !!(
    env.AWS_ACCESS_KEY_ID &&
    env.AWS_SECRET_ACCESS_KEY
  );
};

let rekognitionClient: RekognitionClient | null = null;
export const REKOGNITION_COLLECTION_ID = 'eventsphere_faces';

const cropFaceRegion = async (
  imageBuffer: Buffer,
  boundingBox: { Width: number; Height: number; Left: number; Top: number }
): Promise<Buffer> => {
  const image = sharp(imageBuffer);
  const metadata = await image.metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error('Unable to determine image dimensions for face crop.');
  }

  const left = Math.max(0, Math.floor(boundingBox.Left * metadata.width));
  const top = Math.max(0, Math.floor(boundingBox.Top * metadata.height));
  const width = Math.max(
    1,
    Math.min(Math.floor(boundingBox.Width * metadata.width), metadata.width - left)
  );
  const height = Math.max(
    1,
    Math.min(Math.floor(boundingBox.Height * metadata.height), metadata.height - top)
  );

  return await image
    .extract({ left, top, width, height })
    .resize({ width: Math.max(64, width), height: Math.max(64, height), fit: 'cover' })
    .jpeg()
    .toBuffer();
};

if (isAwsConfigured()) {
  rekognitionClient = new RekognitionClient({
    region: env.AWS_REGION,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY || '',
    },
  });
  logger.info('🚀 AWS Rekognition service initialized successfully (Production Mode).');

  // Asynchronously initialize collection on start
  const initCollection = async () => {
    try {
      const command = new CreateCollectionCommand({
        CollectionId: REKOGNITION_COLLECTION_ID,
      });
      await rekognitionClient!.send(command);
      logger.info(`✨ AWS Rekognition Face Collection "${REKOGNITION_COLLECTION_ID}" created successfully.`);
    } catch (error: any) {
      if (error.name === 'ResourceAlreadyExistsException') {
        logger.info(`✨ AWS Rekognition Face Collection "${REKOGNITION_COLLECTION_ID}" already exists.`);
      } else {
        logger.error(`❌ AWS Rekognition Collection Initialization Error: ${error.message}`);
      }
    }
  };
  initCollection();
} else {
  logger.warn('⚠️ AWS Rekognition credentials missing. Using local vector simulation fallback (Mock Mode).');
}

export interface TagResult {
  label: string;
  confidence: number;
}

export interface DetectedFaceResult {
  boundingBox: {
    Width: number;
    Height: number;
    Left: number;
    Top: number;
  };
  faceEmbedding: number[];
}

export interface RekognitionMatchResult {
  boundingBox: {
    Width: number;
    Height: number;
    Left: number;
    Top: number;
  };
  matchedUserId?: string;
  faceMatchScore?: number;
}

// Predefined set of rich mock tags for simulated tagging
const MOCK_LABELS_POOL = [
  'sports', 'crowd', 'stage', 'dance', 'food', 'concert', 'academic', 'party',
  'presentation', 'gathering', 'happiness', 'celebration', 'indoor', 'outdoor',
  'group photo', 'smiling', 'ceremony', 'workshop', 'discussion'
];

export const detectLabels = async (fileBuffer: Buffer, fileName: string): Promise<TagResult[]> => {
  if (rekognitionClient) {
    try {
      const command = new DetectLabelsCommand({
        Image: { Bytes: fileBuffer },
        MaxLabels: 10,
        MinConfidence: 75,
      });

      const response = await rekognitionClient.send(command);
      return (
        response.Labels?.map((label) => ({
          label: label.Name?.toLowerCase() || '',
          confidence: label.Confidence || 80,
        })).filter((l) => l.label !== '') || []
      );
    } catch (error: any) {
      logger.error(`❌ AWS Rekognition Tagging Error: ${error.message}`);
    }
  }

  // Mock Tagging Logic (Rule-based based on filename clues + random high quality labels)
  const filenameLower = fileName.toLowerCase();
  const detected: TagResult[] = [];

  MOCK_LABELS_POOL.forEach((poolTag) => {
    if (filenameLower.includes(poolTag)) {
      detected.push({ label: poolTag, confidence: 95 + Math.random() * 4 });
    }
  });

  const numLabelsNeeded = Math.max(3, 6 - detected.length);
  const shuffled = [...MOCK_LABELS_POOL].sort(() => 0.5 - Math.random());
  
  for (let i = 0; i < numLabelsNeeded; i++) {
    const candidate = shuffled[i];
    if (!detected.some((d) => d.label === candidate)) {
      detected.push({
        label: candidate,
        confidence: 75 + Math.random() * 20,
      });
    }
  }

  return detected;
};

// Index user selfie face embedding inside AWS Rekognition collection
export const deleteFaceFromCollection = async (faceId: string): Promise<void> => {
  if (!rekognitionClient || !faceId) return;

  try {
    const command = new DeleteFacesCommand({
      CollectionId: REKOGNITION_COLLECTION_ID,
      FaceIds: [faceId],
    });
    await rekognitionClient.send(command);
    logger.info(`🗑️ Deleted stale Rekognition face record: ${faceId}`);
  } catch (error: any) {
    logger.warn(`⚠️ Failed to delete stale Rekognition face record ${faceId}: ${error.message}`);
  }
};

export const indexSelfieFace = async (
  fileBuffer: Buffer,
  userId: string
): Promise<string | null> => {
  if (rekognitionClient) {
    try {
      const command = new IndexFacesCommand({
        CollectionId: REKOGNITION_COLLECTION_ID,
        Image: { Bytes: fileBuffer },
        ExternalImageId: userId,
        MaxFaces: 1,
        DetectionAttributes: ['DEFAULT'],
      });

      const response = await rekognitionClient.send(command);
      const faceRecord = response.FaceRecords?.[0];
      
      if (faceRecord?.Face?.FaceId) {
        logger.info(`✨ Successfully indexed user selfie in Rekognition. FaceId: ${faceRecord.Face.FaceId}`);
        return faceRecord.Face.FaceId;
      }
      logger.warn('⚠️ No face detected in user selfie image.');
      return null;
    } catch (error: any) {
      logger.error(`❌ AWS Rekognition IndexFaces Error: ${error.message}`);
    }
  }

  // Fallback / Mock Mode FaceId
  const mockFaceId = `face_mock_${Math.random().toString(36).substring(2, 10)}`;
  logger.info(`🌱 Simulated index face (Mock Mode). FaceId: ${mockFaceId}`);
  return mockFaceId;
};

// Match uploaded event photo against indexed users in Rekognition collection
export const matchFacesInPhoto = async (
  fileBuffer: Buffer
): Promise<RekognitionMatchResult[]> => {
  const results: RekognitionMatchResult[] = [];

  if (rekognitionClient) {
    try {
      const detectCommand = new DetectFacesCommand({
        Image: { Bytes: fileBuffer },
        Attributes: ['DEFAULT'],
      });

      const detectResponse = await rekognitionClient.send(detectCommand);
      const faceDetails = detectResponse.FaceDetails || [];
      logger.info(`🔍 Rekognition detected ${faceDetails.length} faces in uploaded event photo.`);

      for (const detail of faceDetails) {
        const box = detail.BoundingBox;
        if (!box) continue;

        const boundingBox = {
          Width: box.Width || 0,
          Height: box.Height || 0,
          Left: box.Left || 0,
          Top: box.Top || 0,
        };

        let matchedUserId: string | undefined = undefined;
        let faceMatchScore: number | undefined = undefined;

        try {
          const faceImage = await cropFaceRegion(fileBuffer, box);
          const searchCommand = new SearchFacesByImageCommand({
            CollectionId: REKOGNITION_COLLECTION_ID,
            Image: { Bytes: faceImage },
            FaceMatchThreshold: 80,
            MaxFaces: 1,
            QualityFilter: 'AUTO',
          });

          const searchResponse = await rekognitionClient.send(searchCommand);
          const match = searchResponse.FaceMatches?.[0];

          if (match && match.Face?.ExternalImageId) {
            matchedUserId = match.Face.ExternalImageId;
            faceMatchScore = match.Similarity || 80;
            logger.info(`🎯 Face Match Found! Matched User: ${matchedUserId} (Confidence: ${faceMatchScore}%)`);
          }
        } catch (searchError: any) {
          logger.error(`❌ AWS Rekognition SearchFacesByImage Error: ${searchError.message}`);
        }

        results.push({
          boundingBox,
          matchedUserId,
          faceMatchScore,
        });
      }

      return results;
    } catch (error: any) {
      logger.error(`❌ AWS Rekognition matchFacesInPhoto Error: ${error.message}`);
    }
  }

  // Fallback / Mock Mode: Simulate matching against registered users who have registered selfies
  try {
    const enrolledUsers = await User.find({
      $or: [
        { faceEmbedding: { $exists: true, $ne: [] } },
        { rekognitionFaceId: { $exists: true, $ne: '' } }
      ]
    });

    const count = Math.floor(Math.random() * 3) + 1; // 1 to 3 mock faces
    for (let i = 0; i < count; i++) {
      let matchedUserId: string | undefined = undefined;
      let faceMatchScore: number | undefined = undefined;

      // 40% chance to match a random enrolled user to simulate spotted updates
      if (enrolledUsers.length > 0 && Math.random() < 0.4) {
        const randomUser = enrolledUsers[Math.floor(Math.random() * enrolledUsers.length)];
        matchedUserId = randomUser._id.toString();
        faceMatchScore = 85 + Math.random() * 14;
      }

      results.push({
        boundingBox: {
          Width: 0.15 + Math.random() * 0.1,
          Height: 0.15 + Math.random() * 0.1,
          Left: 0.1 + Math.random() * 0.6,
          Top: 0.1 + Math.random() * 0.5,
        },
        matchedUserId,
        faceMatchScore,
      });
    }
  } catch (err: any) {
    logger.error(`❌ Mock Face Matching Error: ${err.message}`);
  }

  return results;
};

// =========================================================================
// BACKWARD COMPATIBILITY EXPORTS FOR MOCK / DEPRECATED CONTROLLERS FLOWS
// =========================================================================

export const generateMockEmbedding = (): number[] => {
  const embedding: number[] = [];
  let sumSq = 0;
  for (let i = 0; i < 128; i++) {
    const val = Math.random() * 2 - 1;
    embedding.push(val);
    sumSq += val * val;
  }
  const magnitude = Math.sqrt(sumSq);
  return embedding.map((v) => v / magnitude);
};

export const detectFaces = async (
  fileBuffer: Buffer,
  fileName: string
): Promise<DetectedFaceResult[]> => {
  const count = Math.floor(Math.random() * 3) + 1;
  const results: DetectedFaceResult[] = [];

  for (let i = 0; i < count; i++) {
    results.push({
      boundingBox: {
        Width: 0.15 + Math.random() * 0.1,
        Height: 0.15 + Math.random() * 0.1,
        Left: 0.1 + Math.random() * 0.6,
        Top: 0.1 + Math.random() * 0.5,
      },
      faceEmbedding: generateMockEmbedding(),
    });
  }

  return results;
};

export const computeCosineSimilarity = (vecA: number[], vecB: number[]): number => {
  if (vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

// Directly searches faces by image inside AWS Rekognition collection for the largest face
export const searchFacesByImage = async (
  fileBuffer: Buffer
): Promise<{ matchedUserId: string; confidence: number }[]> => {
  if (rekognitionClient) {
    try {
      const command = new SearchFacesByImageCommand({
        CollectionId: REKOGNITION_COLLECTION_ID,
        Image: { Bytes: fileBuffer },
        FaceMatchThreshold: 80,
        MaxFaces: 5,
      });
      const response = await rekognitionClient.send(command);
      return response.FaceMatches?.map(match => ({
        matchedUserId: match.Face?.ExternalImageId || '',
        confidence: match.Similarity || 80,
      })).filter(m => m.matchedUserId !== '') || [];
    } catch (error: any) {
      logger.error(`❌ AWS Rekognition SearchFacesByImage Error: ${error.message}`);
    }
  }
  return [];
};
