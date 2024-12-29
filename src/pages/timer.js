import React, { useState } from "react";
import Layout from "../components/(layout)/layout";
import Timer from "../components/Timer";
import styles from "../styles/TimerPage.module.css";

const TimerPage = () => {
  const [mode, setMode] = useState("foam");

  const handleModeChange = (newMode) => {
    setMode(newMode);
  };

  return (
    <Layout>
      <div className={styles.timerPage}>
        <h1>Ball type</h1>
        <div className={styles.modeSelector}>
          <button
            className={styles.btn}
            onClick={() => handleModeChange("foam")}
            disabled={mode === "foam"}
          >
            Foam
          </button>
          <button
            className={styles.btn}
            onClick={() => handleModeChange("cloth")}
            disabled={mode === "cloth"}
          >
            Cloth
          </button>
        </div>
        <Timer mode={mode} />
      </div>
    </Layout>
  );
};

export default TimerPage;
