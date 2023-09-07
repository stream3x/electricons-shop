const { S3Client, ListBucketsCommand } = require('@aws-sdk/client-s3');

// Set your AWS credentials (not recommended to hard-code them)
const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
};

// Set the AWS region (replace 'us-east-1' with your desired region)
const region = 'us-east-1';

// Create an S3 client
const s3Client = new S3Client({ region, credentials });

// Check connection by listing buckets
const listBuckets = new ListBucketsCommand({});

s3Client.send(listBuckets)
  .then(data => {
    console.log('Connected to AWS');
    console.log('Buckets:', data.Buckets);
  })
  .catch(err => {
    console.error('Error connecting to AWS:', err);
  });
