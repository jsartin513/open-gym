import React from 'react';
import styles from '../styles/Home.module.css';

export default function NewPlayerModal({newPlayerName, setNewPlayerName, newPlayerGender, setNewPlayerGender, newPlayerSkillLevel, setNewPlayerSkillLevel, setShowModal, handleAddNewPlayer}) {
    return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>Add New Player</h2>
        <input
          type="text"
          placeholder="New Player Name"
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
        />
        <select
          value={newPlayerGender}
          onChange={(e) => setNewPlayerGender(e.target.value)}
        >
          <option value="male">male</option>
          <option value="female">female</option>
        </select>
        <select
          value={newPlayerSkillLevel}
          onChange={(e) => setNewPlayerSkillLevel(e.target.value)}
        >
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <button onClick={handleAddNewPlayer} className={styles.addButton}>Add Player</button>
        <button onClick={() => setShowModal(false)} className={styles.cancelButton}>Cancel</button>
      </div>
    </div>)
    }