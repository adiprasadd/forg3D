import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "./config";

export class S3Service {
  private bucket: string;

  constructor() {
    this.bucket = process.env.AWS_BUCKET_NAME || '';
  }

  async generateUploadUrl(filename: string, contentType: string): Promise<string> {
    const fileExt = filename.toLowerCase().split('.').pop();
    if (!fileExt || !ALLOWED_FILE_TYPES.includes(`.${fileExt}`)) {
      throw new Error('File type not supported');
    }

    const key = `models/${Date.now()}-${filename}`;
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType
    });

    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  }

  async generateDownloadUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key
    });

    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  }

  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key
    });

    await s3Client.send(command);
  }
}

export const s3Service = new S3Service(); 