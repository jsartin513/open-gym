import React, { useEffect, useState } from 'react';
import Layout from './components/layout';
import styles from '../styles/Home.module.css';

const TeamsPage = () => {
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const storedTeams = JSON.parse(localStorage.getItem('selectedTeams') || '[]');
    setSelectedTeams(storedTeams);
  }, []);

  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
  };

  const handleTeamNameChange = (teamIndex, memberIndex, newName) => {
    const updatedTeams = [...selectedTeams];
    updatedTeams[teamIndex][memberIndex].name = newName;
    setSelectedTeams(updatedTeams);
    localStorage.setItem('selectedTeams', JSON.stringify(updatedTeams));
  };

  const handleAddPlayer = (teamIndex) => {
    const updatedTeams = [...selectedTeams];
    updatedTeams[teamIndex].push({ name: 'New Player' });
    setSelectedTeams(updatedTeams);
    localStorage.setItem('selectedTeams', JSON.stringify(updatedTeams));
  };

  return (
    <Layout>
      <div className={styles.container}>
        <h1>Open Gym Teams</h1>
        <button onClick={handleEditToggle}>
          {isEditMode ? 'Save' : 'Edit'}
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
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) =>
                            handleTeamNameChange(teamIndex, memberIndex, e.target.value)
                          }
                        />
                      ) : (
                        member.name
                      )}
                    </li>
                  ))}
                </ul>
                {isEditMode && (
                  <button onClick={() => handleAddPlayer(teamIndex)}>Add Player</button>
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