import { S3Client } from "bun";

export const client = new S3Client({
    accessKeyId: "0191009d0e80e1c4f036121122a4b058",
    secretAccessKey: "eeba2759e674ff54b04b446090e97651305008cec640476f1d2440c1e2721c7c",
    bucket: "tengapos-object-storage-ajcxq",
    endpoint: "https://f6d1d15e6f0b37b4b8fcad3c41a7922d.r2.cloudflarestorage.com",
});