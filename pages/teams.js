import React, { useEffect, useState } from "react";
import Layout from "./components/layout";
import styles from "../styles/Home.module.css";

const TeamsPage = () => {
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTeamForPlayer, setSelectedTeamForPlayer] = useState({});

  useEffect(() => {
    const storedTeams = JSON.parse(
      localStorage.getItem("selectedTeams") || "[]"
    );
    setSelectedTeams(storedTeams);
  }, []);

  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
  };

  const updateTeams = (newTeams) => {
    setSelectedTeams(newTeams);
    localStorage.setItem("selectedTeams", JSON.stringify(newTeams));
  };

  const handleTeamNameChange = (teamIndex, memberIndex, newName) => {
    const updatedTeams = [...selectedTeams];
    updatedTeams[teamIndex][memberIndex].name = newName;
    updateTeams(updatedTeams)
  };

  const handleAddPlayer = (teamIndex) => {
    const updatedTeams = [...selectedTeams];
    updatedTeams[teamIndex].push({ name: "New Player" });
    updateTeams(updatedTeams)
  };

  const handleMovePlayer = (teamIndex, memberIndex, newTeamIndex) => {
    if (newTeamIndex === "") return;
    const updatedTeams = [...selectedTeams];
    const [movedPlayer] = updatedTeams[teamIndex].splice(memberIndex, 1);
    updatedTeams[newTeamIndex].push(movedPlayer);
    updateTeams(updatedTeams)
    setSelectedTeamForPlayer({});
  };

  const handleRemovePlayer = (teamIndex, memberIndex) => {
    const updatedTeams = [...selectedTeams];
    updatedTeams[teamIndex].splice(memberIndex, 1);
    updateTeams(updatedTeams)
    setSelectedTeamForPlayer({});
  };

  const handleDropdownChange = (teamIndex, memberIndex, newTeamIndex) => {
    setSelectedTeamForPlayer({ [`${teamIndex}-${memberIndex}`]: newTeamIndex });
    handleMovePlayer(teamIndex, memberIndex, newTeamIndex);
  };

  return (
    <Layout>
      <div className={styles.container}>
        <h1>Open Gym Teams</h1>
        <button onClick={handleEditToggle}>
          {isEditMode ? "Save" : "Edit"}
        </button>
        <div className={styles.teamsLists}>
          {selectedTeams.length === 0 ? (
            <p>No teams selected.</p>
          ) : (
            selectedTeams.map((team, teamIndex) => (
              <div key={teamIndex} className={styles.team}>
                Team {teamIndex + 1}
                <ul>
                  {team.map((member, memberIndex) => (
                    <li key={memberIndex}>
                      {isEditMode ? (
                        <>
                          <input
                            type="text"
                            value={member.name}
                            onChange={(e) =>
                              handleTeamNameChange(
                                teamIndex,
                                memberIndex,
                                e.target.value
                              )
                            }
                          />
                          <select
                            value={
                              selectedTeamForPlayer[
                                `${teamIndex}-${memberIndex}`
                              ] || ""
                            }
                            onChange={(e) =>
                              handleDropdownChange(
                                teamIndex,
                                memberIndex,
                                e.target.value
                              )
                            }
                          >
                            <option value="">Move to...</option>
                            {selectedTeams.map(
                              (_, newTeamIndex) =>
                                newTeamIndex !== teamIndex && (
                                  <option
                                    key={newTeamIndex}
                                    value={newTeamIndex}
                                  >
                                    Team {newTeamIndex + 1}
                                  </option>
                                )
                            )}
                          </select>
                          <button
                            onClick={() =>
                              handleRemovePlayer(teamIndex, memberIndex)
                            }
                          >
                            Remove
                          </button>
                        </>
                      ) : (
                        member.name
                      )}
                    </li>
                  ))}
                </ul>
                {isEditMode && (
                  <button onClick={() => handleAddPlayer(teamIndex)}>
                    Add Player
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TeamsPage;
