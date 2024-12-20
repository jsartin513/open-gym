import React, { useState, useEffect } from "react";
import {
  distributePlayersBySnake,
  distributePlayersInOrder,
} from "../utils/teamCreation";
import styles from "../styles/Home.module.css";

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
    <div className={styles.teamsPanel}>
      <h2>Teams</h2>
      <div className={styles.teamsHeader}>
        <button onClick={clearTeams} className={styles.clearButton}>
          Clear Teams
        </button>
        <button onClick={createTeams} className={styles.createButton}>
          Create/Update Teams
        </button>
        {attendance && attendance.length && (
          <span>
            {" "}
            With {attendance.length} players, create {numTeams} teams{" "}
            <div className={styles.numTeamChangeButtons}>
              <button
                onClick={() => setNumTeams(numTeams > 1 ? numTeams - 1 : 1)}
              >
                -
              </button>
              <button onClick={() => setNumTeams(numTeams + 1)}>+</button>
            </div>{" "}
          </span>
        )}
      </div>
      <div className={styles.tabbedView}>
        <div className={styles.tabs}>
          {teamsAlgorithms.map((_, algorithmIndex) => (
            <button
              key={algorithmIndex}
              className={
                activeTab === algorithmIndex ? styles.activeTab : styles.tab
              }
              onClick={() => handleTabChange(algorithmIndex)}
            >
              Option {algorithmIndex + 1}
            </button>
          ))}
        </div>
        {teamsAlgorithms.map((teams, algorithmIndex) => (
          <div
            key={algorithmIndex}
            className={
              activeTab == algorithmIndex
                ? styles.activeTabContent
                : styles.tabContent
            }
          >
            <h3>Option {algorithmIndex + 1}</h3>
            <div className={styles.teamSelection}>
              <button
                onClick={() => handleSelectTeams(algorithmIndex)}
                className={styles.selectButton}
              >
                Select These Teams
              </button>
            </div>
            <div className={styles.teamsLists}>
              {teams.map((team, teamIndex) => (
                <div key={teamIndex}>
                  <h3>Team {teamIndex + 1}</h3>
                  <ul>
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
