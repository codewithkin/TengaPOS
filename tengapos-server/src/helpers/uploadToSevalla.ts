import { client } from '../config/s3Client'
import { randomUUID } from 'crypto'

/**
 * Uploads a base64 string (raw or data URL) to Sevalla (R2-compatible) using Bun S3 API.
 * Returns the public URL of the uploaded file.
 */
export async function uploadToSevalla(base64String: string): Promise<string> {
    console.log("Base64 string: ", base64String.slice(0, 30) + "...");

    let mimeType = 'image/jpeg'; // default mime type
    let base64Data = base64String;

    // Try to parse as data URL
    const matches = base64String.match(/^data:(.+);base64,(.+)$/);
    if (matches && matches.length === 3) {
        mimeType = matches[1];
        base64Data = matches[2];
    } else {
        // No data URL prefix, treat whole string as base64 data
        // Optionally: validate base64 format here
    }

    const extension = mimeType.split('/')[1] || 'bin';
    const buffer = Buffer.from(base64Data, 'base64');

    const fileName = `uploads/${randomUUID()}.${extension}`;

    const s3file = client.file(fileName);

    await s3file.write(buffer, { type: mimeType });

    if (Bun.env.SEVALLA_PUBLIC_URL) {
        const fileUrl = `${Bun.env.SEVALLA_PUBLIC_URL.replace(/\/$/, '')}/${fileName}`;
        return fileUrl;
    }

    return "Oh no";
}