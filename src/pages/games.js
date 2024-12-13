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
    const numTeams = teams.length;
    const rounds = numTeams - 1;
    const halfSize = numTeams / 2;

    const teamIndexes = teams.map((_, i) => i + 1);
    const newSchedule = [];

    for (let round = 0; round < rounds; round++) {
      const roundMatches = [];
      for (let i = 0; i < halfSize; i++) {
        const home = teamIndexes[i];
        const away = teamIndexes[numTeams - 1 - i];
        roundMatches.push({ homeTeam: `Team ${home}`, awayTeam: `Team ${away}` });
      }
      newSchedule.push(...roundMatches);

      // Rotate teams
      teamIndexes.splice(1, 0, teamIndexes.pop());
    }

    setSchedule((prevSchedule) => [...prevSchedule, ...newSchedule]);
  };

  const handleAddRoundRobin = () => {
    generateSchedule(teams);
  };

  const handleWinnerChange = (index, winner) => {
    const updatedWinners = { ...winners, [index]: winner };
    setWinners(updatedWinners);
    localStorage.setItem('gameWinners', JSON.stringify(updatedWinners));
  };

  const calculateGamesWon = () => {
    const gamesWon = {};
    Object.values(winners).forEach((winner) => {
      if (winner) {
        gamesWon[winner] = (gamesWon[winner] || 0) + 1;
      }
    });
    return gamesWon;
  };

  const gamesWon = calculateGamesWon();

  return (
    <Layout>
      <div className={styles.container}>
        <h1>Game Schedule</h1>
        <button onClick={handleAddRoundRobin}>Add Round</button>
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
        <div className={styles.gamesWonPanel}>
          <h2>Games Won</h2>
          <ul>
            {Object.keys(gamesWon).map((team, index) => (
              <li key={index}>
                {team}: {gamesWon[team]}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default GamesPage;