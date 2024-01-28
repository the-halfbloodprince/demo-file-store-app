// import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';
import path from 'path-browserify';
import React, { FC, useContext, useState } from 'react';

import { userContext } from '../contexts/UserContext';
import { getS3Url } from '../utils/fileUtils';
import FileRow from './File';
import styles from './YourFiles.module.css';

type Props = {
  files: any[];
};

const YourFiles: FC<Props> = ({ files }) => {
  const [currentFileName, setCurrentFileName] = useState(null);

  const user = useContext(userContext);

  const currentFileExtension = currentFileName && path.extname(currentFileName).slice(1);
  console.log(`extension of ${currentFileName}: ${currentFileExtension}`);

  return (
    <div>
      <div className={styles.filesHeader}>
        <h3>Your Files</h3>
      </div>
      <div className={styles.panes}>
        <div className={styles.leftPane}>
          <div className={styles.filesList}>
            {files?.map((file, idx) => (
              <FileRow
                fileDetails={file}
                key={idx}
                onClick={() => setCurrentFileName(file.file_name)}
              />
            ))}
          </div>
        </div>
        {currentFileName && user && (
          <div className={styles.rightPane}>
            <img
              src={getS3Url(currentFileName, user)}
              alt={getS3Url(currentFileName, user)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default YourFiles;
