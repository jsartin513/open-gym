import React, { useState, useEffect } from "react";
import {
  distributePlayersBySnake,
  distributePlayersInOrder,
} from "../utils/teamCreation";

export default function TeamsDisplay({ attendance }) {
  const [teamsAlgorithms, setTeamsAlgorithms] = useState([[], [], [], []]);
  const [selectedTeams, setSelectedTeams] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [numTeams, setNumTeams] = useState(2);

  //TODO: Move this to constants file or even another tab in the spreadsheet
  const orderedGenders = ["male", "female", "nonbinary"];
  const orderedSkillLevels = [
    "anarchy",
    "elite",
    "advanced",
    "intermediate",
    "new",
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const clearTeams = () => {
    setTeamsAlgorithms([], [], [], []);
  };

  const handleSelectTeams = (index) => {
    const selectedTeams = teamsAlgorithms[index];
    setSelectedTeams(selectedTeams);
    localStorage.setItem("selectedTeams", JSON.stringify(selectedTeams));
    window.location.href = "/teams";
  };

  useEffect(() => {
    setNumTeams(numberOfTeams());
  }, [attendance]);

  const numberOfTeams = () => {
    const numPlayers = attendance.length;
    let teamCount = 2;

    if (numPlayers >= 15 && numPlayers <= 19) {
      teamCount = 3;
    } else if (numPlayers >= 20 && numPlayers <= 32) {
      teamCount = 4;
    } else if (numPlayers > 32) {
      teamCount = Math.floor(numPlayers / 8); // Max out at 8 players per team
    }
    return teamCount;
  };

  const orderedPlayersOfGender = (gender) => {
    return orderedSkillLevels.flatMap((skillLevel) =>
      attendance.filter(
        (player) =>
          player.gender.toLowerCase() === gender &&
          player.skillLevel.toLowerCase() === skillLevel
      )
    );
  };

  const createTeams = () => {
    const orderedMen = orderedPlayersOfGender("male");
    const orderedWomen = orderedPlayersOfGender("female");
    const orderedNonBinary = orderedPlayersOfGender("nonbinary");
    const orderedNonMen = [...orderedWomen, ...orderedNonBinary];
    const orderedPlayers = [...orderedMen, ...orderedNonMen];
    const orderedPlayersWithWomenReversed = [
      ...orderedMen,
      ...orderedNonMen.reverse(),
    ];
    setTeamsAlgorithms([]);
    [distributePlayersBySnake, distributePlayersInOrder].forEach(
      (algorithm) => {
        [orderedPlayers, orderedPlayersWithWomenReversed].forEach((players) => {
          const teams = algorithm(players, numTeams);
          setTeamsAlgorithms((prevTeams) => [...prevTeams, teams]);
        });
      }
    );
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4">
      <h2 className="text-xl font-bold mb-4">Teams</h2>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={clearTeams}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Clear Teams
        </button>
        <button
          onClick={createTeams}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create/Update Teams
        </button>
        {attendance && attendance.length && (
          <span>
            With {attendance.length} players, create {numTeams} teams
            <div className="inline-flex ml-2">
              <button
                onClick={() => setNumTeams(numTeams > 1 ? numTeams - 1 : 1)}
                className="bg-gray-300 text-black px-2 py-1 rounded-l hover:bg-gray-400"
              >
                -
              </button>
              <button
                onClick={() => setNumTeams(numTeams + 1)}
                className="bg-gray-300 text-black px-2 py-1 rounded-r hover:bg-gray-400"
              >
                +
              </button>
            </div>
          </span>
        )}
      </div>
      <div>
        <div className="flex space-x-2 mb-4">
          {teamsAlgorithms.map((_, algorithmIndex) => (
            <button
              key={algorithmIndex}
              className={`px-4 py-2 rounded ${
                activeTab === algorithmIndex
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-black hover:bg-gray-400"
              }`}
              onClick={() => handleTabChange(algorithmIndex)}
            >
              Option {algorithmIndex + 1}
            </button>
          ))}
        </div>
        {teamsAlgorithms.map((teams, algorithmIndex) => (
          <div
            key={algorithmIndex}
            className={activeTab === algorithmIndex ? "block" : "hidden"}
          >
            <h3 className="text-lg font-semibold mb-2">Option {algorithmIndex + 1}</h3>
            <div className="mb-4">
              <button
                onClick={() => handleSelectTeams(algorithmIndex)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Select These Teams
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teams.map((team, teamIndex) => (
                <div key={teamIndex} className="bg-gray-100 p-4 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold mb-2">Team {teamIndex + 1}</h3>
                  <ul className="list-disc pl-5">
                    {team.map((player) => (
                      <li key={player.name}>{player.name}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
