
import styles from '../../styles/Home.module.css';

const CollapsiblePanel = ({ title, isOpen, toggleOpen, children }) => (
    <div className={isOpen ? styles.collapsiblePanel.open : styles.collapsiblePanel}>
      <h2>
        {title}
        <button onClick={toggleOpen} className={styles.toggleButton}>
          {isOpen ? 'Hide' : 'Show'}
        </button>
      </h2>
      {isOpen && children}
    </div>
  );

export default CollapsiblePanel;