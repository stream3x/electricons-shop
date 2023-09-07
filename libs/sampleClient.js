import { S3Client } from "@aws-sdk/client-s3";
const s3Client = new S3Client({
  region: 'eu-central-1', // Update with your AWS region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});
export { s3Client };