import React, { useState, useEffect } from "react";
import styles from "../../styles/Home.module.css";

export default function TeamsDisplay({ attendance }) {
  const [teamsAlgorithm1, setTeamsAlgorithm1] = useState([]);
  const [teamsAlgorithm2, setTeamsAlgorithm2] = useState([]);
  const [teamsAlgorithm3, setTeamsAlgorithm3] = useState([]);
  const [teamsAlgorithm4, setTeamsAlgorithm4] = useState([]);
  const [activeTab, setActiveTab] = useState('algorithm1');
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

  useEffect(() => {
    localStorage.setItem("teamsAlgorithm1", JSON.stringify(teamsAlgorithm1));
  }, [teamsAlgorithm1]);

  useEffect(() => {
    const savedTeams = localStorage.getItem("teamsAlgorithm1");
    if (savedTeams) {
      setTeamsAlgorithm1(JSON.parse(savedTeams));
    }
  }, []);

  const clearTeams = () => {
    setTeamsAlgorithm1([]);
  };

  useEffect(() => {
    setNumTeams(numberOfTeams());
  }, [attendance]);

  const numberOfTeams = () => {
    const numPlayers = attendance.length;
    let numTeams = 2;

    if (numPlayers >= 15 && numPlayers <= 19) {
      numTeams = 3;
    } else if (numPlayers >= 20 && numPlayers <= 32) {
      numTeams = 4;
    } else if (numPlayers > 32) {
      numTeams = Math.floor(numPlayers / 8); // Max out at 8 players per team
    }
    return numTeams;
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

  const distributePlayersBySnake = (playersSkillOrdered) => {
    const teams = Array.from({ length: numTeams }, () => []);
    let descending = false;
    playersSkillOrdered.forEach((player, index) => {
      const playerTeam = descending
        ? numTeams - (index % numTeams) - 1
        : index % numTeams;
      teams[playerTeam].push(player);
      if (
        (descending && playerTeam === 0) ||
        (!descending && playerTeam === numTeams - 1)
      ) {
        descending = !!!descending;
      }
    });
    return teams;
  };

  const distributePlayersInOrder = (playersSkillOrdered) => {
    const teams = Array.from({ length: numTeams }, () => []);
    playersSkillOrdered.forEach((player, index) => {
      const playerTeam = index % numTeams;
      teams[playerTeam].push(player);
    });
    return teams;
  }

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
    const teamsAlgorithm1 = distributePlayersBySnake(orderedPlayersWithWomenReversed);
    setTeamsAlgorithm1(teamsAlgorithm1);

    const teamsAlgorithm2 = distributePlayersBySnake(orderedPlayers);
    setTeamsAlgorithm2(teamsAlgorithm2);    

    const teamsAlgorithm3 = distributePlayersInOrder(orderedPlayers);
    setTeamsAlgorithm3(teamsAlgorithm3);

    const teamsAlgorithm4 = distributePlayersInOrder(orderedPlayersWithWomenReversed);
    setTeamsAlgorithm4(teamsAlgorithm4);
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
                    With {attendance.length} players, create {numTeams} teams
                </span>
            )}
        </div>
        <div className={styles.tabbedView}>
            <div className={styles.tabs}>
                <button
                    className={activeTab === 'algorithm1' ? styles.activeTab : styles.tab}
                    onClick={() => handleTabChange('algorithm1')}
                >
                    Algorithm 1
                </button>
                <button
                    className={activeTab === 'algorithm2' ? styles.activeTab : styles.tab}
                    onClick={() => handleTabChange('algorithm2')}
                >
                    Algorithm 2
                </button>
                <button
                    className={activeTab === 'algorithm3' ? styles.activeTab : styles.tab}
                    onClick={() => handleTabChange('algorithm3')}
                >
                    Algorithm 3
                </button>
                <button 
                    className={activeTab === 'algorithm4' ? styles.activeTab : styles.tab}
                    onClick={() => handleTabChange('algorithm4')}
                >
                    Algorithm 4
                </button>
            </div>
            <div className={styles.tabContent}>
                {activeTab === 'algorithm1' && (
                    <div className={styles.teamsLists}>
                        {teamsAlgorithm1.map((team, index) => (
                            <div key={index}>
                                <h3>Team {index + 1}</h3>
                                <ul>
                                    {team.map((player) => (
                                        <li key={player.name}>{player.name}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}
                {activeTab === 'algorithm2' && (
                    <div className={styles.teamsLists}>
                    {teamsAlgorithm2.map((team, index) => (
                        <div key={index}>
                            <h3>Team {index + 1}</h3>
                            <ul>
                                {team.map((player) => (
                                    <li key={player.name}>{player.name}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                )}
                {activeTab === 'algorithm3' && (
                    <div className={styles.teamsLists}>
                    {teamsAlgorithm3.map((team, index) => (
                        <div key={index}>
                            <h3>Team {index + 1}</h3>
                            <ul>
                                {team.map((player) => (
                                    <li key={player.name}>{player.name}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                )}
                {activeTab === 'algorithm4' && (
                    <div className={styles.teamsLists}>
                    {teamsAlgorithm4.map((team, index) => (
                        <div key={index}>
                            <h3>Team {index + 1}</h3>
                            <ul>
                                {team.map((player) => (
                                    <li key={player.name}>{player.name}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    </div>
                )}
            </div>
        </div>
    </div>
);
}
