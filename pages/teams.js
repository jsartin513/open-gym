import React, { useEffect, useState } from 'react';
import Layout from './components/layout';
import styles from '../styles/Home.module.css';

const TeamsPage = () => {
  const [selectedTeams, setSelectedTeams] = useState([]);

  useEffect(() => {
    const storedTeams = JSON.parse(localStorage.getItem('selectedTeams') || '[]');
    setSelectedTeams(storedTeams);
  }, []);

return (
    <Layout>
        <div className={styles.container}>
            <h1>Open Gym Teams</h1>
            <div className={styles.teamsLists}>
                {selectedTeams.length === 0 ? (
                    <p>No teams selected.</p>
                ) : (
                    selectedTeams.map((team, index) => (
                        <div key={index} className={styles.team}>
                            Team {index + 1}
                            <ul>
                                {team.map((member, memberIndex) => (
                                    <li key={memberIndex}>{member.name}</li>
                                ))}
                            </ul>
                        </div>
                    ))
                )}
            </div>
        </div>
    </Layout>
);
};

export default TeamsPage;