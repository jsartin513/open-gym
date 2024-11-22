import React from "react";
import styles from "../../styles/Home.module.css";

export default function TeamsDisplay({teams, players, setTeams, setPlayers, clearTeams, createTeams}) {
    return (          <div>
        <h2>Teams</h2>
        <button onClick={clearTeams} className={styles.clearButton}>
          Clear Teams
        </button>
        <button onClick={createTeams} className={styles.createButton}>
          Create/Update Teams
        </button>
        <div className={styles.teamOuter}>
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
      </div>);
};