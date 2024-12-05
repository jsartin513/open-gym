
import React from 'react';
import styles from '../styles/Home.module.css';

export default function CollapsiblePanel({title, isOpen, toggleOpen, children}) {
    return(<div className={isOpen ? styles.collapsiblePanel.open : styles.collapsiblePanel}>
      <h2>
        {title}
        <button onClick={toggleOpen} className={styles.toggleButton}>
          {isOpen ? 'Hide' : 'Show'}
        </button>
      </h2>
      {isOpen && children}
    </div>);
};
