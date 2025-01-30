import React, { useState, useEffect } from "react";
import Layout from "../components/(layout)/layout";
import { generateTournamentSchedule } from "../utils/scheduling";

const SchedulerPage = () => {
  const [numTeams, setNumTeams] = useState(12);
  const [numCourts, setNumCourts] = useState(3);
  const [numRounds, setNumRounds] = useState(5);
  const [schedule, setSchedule] = useState([]);
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    createDefaultTeams();
    console.log("Teams created");
  }, []);

  const createDefaultTeams = () => {
    console.log("Creating default teams");
    const defaultTeams = [];
    for (let i = 0; i < numTeams; i++) {
      defaultTeams.push({ name: "Team " + (i + 1) });
    }
    setTeams(defaultTeams);
  };

  const handleNumTeamsChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 4 && value % 4 === 0) {
      setNumTeams(value);
      setError("");
    } else {
      setError("Number of teams must be a multiple of 4.");
    }
  };

  const handleNumRoundsChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 1) {
      setNumRounds(value);
      setError("");
    } else {
      setError("Number of rounds must be at least 1.");
    }
  };

  const handleNumCourtsChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 1 && value <= Math.floor(numTeams / 3)) {
      setNumCourts(value);
      setError("");
    } else {
      setError(
        "Number of courts must be between 1 and " + Math.floor(numTeams / 3)
      );
    }
  };

  const generateSchedule = () => {
    console.log("Generating schedule outer");
    if (
      numTeams >= 4 &&
      numCourts >= 1 &&
      numCourts <= Math.floor(numTeams / 3)
    ) {
      console.log("Generating schedule");
      const teamNames = teams.map(
        (team) => team.name || "Team " + (teams.indexOf(team) + 1)
      );
      // we need to figure out the total number of rounds
      // given that each team plays numRounds, there are numTeams, 
      // each game has 2 teams, and there are numCourts
        const totalGames = numTeams * numRounds;
        const gamesPerRound = numTeams / 2;
        const gamesPerCourt = gamesPerRound / numCourts;
        const totalRounds = totalGames / gamesPerRound;


      const generatedSchedule = generateTournamentSchedule(
        teamNames,
        totalRounds
      );
      console.log("Generated schedule", generatedSchedule);
      setSchedule(generatedSchedule);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Tournament Scheduler</h1>
        <div className="mb-4">
          <label className="block mb-2">Number of Teams</label>
          <input
            type="number"
            value={numTeams}
            onChange={handleNumTeamsChange}
            className="w-16 p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Number of Rounds per Team</label>
          <input
            type="number"
            value={numRounds}
            onChange={handleNumRoundsChange}
            className="w-16 p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Number of Courts</label>
          <input
            type="number"
            value={numCourts}
            onChange={handleNumCourtsChange}
            className="w-16 p-2 border border-gray-300 rounded"
          />
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => generateSchedule()}
        >
          Generate Schedule
        </button>

        {error && <div className="text-red-500 mb-4">{error}</div>}
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-2">Generated Schedule</h2>
          {schedule.map((round, roundIndex) => (
            <div key={roundIndex} className="mb-4">
              <h3 className="text-md font-semibold mb-2">
                Round {roundIndex + 1}
              </h3>
              {round.map((match, matchIndex) => (
                <div key={matchIndex} className="mb-2">
                  <p>Court: {matchIndex + 1}</p>
                  <p>Home Team: {match.homeTeam}</p>
                  <p>Away Team: {match.awayTeam}</p>
                  <p>Ref: {match.ref}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};
export default SchedulerPage;
