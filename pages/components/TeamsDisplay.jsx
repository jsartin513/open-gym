import React, { useState, useEffect } from "react";
import styles from "../../styles/Home.module.css";

export default function TeamsDisplay({ attendance }) {
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [numTeams, setNumTeams] = useState(2);

  //TODO: Move this to constants file or even another tab in the spreadsheet
  const ordered_genders = ["male", "female", "nonbinary"];
  const ordered_skill_levels = [
    "anarchy",
    "elite",
    "advanced",
    "intermediate",
    "new",
  ];

  useEffect(() => {
    localStorage.setItem("teams", JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    const savedTeams = localStorage.getItem("teams");
    if (savedTeams) {
      setTeams(JSON.parse(savedTeams));
    }
  }, []);

  const clearTeams = () => {
    setTeams([]);
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

  const orderPlayersInOneList = () => {
    let orderedPlayers = [];
    ordered_genders.forEach((gender) => {
      const thisGenderPlayers = attendance.filter(
        (player) => player.gender.toLowerCase() === gender
      );
      ordered_skill_levels.forEach((skillLevel) => {
        const playerSet = thisGenderPlayers.filter(
          (player) => player.skillLevel.toLowerCase() === skillLevel
        );
        orderedPlayers = [...orderedPlayers, ...playerSet];
      });
      const unassignedPlayers = attendance.filter(
        (player) => !orderedPlayers.includes(player)
      );
      orderedPlayers = [...orderedPlayers, ...unassignedPlayers];
    });

    return orderedPlayers;
  };

  const orderedPlayersOfGender = (gender) => {
    let orderedPlayersOfGender = [];
    const all_male = attendance.filter(
      (player) => player.gender.toLowerCase() === gender
    );
    ordered_skill_levels.forEach((skillLevel) => {
      const playerSet = all_male.filter(
        (player) => player.skillLevel.toLowerCase() === skillLevel
      );
      orderedPlayersOfGender = [...orderedPlayersOfGender, ...playerSet];
    });
    return orderedPlayersOfGender;
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

  const createTeams = () => {
    const orderedPlayers = orderPlayersInOneList();
    const orderedMen = orderedPlayersOfGender('male');
    const orderedWomen = orderedPlayersOfGender('female');
    const orderedNonBinary = orderedPlayersOfGender('nonbinary');
    const orderedNonMen = [...orderedWomen, ...orderedNonBinary];
    const orderedPlayersWithWomenReversed = [
      ...orderedMen,
      ...orderedNonMen.reverse(),
    ];
    const teams = distributePlayersBySnake(orderedPlayersWithWomenReversed);

    setTeams(teams);
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
      <div className={styles.teamsLists}>
        {teams.map((team, index) => (
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
    </div>
  );
}
