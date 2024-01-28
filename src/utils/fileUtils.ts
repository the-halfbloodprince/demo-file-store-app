import { PutObjectCommand } from '@aws-sdk/client-s3';
import { User } from '@supabase/supabase-js';

import { secrets } from '../config/secrets';
import { services } from '../config/services';

// fetch files from supabase for this user utility
export const fetchFiles = async () => {
  const { data, error } = await services.supabase.from('files').select();
  if (error) {
    console.error('Error fetching file names');
    console.error(error);
  }
  return data;
};

// get the s3 object key for a file
export const getS3FileName = (fileName: string, user: User) => `${user.id}.+.${fileName}`;

// get s3 url for a file
export const getS3Url = (fileName: string, user: User) =>
  `https://${secrets.aws.bucketName}.s3.${
    secrets.aws.region
  }.amazonaws.com/${getS3FileName(fileName, user)}`;

// upload file to s3
export const uploadFile = async (
  file: File,
  user: User,
  callbacks: {
    uploadedToBucketCallback: () => void;
    savedToDBCallback: () => void;
  },
) => {
  const params = {
    Bucket: secrets.aws.bucketName,
    Key: getS3FileName(file.name, user),
    Body: file,
  };

  try {
    // Upload to S3
    const putObjectCommand = new PutObjectCommand(params);
    const res = await services.s3.send(putObjectCommand);
    console.log(res);
    console.log(`${file.name} uploaded to bucket`);
    callbacks.uploadedToBucketCallback();

    try {
      // Save file to DB
      await services.supabase.from('files').insert({
        file_name: file.name,
      });
      callbacks.savedToDBCallback();
    } catch (err) {
      console.error('Error saving entry to supabase (2/2)');
      console.error(err);
    }
  } catch (err) {
    console.error('Error uploading file');
    console.error(err);
  }
};
