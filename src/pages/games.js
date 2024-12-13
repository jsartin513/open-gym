import React, { useEffect, useState } from "react";
import Layout from "../components/(layout)/layout";
import styles from "../styles/Home.module.css";

const GamesPage = () => {
  const [teams, setTeams] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [winners, setWinners] = useState({});

  useEffect(() => {
    const storedTeams = JSON.parse(localStorage.getItem('selectedTeams') || '[]');
    setTeams(storedTeams);
    generateSchedule(storedTeams);

    const storedWinners = JSON.parse(localStorage.getItem('gameWinners') || '{}');
    setWinners(storedWinners);
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

  const handleWinnerChange = (index, winner) => {
    const updatedWinners = { ...winners, [index]: winner };
    setWinners(updatedWinners);
    localStorage.setItem('gameWinners', JSON.stringify(updatedWinners));
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
                <select
                  value={winners[index] || ''}
                  onChange={(e) => handleWinnerChange(index, e.target.value)}
                >
                  <option value="">Select Winner</option>
                  <option value={game.homeTeam}>{game.homeTeam}</option>
                  <option value={game.awayTeam}>{game.awayTeam}</option>
                </select>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
};

export default GamesPage;