import React, { useState } from 'react';
import Link from 'next/link';
import styles from './LeftNav.module.css';

const LeftNav = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleNav = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <nav className={`${styles.nav} ${styles.printHidden} ${isCollapsed ? styles.collapsed : ''}`}>
      <button onClick={toggleNav} className={styles.toggleButton}>
        {isCollapsed ? '>>>' : '<<<'}
      </button>
      {!isCollapsed && (
        <ul>
          <li>
            <Link href="/attendance">Attendance</Link>
          </li>
          <li>
            <Link href="/teams">Teams</Link>
          </li>
          <li>
            <Link href="/games">Games</Link>
          </li>
          <li>
            <Link href="/timer">Timer</Link>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default LeftNav;