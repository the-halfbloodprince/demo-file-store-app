import React, { FC } from 'react';

import config from '../config';

type FileDetails = any;

type Props = {
  fileDetails: FileDetails;
};

const FileRow: FC<Props> = ({ fileDetails }) => {
  const fileURL = `https://${config.aws.bucketName}.s3.${config.aws.region}.amazonaws.com/${fileDetails.file_name}`;

  return (
    <li>
      <a href={fileURL} target="_blank" rel="noreferrer">
        {fileDetails.file_name}
      </a>
    </li>
  );
};

export default FileRow;
