import { S3Client } from "bun";

export const client = new S3Client({
    accessKeyId: Bun.env.ACCESS_KEY_ID,
    secretAccessKey: Bun.env.SECRET_ACCESS_KEY,
    bucket: Bun.env.SEVALLA_BUCKET,
    endpoint: Bun.env.SEVALLA_ENDPOINT,
});