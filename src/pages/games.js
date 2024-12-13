import React, { useEffect, useState } from "react";
import Layout from "../components/(layout)/layout";
import styles from "../styles/GamesPage.module.css";

const GamesPage = () => {
  const [teams, setTeams] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [winners, setWinners] = useState({});
  const [gamesWon, setGamesWon] = useState({});

  useEffect(() => {
    const storedTeams = JSON.parse(localStorage.getItem('selectedTeams') || '[]');
    setTeams(storedTeams);
    generateSchedule(storedTeams);

    const storedWinners = JSON.parse(localStorage.getItem('gameWinners') || '{}');
    setWinners(storedWinners);

    const storedGamesWon = JSON.parse(localStorage.getItem('gamesWon') || '{}');
    setGamesWon(storedGamesWon);
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

    const updatedGamesWon = { ...gamesWon };
    if (winner) {
      updatedGamesWon[winner] = (updatedGamesWon[winner] || 0) + 1;
    }
    setGamesWon(updatedGamesWon);
    localStorage.setItem('gamesWon', JSON.stringify(updatedGamesWon));
  };

  const handleClearWins = () => {
    setWinners({});
    setGamesWon({});
    localStorage.removeItem('gameWinners');
    localStorage.removeItem('gamesWon');
  };

  const calculateGamesWon = () => {
    const gamesWonByTeam = {};
    Object.values(winners).forEach((winner) => {
      if (winner) {
        gamesWonByTeam[winner] = (gamesWonByTeam[winner] || 0) + 1;
      }
    });
    return gamesWonByTeam;
  };

  const gamesWonByTeam = calculateGamesWon();

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.gamesSchedulePanel}>
          <h1>Game Schedule</h1>
          <button className={styles.button} onClick={handleAddRoundRobin}>Add Round</button>
          <button className={styles.button} onClick={handleClearWins}>Clear Wins</button>
          {schedule.length === 0 ? (
            <p>No teams available.</p>
          ) : (
            <ul className={styles.gamesList}>
              {schedule.map((game, index) => (
                <li key={index}>
                  {game.homeTeam} vs {game.awayTeam}
                  <select
                    className={styles.select}
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
        <div className={styles.gamesWonPanel}>
          <h2>Games Won</h2>
          <ul>
            {Object.keys(gamesWonByTeam).map((team, index) => (
              <li key={index}>
                {team}: {gamesWonByTeam[team]}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default GamesPage;