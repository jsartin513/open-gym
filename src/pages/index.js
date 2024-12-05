import Layout from "../components/(layout)/layout.js";
import React, { useEffect } from "react";
import styles from "../styles/Home.module.css";
import { useRouter } from 'next/navigation'


export default function Home() {

  const router = useRouter();

  useEffect(() => {
    router.push('/attendance');
  }, [router]);


  return (  
    <Layout>
      <div className={styles.container}>
        <h1>Home</h1>
        <p>Redirecting to attendance page...</p>
      </div>
    </Layout>

  );
}
