import React from "react";
import styles from "../../styles/Home.module.css";

export default function Footer({ children }) {
  return (
    <footer className={styles.footer}>
      <a
        href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
        target="_blank"
        rel="noopener noreferrer"
      >
        Powered by {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/vercel.svg" alt="Vercel" className={styles.logo} />
      </a>
      <style jsx>{`
        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
        }
      `}</style>
    </footer>
  );
}
