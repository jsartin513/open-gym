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
  const [view, setView] = useState("round"); // New state for view toggling


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
  const renderScheduleByRound = () => {
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

  const renderScheduleByTeam = () => {
    if (!schedule || schedule.length === 0) {
      return <p>No schedule generated yet.</p>;
    }

    const teamsSchedule = {};
    schedule.forEach((round, roundIndex) => {
      round.forEach((match, matchIndex) => {
        const homeTeam = match.homeTeam;
        const awayTeam = match.awayTeam;

        if (!teamsSchedule[homeTeam]) {
          teamsSchedule[homeTeam] = [];
        }
        if (!teamsSchedule[awayTeam]) {
          teamsSchedule[awayTeam] = [];
        }

        teamsSchedule[homeTeam].push({
          round: roundIndex + 1,
          opponent: awayTeam,
          court: matchIndex + 1,
          home: true, // Indicate home game
        });
        teamsSchedule[awayTeam].push({
          round: roundIndex + 1,
          opponent: homeTeam,
          court: matchIndex + 1,
          home: false, // Indicate away game
        });
      });
    });


    return (
      <div>
        {Object.keys(teamsSchedule).map((teamName) => (
          <div key={teamName} className="mb-4">
            <h3 className="text-lg font-semibold mb-2">{teamName}</h3>
            <ul>
              {teamsSchedule[teamName].map((match, index) => (
                <li key={index} className="border rounded p-2 mb-2">
                  Round {match.round} - Court {match.court} -{" "}
                  {match.home ? "vs" : "@"} {match.opponent}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
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
        {/* View Tabs */}
        <div className="flex mb-4">
          <button
            onClick={() => setView("round")}
            className={`mr-4 px-4 py-2 rounded ${
              view === "round" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            By Round
          </button>
          <button
            onClick={() => setView("team")}
            className={`px-4 py-2 rounded ${
              view === "team" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            By Team
          </button>
        </div>
        <div>
          <h2 className="text-lg font-bold mb-2">Generated Schedule</h2>
        {/* Schedule Display (Conditional) */}
        {view === "round" && renderScheduleByRound()} {/* Renamed function */}
        {view === "team" && renderScheduleByTeam()}
        </div>
      </div>
    </Layout>
  );
};

export default SchedulerPage;
