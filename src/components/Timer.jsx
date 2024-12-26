import React, { useEffect, useState } from "react";
import styles from "../styles/GamesPage.module.css";

const Timer = ({ mode }) => {
  const [gameTimer, setGameTimer] = useState(180);
  const [gameLength, setGameLength] = useState(180);
  const [preGameCountdown, setPreGameCountdown] = useState(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const toggleGameDuration = () => {
    setGameLength(gameLength === 180 ? 90 : 180);
    setGameTimer(gameLength === 180 ? 90 : 180);
    clearInterval();
  };

  useEffect(() => {
    if (preGameCountdown !== null) {
      const countdownInterval = setInterval(() => {
        setPreGameCountdown((prev) => {
          if (prev > 1) {
            return prev - 1;
          } else {
            clearInterval(countdownInterval);
            setIsTimerRunning(true);
            return null;
          }
        });
      }, 1000);
    }
  }, [preGameCountdown]);

  useEffect(() => {
    let timerInterval;
    if (isTimerRunning) {
      timerInterval = setInterval(() => {
        setGameTimer((prev) => {
          if (prev > 0) {
            return prev - 1;
          } else {
            clearInterval(timerInterval);
            setIsTimerRunning(false);
            return 0;
          }
        });
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [isTimerRunning]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleStartGame = () => {
    setPreGameCountdown(5); // 5 seconds countdown
  };

  const handleEndGame = () => {
    setIsTimerRunning(false);
    setGameTimer(gameLength);
  };

  return (
    <div className={styles.timerPanel}>
      <h2>Game Timer</h2>

      {mode === "cloth" && !isTimerRunning && (
        <button onClick={toggleGameDuration}>
          Toggle to {gameTimer === 180 ? "90 seconds" : "3 minutes"}
        </button>
      )}

      {preGameCountdown !== null ? (
        <p>Starting in {preGameCountdown}...</p>
      ) : (
        <p className={gameTimer <= 10 ? styles.flashingTimer : ""}>
          {formatTime(gameTimer)}{" "}
          {gameTimer <= 0 && (mode === "cloth" ? "Game Over!" : "No Blocking!")}
        </p>
      )}
      <button
        onClick={handleStartGame}
        disabled={isTimerRunning && preGameCountdown === null}
      >
        Start Game
      </button>
      <button onClick={handleEndGame} disabled={!isTimerRunning}>
        End Game
      </button>
    </div>
  );
};

export default Timer;
