import sharp from 'sharp'

/**
 * Maximum image dimension (width or height)
 * Images larger than this will be resized proportionally
 */
const MAX_DIMENSION = 800

/**
 * WebP compression quality (0-100)
 */
const WEBP_QUALITY = 80

/**
 * Compresses an image buffer to WebP format with reduced dimensions.
 * Images are resized to fit within MAX_DIMENSION while maintaining aspect ratio.
 *
 * @param buffer - Raw image data (any supported format)
 * @returns Compressed WebP buffer
 */
export async function compressImage(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .resize(MAX_DIMENSION, MAX_DIMENSION, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer()
}

/**
 * Compresses an image from a File object (browser)
 *
 * @param file - File object from file input
 * @returns Compressed WebP buffer
 */
export async function compressImageFromFile(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  return compressImage(buffer)
}

/**
 * Gets image metadata (dimensions, format)
 *
 * @param buffer - Image buffer
 * @returns Image metadata
 */
export async function getImageMetadata(buffer: Buffer) {
  return sharp(buffer).metadata()
}

/**
 * Maximum file size for upload (5MB before compression)
 */
export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024

/**
 * Validates that a file is an image and within size limits
 *
 * @param file - File to validate
 * @returns Validation result with error message if invalid
 */
export function validateImageFile(file: File): {
  valid: boolean
  error?: string
} {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/avif',
  ]

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP, AVIF',
    }
  }

  if (file.size > MAX_UPLOAD_SIZE) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${MAX_UPLOAD_SIZE / 1024 / 1024}MB`,
    }
  }

  return { valid: true }
}
