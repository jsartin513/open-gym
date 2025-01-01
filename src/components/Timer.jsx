import React, { useEffect, useState } from "react";
import styles from "../styles/GamesPage.module.css";

const Timer = ({ mode }) => {
  const TIMER_OFFSET = 1; // seconds before the actual time to speak

  const [gameTimer, setGameTimer] = useState(180);
  const [gameLength, setGameLength] = useState(180);
  const [preGameCountdown, setPreGameCountdown] = useState(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  }

  function endGameText() {
    if (mode === "cloth") {
      return "Game over";
    } else {
      return "Reset blocking";
    }
  }

  function speakTimeIfRelevant(timerSeconds) {
    const seconds = timerSeconds - TIMER_OFFSET;
    if (seconds === 0) {
      speak(endGameText());
    } else if (seconds === 60) {
      speak("One minute left");
    } else if (seconds % 60 === 0) {
      speak(`${seconds / 60} minutes left`);
    } else if ([30, 20, 10].includes(seconds)) {
      speak(`${seconds} seconds left`);
    } else if (isTimerRunning && seconds > 0 && seconds < 10) {
      speak(seconds);
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

  const fontSize = () => {
    if (isTimerRunning || preGameCountdown !== null) {
      return "text-8xl";
      } else {
      return "text-4xl";
    }
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md"> 
      <h2 className="text-xl font-bold mb-4">Game Timer</h2> 

      {mode === "cloth" && !isTimerRunning && (
        <button 
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mb-4"
          onClick={toggleGameDuration}>
          Toggle to {gameTimer === 180 ? "90 seconds" : "3 minutes"}
        </button>
      )}

      {preGameCountdown !== null ? (
        <p className="text-4xl">Starting in {preGameCountdown}...</p>
      ) : (
        <p className={`${fontSize()} ${gameTimer <= 10 ? 'text-red-500 animate-pulse' : ''}`}> {/* Conditional styling */}
          {formatTime(gameTimer)}{" "}
          {gameTimer <= 0 && (mode === "cloth" ? "Game Over!" : "No Blocking!")}
        </p>
      )}
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleStartGame}
              disabled={isTimerRunning && preGameCountdown === null}>
              Start Game
      </button>
      <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
              onClick={handleEndGame} disabled={!isTimerRunning}>
              End Game
      </button>
    </div>
  );
};

export default Timer;
