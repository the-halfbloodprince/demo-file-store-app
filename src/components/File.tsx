import path from 'path-browserify';
import React, { FC, useContext } from 'react';
import { FaEye } from 'react-icons/fa';
import { FaLink } from 'react-icons/fa6';
import { MdDeleteForever } from 'react-icons/md';

import { userContext } from '../contexts/UserContext';
import { deleteFile, getS3Url } from '../utils/fileUtils';
import styles from './File.module.css';

type FileDetails = any;

type Props = {
  fileDetails: FileDetails;
  onClick: () => void;
};

const FileRow: FC<Props> = ({ fileDetails, onClick }) => {
  const user = useContext(userContext);

  if (!user) return null;

  const fileURL = getS3Url(fileDetails.file_name, user);

  return (
    <li className={styles.file}>
      <p>{fileDetails.file_name}</p>
      <div className={styles.buttons}>
        <button className={styles.smallButton} onClick={onClick}>
          <FaEye />
        </button>
        <a className={styles.smallButton} href={fileURL} target="_blank" rel="noreferrer">
          <FaLink />
        </a>
        <button
          className={styles.smallButton}
          onClick={() => deleteFile(fileDetails.file_name)}
        >
          <MdDeleteForever color="red" />
        </button>
      </div>
    </li>
  );
};

export default FileRow;
