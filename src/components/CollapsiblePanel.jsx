
import React from 'react';
import styles from '../styles/Home.module.css';

export default function CollapsiblePanel({title, children}) {
  const [isOpen, setIsOpen] = useState(true);

  const toggleOpen = () => {
    setIsOpen(!!!isOpen)
  }

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
