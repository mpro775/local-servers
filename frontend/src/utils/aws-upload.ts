import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY,
  region: process.env.NEXT_PUBLIC_AWS_REGION,
});

export const uploadToS3 = async (
  file: File
): Promise<{ url: string; key: string }> => {
  const Key = `categories/${Date.now()}-${file.name}`;

  const params = {
    Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
    Key,
    Body: file,
  };

  const data = await s3.upload(params).promise();
  return { url: data.Location, key: data.Key };
};
