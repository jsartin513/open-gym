import React, { useEffect, useState } from "react";
import Layout from "../components/(layout)/layout";

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
    if (!isEditMode) {
      // Entering edit mode
      localStorage.setItem("editModeTeams", JSON.stringify(selectedTeams));
    } else {
      // Exiting edit mode and saving changes
      localStorage.setItem("selectedTeams", JSON.stringify(selectedTeams));
      localStorage.removeItem("editModeTeams");
    }
    setIsEditMode(!isEditMode);
  };

  const handleCancelEdit = () => {
    const storedTeams = JSON.parse(
      localStorage.getItem("selectedTeams") || "[]"
    );
    setSelectedTeams(storedTeams);
    localStorage.removeItem("editModeTeams");
    setIsEditMode(false);
  };

  const updateTeams = (newTeams) => {
    setSelectedTeams(newTeams);
    if (isEditMode) {
      localStorage.setItem("editModeTeams", JSON.stringify(newTeams));
    } 
  };

  const handleTeamNameChange = (teamIndex, memberIndex, newName) => {
    const updatedTeams = [...selectedTeams];
    updatedTeams[teamIndex][memberIndex].name = newName;
    updateTeams(updatedTeams);
  };

  const handleAddPlayer = (teamIndex) => {
    const updatedTeams = [...selectedTeams];
    updatedTeams[teamIndex].push({ name: "New Player" });
    updateTeams(updatedTeams);
  };

  const handleMovePlayer = (teamIndex, memberIndex, newTeamIndex) => {
    if (newTeamIndex === "") return;
    const updatedTeams = [...selectedTeams];
    const [movedPlayer] = updatedTeams[teamIndex].splice(memberIndex, 1);
    updatedTeams[newTeamIndex].push(movedPlayer);
    updateTeams(updatedTeams);
    setSelectedTeamForPlayer({});
  };

  const handleRemovePlayer = (teamIndex, memberIndex) => {
    const updatedTeams = [...selectedTeams];
    updatedTeams[teamIndex].splice(memberIndex, 1);
    updateTeams(updatedTeams);
    setSelectedTeamForPlayer({});
  };

  const handleDropdownChange = (teamIndex, memberIndex, newTeamIndex) => {
    setSelectedTeamForPlayer({ [`${teamIndex}-${memberIndex}`]: newTeamIndex });
    handleMovePlayer(teamIndex, memberIndex, newTeamIndex);
  };

  return (
    <Layout>
      <div className="container mx-auto p-4" style={{ paddingLeft: 'calc(20% + 1rem)' }}> {/* Adjusted padding */}
        <h1 className="text-2xl font-bold mb-4">Open Gym Teams</h1>
        <button
          onClick={handleEditToggle}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
        >
          {isEditMode ? "Save" : "Edit"}
        </button>
        {isEditMode && (
          <button
            onClick={handleCancelEdit}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 mb-4 ml-2"
          >
            Cancel
          </button>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> {/* Adjusted grid layout */}
          {selectedTeams.length === 0 ? (
            <p>No teams selected.</p>
          ) : (
            selectedTeams.map((team, teamIndex) => (
              <div key={teamIndex} className="bg-white shadow-md rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-2">Team {teamIndex + 1}</h2>
                <ul className="list-disc pl-5">
                  {team.map((member, memberIndex) => (
                    <li key={memberIndex} className="mb-2">
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
                            className="border rounded p-1 mr-2"
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
                            className="border rounded p-1 mr-2"
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
                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
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
                  <button
                    onClick={() => handleAddPlayer(teamIndex)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 mt-2"
                  >
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
