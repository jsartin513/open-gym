import React from 'react';
import Link from 'next/link';
import styles from './LeftNav.module.css';

const LeftNav = () => {
  return (
    <nav className={`${styles.nav} ${styles.printHidden}`}>
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
      </ul>
    </nav>
  );
};

export default LeftNav;