import React, { useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

const regularPlayers = [
  { name: 'Armando', gender: 'male', skillLevel: 'extraordinary' },
  { name: 'Brandon Kelley', gender: 'male', skillLevel: 'extraordinary' },
  { name: 'Bo', gender: 'male', skillLevel: 'very advanced' },
  { name: 'Kyle', gender: 'male', skillLevel: 'very advanced' },
  { name: 'Decker', gender: 'male', skillLevel: 'very advanced' },
  { name: 'Zach', gender: 'male', skillLevel: 'advanced' },
  { name: 'Alex', gender: 'male', skillLevel: 'advanced' },
  { name: 'Dave Hollm', gender: 'male', skillLevel: 'advanced' },
  { name: 'Jon', gender: 'male', skillLevel: 'advanced' },
  { name: 'Nick Scali', gender: 'male', skillLevel: 'advanced' },
  { name: 'Nick Trask', gender: 'male', skillLevel: 'intermediate' },
  { name: 'Garrett', gender: 'male', skillLevel: 'intermediate', strongArm: true },
  { name: 'Matt C', gender: 'male', skillLevel: 'intermediate', strongArm: true },
  { name: 'Connor', gender: 'male', skillLevel: 'intermediate', strongArm: true },
  { name: 'Brandon Johnson', gender: 'male', skillLevel: 'intermediate', strongArm: true },
  { name: 'Abby', gender: 'female', skillLevel: 'advanced'},
  { name: 'Jess', gender: 'female', skillLevel: 'advanced'},
  { name: 'Lovie', gender: 'female', skillLevel: 'advanced'},
  { name: 'Mackenzie', gender: 'female', skillLevel: 'advanced'},
  { name: 'Sami', gender: 'female', skillLevel: 'advanced'},

  // Add more players as needed
];

export default function Home() {
  const [attendance, setAttendance] = useState([]);
  const [query, setQuery] = useState('');
  const [teams, setTeams] = useState([]);

  const addPlayerToAttendance = (player) => {
    if (!attendance.some(p => p.name === player.name)) {
      setAttendance([...attendance, player]);
    }
  };

  const removePlayerFromAttendance = (player) => {
    setAttendance(attendance.filter(p => p.name !== player.name));
  };

  const clearAttendance = () => {
    setAttendance([]);
  };

  const clearTeams = () => {
    setTeams([]);
  };

  const filteredPlayers = regularPlayers.filter(player =>
    player.name.toLowerCase().includes(query.toLowerCase())
  );

  const createTeams = () => {
    const numPlayers = attendance.length;
    let numTeams = 2;

    if (numPlayers >= 15 && numPlayers <= 19) {
      numTeams = 3;
    } else if (numPlayers >= 20 && numPlayers <= 32) {
      numTeams = 4;
    }

    const teams = Array.from({ length: numTeams }, () => []);

    const malePlayers = attendance.filter(player => player.gender === 'male');

    const extraordinaryPlayers = malePlayers.filter(player => player.skillLevel === 'extraordinary');
    const veryAdvancedPlayers = malePlayers.filter(player => player.skillLevel === 'very advanced');
    const advancedPlayers = malePlayers.filter(player => player.skillLevel === 'advanced');
    const intermediateStrongPlayers = malePlayers.filter(player => player.skillLevel === 'intermediate' && player.strongArm);
    const intermediatePlayers = malePlayers.filter(player => player.skillLevel === 'intermediate' && !player.strongArm);

    const femalePlayers = attendance.filter(player => player.gender === 'female'); // TODO: Other genders

    let offset = 0;
    const distributePlayers = (players, offset) => {
      players.forEach((player, index) => {
        teams[(index + offset) % numTeams].push(player);
      });
      const newOffset = (players.length + offset) % numTeams;
      // Return the offset for the next group of players
      return newOffset;
    };

    offset = distributePlayers(extraordinaryPlayers, offset);
    offset = distributePlayers(veryAdvancedPlayers, offset);
    offset = distributePlayers(advancedPlayers, offset);
    offset = distributePlayers(intermediateStrongPlayers, offset);
    offset = distributePlayers(intermediatePlayers, offset);
    offset = distributePlayers(femalePlayers, offset);

    setTeams(teams);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Open Gym Teammaker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Open Gym Teammaker</h1>
        <input
          type="text"
          placeholder="Search players..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className={styles.grid}>
          {filteredPlayers.map(player => (
            <button
              key={player.name}
              onClick={() => addPlayerToAttendance(player)}
              disabled={attendance.some(p => p.name === player.name)}
              className={attendance.some(p => p.name === player.name) ? styles.disabledButton : styles.playerButton}
            >
              {player.name}
            </button>
          ))}
        </div>
        <div>
          <h2>Players in Attendance</h2>
          <button onClick={clearAttendance} className={styles.clearButton}>Clear All</button>
          {attendance.map(player => (
            <div key={player.name} className='playerPanel'>
              <div>{player.name}</div>
              <div><button onClick={() => removePlayerFromAttendance(player)} className={styles.removeButton}>X</button></div>
            </div>
          ))}
        </div>
        <button onClick={createTeams} className={styles.createButton}>Create Teams</button>
        <div>
          <h2>Teams</h2>
          <button onClick={clearTeams} className={styles.clearButton}>Clear Teams</button>
          {teams.map((team, index) => (
            <div key={index}>
              <h3>Team {index + 1}</h3>
              <ul>
                {team.map(player => (
                  <li key={player.name}>{player.name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>

      <footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel" className={styles.logo} />
        </a>
      </footer>

      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 10px;
          margin: 20px 0;
        }
        .playerButton {
          padding: 10px;
          background-color: #418fde;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .playerButton:hover {
          background-color: #357acb;
        }
        .disabledButton {
          padding: 10px;
          background-color: #ccc;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: not-allowed;
        }
        .playerPanel {
          display: flex;
          justify-content: space-between;
          align-items: justify;
          border: 1px solid #ccc;
          padding: 10px;
          margin: 10px 5px;
          background-color: #f9f9f9;
          border-radius: 5px;
          position: relative;
        }
        .removeButton {
          background-color: #fdda24;
          color: black;
          border: none;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          margin-left: 10px;
          padding-left: 10px;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          position: absolute;
          top: 5px;
          right: 5px;
        }
        .removeButton:hover {
          background-color: #e6c020;
        }
        .clearButton, .createButton {
          padding: 10px;
          background-color: #fdda24;
          color: black;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s;
          margin: 5px;
        }
        .clearButton:hover, .createButton:hover {
          background-color: #e6c020;
        }
      `}</style>
    </div>
  );
}