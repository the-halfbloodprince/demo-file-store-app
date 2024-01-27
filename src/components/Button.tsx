import React, { FC } from 'react';

import styles from './Button.module.css';

type Props = {
  onClick: () => void;
};

const Button: FC<Props> = ({ onClick, children }) => {
  return (
    <button onClick={onClick} className={styles.button}>
      {children}
    </button>
  );
};

export default Button;
