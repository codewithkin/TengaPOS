import { client } from '../config/s3Client'
import { randomUUID } from 'crypto'

/**
 * Uploads a base64 string (data URL) to Sevalla (R2-compatible) using Bun S3 API.
 * Returns the public URL of the uploaded file.
 */
export async function uploadToSevalla(base64String: string): Promise<string> {
    // Parse the base64 data URL
    const matches = base64String.match(/^data:(.+);base64,(.+)$/)
    if (!matches || matches.length !== 3) {
        throw new Error('Invalid base64 string format')
    }

    const mimeType = matches[1]
    const base64Data = matches[2]
    const extension = mimeType.split('/')[1] || 'bin'
    const buffer = Buffer.from(base64Data, 'base64')

    // Generate file path/key
    const fileName = `uploads/${randomUUID()}.${extension}`

    // Get a reference to the S3 file
    const s3file = client.file(fileName)

    // Write the buffer to the file with content type
    await s3file.write(buffer, { type: mimeType })

    if (Bun.env.SEVALLA_ENDPOINT) {

        // Construct the file URL (adjust if needed)
        const fileUrl = `${Bun.env.SEVALLA_ENDPOINT.replace(/\/$/, '')}/${fileName}`

        return fileUrl
    }

    return "Oh no";
}