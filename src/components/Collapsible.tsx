import React, { FC } from 'react';

import styles from './Collapsible.module.css';

type Props = {
  summary: string;
  content: string;
};

const Collapsible: FC<Props> = ({ summary, content }) => {
  return (
    <details className={styles.collapsible}>
      <summary>
        Expand to view <span className={styles.summary}>{summary}</span>
      </summary>
      <code>{content}</code>
    </details>
  );
};

export default Collapsible;
