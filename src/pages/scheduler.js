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
  }, [numTeams]);

  const createDefaultTeams = () => {
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
      setNumCourts(value / 4);
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
    if (
      numTeams >= 4 &&
      numCourts >= 1 &&
      numCourts <= Math.floor(numTeams / 3)
    ) {
      const teamNames = teams.map(
        (team) => team.name || "Team " + (teams.indexOf(team) + 1)
      );
      console.log("teamNames");
      console.log(teamNames);
      // we need to figure out the total number of rounds
      // given that each team plays numRounds, there are numTeams,
      // each game has 2 teams, and there are numCourts
      const totalGames = numTeams * numRounds / 2;
      const totalRounds = totalGames / numCourts;

      console.log("totalGames");
      console.log(totalGames);
      console.log("totalRounds");
      console.log(totalRounds);

      const generatedSchedule = generateTournamentSchedule(
        teamNames,
        totalRounds,
        numCourts
      );
      setSchedule(generatedSchedule);
    }
  };
  const renderSchedule = () => {
    if (!schedule || schedule.length === 0) {
      return <p>No schedule generated yet.</p>;
    }

    return schedule.map((round, roundIndex) => (
      <div key={roundIndex} className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Round {roundIndex + 1}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {round.map((match, matchIndex) => (
            <div key={matchIndex} className="border rounded p-4">
              <p>Court {matchIndex + 1}</p>
              <p>
                {match.homeTeam} vs {match.awayTeam}
              </p>
            </div>
          ))}
        </div>
      </div>
    ));
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Tournament Scheduler</h1>

        {/* Input Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {" "}
          {/* Grid layout for better organization */}
          <div>
            <label htmlFor="numTeams" className="block mb-2">
              Number of Teams (Multiples of 4):
            </label>
            <input
              type="number"
              step="4"
              id="numTeams"
              value={numTeams}
              onChange={handleNumTeamsChange}
              className="border rounded p-2 w-full"
            />
          </div>
          <div>
            <label htmlFor="numRounds" className="block mb-2">
              Number of Rounds per Team:
            </label>
            <input
              type="number"
              id="numRounds"
              value={numRounds}
              onChange={handleNumRoundsChange}
              className="border rounded p-2 w-full"
            />
          </div>
          <div>
            <label htmlFor="numCourts" className="block mb-2">
              Number of Courts:
            </label>
            <input
              type="number"
              id="numCourts"
              value={numCourts}
              onChange={handleNumCourtsChange}
              className="border rounded p-2 w-full"
              disabled
            />
          </div>
        </div>

        <button
          onClick={generateSchedule}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
        >
          Generate Schedule
        </button>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        {/* Schedule Display */}
        <div>
          <h2 className="text-lg font-bold mb-2">Generated Schedule</h2>
          {renderSchedule()}
        </div>
      </div>
    </Layout>
  );
};

export default SchedulerPage;
