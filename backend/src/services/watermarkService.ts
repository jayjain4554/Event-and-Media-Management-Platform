import sharp from 'sharp';
import { logger } from '../utils/logger';

export interface WatermarkOptions {
  clubName: string;
  eventName: string;
  userRole: string;
}

export const applyWatermark = async (
  imageBuffer: Buffer,
  options: WatermarkOptions
): Promise<Buffer> => {
  try {
    const { clubName, eventName, userRole } = options;
    
    // Get metadata of original image to size the watermark layer dynamically
    const metadata = await sharp(imageBuffer).metadata();
    const width = metadata.width || 1200;
    const height = metadata.height || 800;

    // Create a vector SVG text layer scaled to the image size
    const svgWidth = width;
    const svgHeight = height;

    const watermarkText = `EventSphere © ${clubName} - ${eventName} | User: ${userRole}`;
    
    // Size relative to image dimensions
    const fontSize = Math.max(14, Math.floor(width / 40));
    
    const svgOverlay = `
      <svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
        <style>
          .watermark {
            fill: rgba(255, 255, 255, 0.45);
            stroke: rgba(0, 0, 0, 0.2);
            stroke-width: 1px;
            font-family: 'Helvetica Neue', 'Outfit', 'Inter', sans-serif;
            font-size: ${fontSize}px;
            font-weight: bold;
            text-anchor: end;
          }
          .diagonal-watermark {
            fill: rgba(255, 255, 255, 0.08);
            font-family: 'Helvetica Neue', sans-serif;
            font-size: ${fontSize * 2.5}px;
            font-weight: 900;
            text-anchor: middle;
          }
        </style>
        
        <!-- Large diagonal screen background watermark -->
        <text x="${svgWidth / 2}" y="${svgHeight / 2}" transform="rotate(-30, ${svgWidth / 2}, ${svgHeight / 2})" class="diagonal-watermark">
          ${clubName.toUpperCase()}
        </text>

        <!-- Solid bottom-right brand watermark -->
        <text x="${svgWidth - 24}" y="${svgHeight - 24}" class="watermark">
          ${watermarkText}
        </text>
      </svg>
    `;

    // Composite SVG overlay onto original buffer using Sharp
    const watermarkedBuffer = await sharp(imageBuffer)
      .composite([
        {
          input: Buffer.from(svgOverlay),
          top: 0,
          left: 0,
        },
      ])
      .toBuffer();

    return watermarkedBuffer;
  } catch (error: any) {
    logger.error(`❌ Sharp Watermarking Error: ${error.message}`);
    // If watermarking fails for any reason, return the original image to avoid blocking the user download
    return imageBuffer;
  }
};
