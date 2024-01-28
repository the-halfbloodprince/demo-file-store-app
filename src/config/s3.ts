import { S3Client } from '@aws-sdk/client-s3';

import { secrets } from './secrets';

const s3Client = new S3Client({
  credentials: {
    accessKeyId: secrets.aws.accessKeyID,
    secretAccessKey: secrets.aws.secretAccessKey,
    sessionToken: secrets.aws.sessionToken,
  },
  region: secrets.aws.region,
});

export default s3Client;
