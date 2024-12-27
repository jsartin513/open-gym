import React, { useEffect, useState } from "react";
import styles from "../styles/GamesPage.module.css";

const Timer = ({ mode }) => {
  const [gameTimer, setGameTimer] = useState(180);
  const [gameLength, setGameLength] = useState(180);
  const [preGameCountdown, setPreGameCountdown] = useState(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  function speak(text) {
    console.log("Speaking:", text);
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  }

  function speakTimeIfRelevant(timerSeconds) {
    const seconds = timerSeconds - 2; // speak 2 seconds before the actual time
    console.log("Checking speak time:", seconds);
    if (seconds === 0){
        speak("Game over");
    }
    else if (seconds === 60){
        speak("One minute left");
    }
    else if (seconds % 60 === 0) {
      speak(`${seconds / 60} minutes left`);
    } else if ([30, 20, 10].includes(seconds)) {
      speak(`${seconds} seconds left`);
    } else if (isTimerRunning && seconds > 0 && seconds < 10) {
        speak(seconds);
    }
    else if (seconds === 0) {
      speak("Game over");
    }

  }

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
          speakTimeIfRelevant(prev);
          if (prev > 0) {
            return prev - 1;
          } else {
            clearInterval(timerInterval);
            handleEndGame();
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
