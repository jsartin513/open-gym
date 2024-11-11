import React, { useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

const regularPlayers = [
  { name: 'John Doe', gender: 'male', extraStrongArm: true, skillLevel: 'advanced' },
  { name: 'Jane Smith', gender: 'female', skillLevel: 'intermediate' },
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

    const extraordinaryPlayers = attendance.filter(player => player.skillLevel === 'extraordinary');
    const veryAdvancedPlayers = attendance.filter(player => player.skillLevel === 'very advanced');
    const advancedPlayers = attendance.filter(player => player.skillLevel === 'advanced');
    const intermediatePlayers = attendance.filter(player => player.skillLevel === 'intermediate');

    let offset = 0;
    const distributePlayers = (players, offset) => {
      players.forEach((player, index) => {
        teams[(index + offset) % numTeams].push(player);
      });
      // Return the offset for the next group of players
      return players.length % numTeams;
    };

    offset = distributePlayers(extraordinaryPlayers, offset);
    offset = distributePlayers(veryAdvancedPlayers, offset);
    offset = distributePlayers(advancedPlayers, offset);
    distributePlayers(intermediatePlayers, offset);

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
        <ul>
          {filteredPlayers.map(player => (
            <li key={player.name} onClick={() => addPlayerToAttendance(player)}>
              {player.name}
            </li>
          ))}
        </ul>
        <div>
          <h2>Players in Attendance</h2>
          {attendance.map(player => (
            <div key={player.name} className={styles.playerPanel}>
              <span>{player.name}</span>
              <button onClick={() => removePlayerFromAttendance(player)}>X</button>
            </div>
          ))}
        </div>
        <button onClick={createTeams}>Create Teams</button>
        <div>
          <h2>Teams</h2>
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
        .playerPanel {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border: 1px solid #ccc;
          padding: 10px;
          margin: 5px 0;
        }
      `}</style>
    </div>
  );
}