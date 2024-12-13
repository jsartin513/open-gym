import React, { useEffect, useState } from "react";
import Layout from "../components/(layout)/layout";
import styles from "../styles/Home.module.css";

const GamesPage = () => {
  const [teams, setTeams] = useState([]);
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    const storedTeams = JSON.parse(localStorage.getItem('selectedTeams') || '[]');
    setTeams(storedTeams);
    generateSchedule(storedTeams);
  }, []);

  const generateSchedule = (teams) => {
    const schedule = [];
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        schedule.push({ homeTeam: `Team ${i + 1}`, awayTeam: `Team ${j + 1}` });
      }
    }
    setSchedule(schedule);
  };

  return (
    <Layout>
      <div className={styles.container}>
        <h1>Game Schedule</h1>
        {schedule.length === 0 ? (
          <p>No teams available.</p>
        ) : (
          <ul>
            {schedule.map((game, index) => (
              <li key={index}>
                {game.homeTeam} vs {game.awayTeam}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
};

export default GamesPage;