import React, { useEffect, useState } from "react";
import Layout from "../components/(layout)/layout";
import PrintableSchedule from "../components/PrintableSchedule";
import styles from "../styles/GamesPage.module.css";
import { generateRoundRobinSchedule } from '../utils/scheduling';

const GamesPage = () => {
  const [teams, setTeams] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [winners, setWinners] = useState({});
  const [gamesWon, setGamesWon] = useState({});
  const [skippedGames, setSkippedGames] = useState([]);
  const [isPrintableView, setIsPrintableView] = useState(false);
  const [mode, setMode] = useState('foam');

  useEffect(() => {
    const storedTeams = JSON.parse(localStorage.getItem('selectedTeams') || '[]');
    setTeams(storedTeams);
    setSchedule(generateRoundRobinSchedule(teamNames()));

    const storedWinners = JSON.parse(localStorage.getItem('gameWinners') || '{}');
    setWinners(storedWinners);

    const storedGamesWon = JSON.parse(localStorage.getItem('gamesWon') || '{}');
    setGamesWon(storedGamesWon);

    const storedSkippedGames = JSON.parse(localStorage.getItem('skippedGames') || '[]');
    setSkippedGames(storedSkippedGames);
  }, []);

  const handleAddRoundRobin = () => {
    const additionalGames = generateRoundRobinSchedule(teamNames());
    setSchedule([...schedule, ...additionalGames]);
  };

  const handleSkipGame = (index) => {
    const updatedSkippedGames = [...skippedGames, index];
    setSkippedGames(updatedSkippedGames);
    localStorage.setItem('skippedGames', JSON.stringify(updatedSkippedGames));
  };

  const handleModeToggle = () => {
    setMode(mode === 'foam' ? 'cloth' : 'foam');
  };

  const teamNames = () => {
    const teamNames = teams.map((team, index) => {
      if (team.name) {
        return team.name;
      }
      else {
        return "Team " + (index + 1);
      }
    });
    return teamNames;
  };

  const handleWinnerChange = (index, winner) => {
    const updatedWinners = { ...winners, [index]: winner };
    setWinners(updatedWinners);
    localStorage.setItem('gameWinners', JSON.stringify(updatedWinners));

    const updatedGamesWon = { ...gamesWon };
    if (winner && winner !== 'tie') {
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

  const calculateClothPoints = () => {
    const pointsByTeam = {};
    Object.values(winners).forEach((winner, index) => {
      if (winner && winner !== 'tie') {
        pointsByTeam[winner] = (pointsByTeam[winner] || 0) + 2;
      }
      else {
        // Lookup which teams played
        console.log(schedule[index]);
        // If they played, add 1 point to each
        if (schedule[index]) {
          const homeTeam = schedule[index].homeTeam;
          const awayTeam = schedule[index].awayTeam;
          pointsByTeam[homeTeam] = (pointsByTeam[homeTeam] || 0) + 1;
          pointsByTeam[awayTeam] = (pointsByTeam[awayTeam] || 0) + 1;
        }
      }
    });
    return pointsByTeam;
  }

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
          <div className={styles.gamesHeader}>
            <h1>Game Schedule</h1>
            <button className={styles.button} onClick={handleAddRoundRobin}>Add Round</button>
            <button className={styles.button} onClick={handleClearWins}>Clear Wins</button>
            <button className={styles.button} onClick={() => setIsPrintableView(!isPrintableView)}>
              {isPrintableView ? 'Back to Schedule' : 'Printable View'}
            </button>
            <button className={styles.button} onClick={handleModeToggle}>
              Toggle to {mode === 'foam' ? 'Cloth' : 'Foam'} Mode
            </button>
          </div>
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
                    <option value="">Select Result</option>
                    <option value={currentGame.homeTeam}>{currentGame.homeTeam}</option>
                    <option value={currentGame.awayTeam}>{currentGame.awayTeam}</option>
                    {mode === 'cloth' && <option value="tie">Tie</option>}
                  </select>
                  <button onClick={() => handleSkipGame(currentGameIndex)}>Skip</button>
                </div>
              )}
              {nextGame && (
                <div className={styles.nextGame}>
                  <h2>Next Game</h2>
                  <p>{nextGame.homeTeam} vs {nextGame.awayTeam}</p>
                </div>
              )}
              <div>
                <h2>After that...</h2>
                <ul className={styles.gamesList}>
                  {upcomingGames.slice(2).map((game, index) => (
                    <li key={index}>
                      {game.homeTeam} vs {game.awayTeam}
                    </li>
                  ))}
                </ul>
              </div>
              
            </>
          )}
        </div>
        {!isPrintableView && (
          <div className={styles.gamesWonPanel} >
            {mode==='foam' && (
              <div>
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
            { mode==='cloth' && (
              <div>
                <h2>Points</h2>
                <ul>
                  {Object.keys(calculateClothPoints()).map((team, index) => (
                    <li key={index}>
                      {team}: {calculateClothPoints()[team]}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <h2>Finished Games</h2>
              <ul className={styles.gamesList}>
                {pastGames.map((game, index) => (
                  <li key={index}>
                    {game.homeTeam} vs {game.awayTeam} - Winner: {winners[index] === 'tie' ? 'Tie' : winners[index]}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default GamesPage;
