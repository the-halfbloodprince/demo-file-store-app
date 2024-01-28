import React, { FC } from 'react';

import styles from './Button.module.css';

type Props = {
  onClick: () => void;
  disabled?: any;
};

const Button: FC<Props> = ({ onClick, children, disabled }) => {
  return (
    <button onClick={onClick} disabled={disabled} className={styles.button}>
      {children}
    </button>
  );
};

export default Button;
