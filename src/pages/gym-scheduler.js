import React, { useState, useEffect } from "react";
import Layout from "../components/(layout)/layout";

const GymSchedulerPage = () => {
  const [numTeams, setNumTeams] = useState(2);
  const [schedule, setSchedule] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    generateSchedule();
  }, [numTeams]);

  const handleNumTeamsChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 2 && value <= 4) {
      setNumTeams(value);
      setError("");
    } else {
      setError("Number of teams must be between 2 and 4.");
    }
  };

  const generateSchedule = () => {
    let generatedSchedule = [];
    if (numTeams === 2) {
      for (let i = 0; i < 24; i++) {
        generatedSchedule.push({
          round: 1,
          game: i + 1,
          home: i % 2 === 0 ? "Team 1" : "Team 2",
          away: i % 2 === 0 ? "Team 2" : "Team 1",
        });
      }
    } else if (numTeams === 3) {
      const teams = ["Team 1", "Team 2", "Team 3"];
      for (let i = 0; i < 12; i++) {
        generatedSchedule.push({
          round: 1,
          game: i + 1,
          home: teams[i % 3],
          away: teams[(i + 1) % 3],
        });
      }
      for (let i = 12; i < 24; i++) {
        generatedSchedule.push({
          round: 2,
          game: i + 1,
          home: teams[(i + 1) % 3],
          away: teams[i % 3],
        });
      }
    } else if (numTeams === 4) {
      const teams = ["Team 1", "Team 2", "Team 3", "Team 4"];
      const pairs = [
        [teams[0], teams[1]],
        [teams[2], teams[3]],
        [teams[0], teams[2]],
        [teams[1], teams[3]],
        [teams[0], teams[3]],
        [teams[1], teams[2]],
      ];
      for (let round = 0; round < 3; round++) {
        const roundPairs = pairs.slice(round * 2, round * 2 + 2);
        for (let i = 0; i < 8; i++) {
          const pair = roundPairs[i % 2];
          const homeIndex = [0,3].includes(i % 4) ? 0 : 1;
          const awayIndex = [0,3].includes(i % 4) ? 1 : 0;
          generatedSchedule.push({
            round: round + 1,
            game: round * 8 + i + 1,
            home: pair[homeIndex],
            away: pair[awayIndex],
          });
        }
      }
    }
    setSchedule(generatedSchedule);
  };

  const renderScheduleByRound = () => {
    if (!schedule || schedule.length === 0) {
      return <p>No schedule generated yet.</p>;
    }

    const rounds = {};
    schedule.forEach((game) => {
      if (!rounds[game.round]) {
        rounds[game.round] = [];
      }
      rounds[game.round].push(game);
    });

    return Object.keys(rounds).map((round) => (
      <div key={round} className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Round {round}</h3>
        <ul>
          {rounds[round].map((game) => (
            <li key={game.game} className="border rounded p-2 mb-2">
              Game {game.game}: {game.home} vs {game.away}
            </li>
          ))}
        </ul>
      </div>
    ));
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Gym Scheduler</h1>
        <div className="mb-4">
          <label className="block mb-2">Number of Teams</label>
          <input
            type="number"
            value={numTeams}
            onChange={handleNumTeamsChange}
            className="w-16 p-2 border border-gray-300 rounded"
            min="2"
            max="4"
          />
        </div>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-2">Generated Schedule</h2>
          {renderScheduleByRound()}
        </div>
      </div>
    </Layout>
  );
};

export default GymSchedulerPage;
