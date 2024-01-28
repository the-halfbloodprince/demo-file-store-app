import React, { FC, useContext } from 'react';

import { userContext } from '../contexts/UserContext';
import { getS3Url } from '../utils/fileUtils';
import styles from './File.module.css';

type FileDetails = any;

type Props = {
  fileDetails: FileDetails;
};

const FileRow: FC<Props> = ({ fileDetails }) => {
  const user = useContext(userContext);

  if (!user) return null;

  const fileURL = getS3Url(fileDetails.file_name, user);

  return (
    <li className={styles.file}>
      <a href={fileURL} target="_blank" rel="noreferrer">
        {fileDetails.file_name}
      </a>
    </li>
  );
};

export default FileRow;
