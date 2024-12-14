import React, { useEffect, useState } from "react";
import Layout from "../components/(layout)/layout";
import PrintableSchedule from "../components/PrintableSchedule";
import styles from "../styles/GamesPage.module.css";

const GamesPage = () => {
  const [teams, setTeams] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [winners, setWinners] = useState({});
  const [gamesWon, setGamesWon] = useState({});
  const [isPrintableView, setIsPrintableView] = useState(false);

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

    const reversedNewSchedule = newSchedule.map(({ homeTeam, awayTeam }) => ({ homeTeam: awayTeam, awayTeam: homeTeam }));

    setSchedule((prevSchedule) => [...prevSchedule, ...newSchedule, ...reversedNewSchedule]);
  };

  const handleAddRoundRobin = () => {
    generateSchedule(teams);
  };

  const handleWinnerChange = (index, winner) => {
    console.log("index: ", index);
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

  const currentGameIndex = schedule.findIndex((_, index) => !winners[index]);
  const currentGame = schedule[currentGameIndex];
  const nextGame = schedule[currentGameIndex + 1];

  const pastGames = schedule.filter((_, index) => winners[index]);
  const upcomingGames = schedule.filter((_, index) => !winners[index]);

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.gamesSchedulePanel}>
          <h1>Game Schedule</h1>
          <button className={styles.button} onClick={handleAddRoundRobin}>Add Round</button>
          <button className={styles.button} onClick={handleClearWins}>Clear Wins</button>
          <button className={styles.button} onClick={() => setIsPrintableView(!isPrintableView)}>
            {isPrintableView ? 'Back to Schedule' : 'Printable View'}
          </button>
          {isPrintableView ? (
            <PrintableSchedule schedule={schedule} />
          ) : (
            <>
              {currentGame && (
                <div className={styles.currentGame}>
                  <h2>Current Game</h2>
                  <p>{currentGame.homeTeam} vs {currentGame.awayTeam}</p>
                  <select
                    className={styles.select}
                    value={winners[currentGameIndex] || ''}
                    onChange={(e) => handleWinnerChange(currentGameIndex, e.target.value)}
                  >
                    <option value="">Select Winner</option>
                    <option value={currentGame.homeTeam}>{currentGame.homeTeam}</option>
                    <option value={currentGame.awayTeam}>{currentGame.awayTeam}</option>
                  </select>
                </div>
              )}
              {nextGame && (
                <div className={styles.nextGame}>
                  <h2>Next Game</h2>
                  <p>{nextGame.homeTeam} vs {nextGame.awayTeam}</p>
                </div>
              )}
              <div>
                <h2>Upcoming Games</h2>
                <ul className={styles.gamesList}>
                  {upcomingGames.map((game, index) => (
                    <li key={index}>
                      {game.homeTeam} vs {game.awayTeam}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2>Past Games</h2>
                <ul className={styles.gamesList}>
                  {pastGames.map((game, index) => (
                    <li key={index}>
                      {game.homeTeam} vs {game.awayTeam} - Winner: {winners[index]}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
        {!isPrintableView && (
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
        )}
      </div>
    </Layout>
  );
};

export default GamesPage;