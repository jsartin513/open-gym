import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Head from 'next/head';
import styles from '../styles/Home.module.css';


export default function Home() {
  const [attendance, setAttendance] = useState([]);
  const [query, setQuery] = useState('');
  const [teams, setTeams] = useState([]);
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerGender, setNewPlayerGender] = useState('');
  const [newPlayerSkillLevel, setNewPlayerSkillLevel] = useState('intermediate');

  function parseCSV(csvText) {
    const rows = csvText.split(/\r?\n/); // Split CSV text into rows, handling '\r' characters
    const headers = rows[0].split(','); // Extract headers (assumes the first row is the header row)
    const data = []; // Initialize an array to store parsed data
    for (let i = 1; i < rows.length; i++) {
        const rowData = rows[i].split(','); // Split the row, handling '\r' characters
        const rowObject = {};
        for (let j = 0; j < headers.length; j++) {
            rowObject[headers[j]] = rowData[j];
        }
        data.push(rowObject);
    }
    return data;
}

  const fetchPlayerData = () => {
    const csvUrl = process.env.NEXT_PUBLIC_CSV_URL; // Replace with your Google Sheets CSV file URL
    axios.get(csvUrl)
    .then((response) => {
        const parsedCsvData = parseCSV(response.data).sort((a, b) => b.frequency - a.frequency).filter(player => player.frequency > 2);
        setAvailablePlayers(parsedCsvData);
    })
    .catch((error) => {
        console.error('Error fetching CSV data:', error);
    });
  };

  useEffect(() => {
    fetchPlayerData();
  }, []);

  function addPlayerToAttendance(player) {
    if (!attendance.some(p => p.name === player.name)) {
      setAttendance([...attendance, player]);
    }
  }

  const removePlayerFromAttendance = (player) => {
    setAttendance(attendance.filter(p => p.name !== player.name));
  };

  const clearAttendance = () => {
    setAttendance([]);
  };

  const clearTeams = () => {
    setTeams([]);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    const playerExists = availablePlayers.some(player => player.name.toLowerCase().includes(value.toLowerCase()));
    if (!playerExists && value !== '') {
      setNewPlayerName(value);
      setShowModal(true);
    }
  };

  const handleAddNewPlayer = () => {
    const newPlayer = { name: newPlayerName, gender: newPlayerGender, skillLevel: newPlayerSkillLevel };
    setAvailablePlayers([...availablePlayers, newPlayer])
    addPlayerToAttendance(newPlayer);
    setShowModal(false);
    setNewPlayerName('');
    setNewPlayerSkillLevel('intermediate');
    setQuery('');
  };

  const filteredPlayers = availablePlayers.filter(player =>
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


    const ordered_genders = ['male', 'female']
    const ordered_skill_levels = ['anarchy', 'elite', 'advanced', 'intermediate']


    let orderedPlayers = [];
    ordered_genders.forEach((gender) => 
    {  
      const thisGenderPlayers = attendance.filter(player => player.gender.toLowerCase() === gender)
      ordered_skill_levels.forEach(
        (skillLevel) => {
        const playerSet = thisGenderPlayers.filter(player => player.skillLevel.toLowerCase() === skillLevel)
        orderedPlayers = [...orderedPlayers, ...playerSet]
        }
      )
    })

    const distributePlayersBySnake = (playersSkillOrdered) => {
      let descending = false;
      playersSkillOrdered.forEach((player, index) => {
        const playerTeam = descending ? (numTeams - (index % numTeams) - 1)  : index % numTeams
        teams[playerTeam].push(player);
        if ((descending && playerTeam === 0) || (!descending && playerTeam === numTeams - 1)){
          descending = !!!descending;
        }
      });

    }
    distributePlayersBySnake(orderedPlayers);

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
        <h2>Add Player to Attendance</h2>
        <input
          type="text"
          placeholder="Search or add players..."
          value={query}
          onChange={handleSearchChange}
        />
        <div className='grid'>
          {filteredPlayers.map(player => (
            <button
              key={player.name}
              onClick={() => addPlayerToAttendance(player)}
              disabled={attendance.some(p => p.name === player.name)}
              className={attendance.some(p => p.name === player.name) ? 'disabledButton' : 'playerButton'}
            >
              {player.name}
            </button>
          ))}
        </div>
          <h2>Players in Attendance</h2>
          <button onClick={clearAttendance} className='clearButton'>Clear All</button>
          <div className='attendanceGrid'>
            {attendance.map(player => (
              <div key={player.name} className='playerPanel'>
                <div>{player.name}</div>
                <div><button onClick={() => removePlayerFromAttendance(player)} className='removeButton'>X</button></div>
              </div>
            ))}
          </div>
        <button onClick={createTeams} className='createButton'>Create Teams</button>
        <div>
          <h2>Teams</h2>
          <button onClick={clearTeams} className='clearButton'>Clear Teams</button>
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

      {showModal && (
        <div className="modal">
          <div className="modalContent">
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
            <button onClick={handleAddNewPlayer} className='addButton'>Add Player</button>
            <button onClick={() => setShowModal(false)} className='cancelButton'>Cancel</button>
          </div>
        </div>
      )}

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
          width: 80%;
        }
        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          width: 100%;
          height: 400px;
          overflow-y: scroll;
          gap: 10px;
          margin: 20px 0;
        }
        .attendanceGrid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          width: 100%;
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
          align-items: center;
          border: 1px solid #ccc;
          padding: 10px;
          margin: 5px 0;
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
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .modalContent {
          background-color: white;
          padding: 20px;
          border-radius: 5px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .addButton, .cancelButton {
          padding: 10px;
          background-color: #418fde;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s;
          margin: 5px;
        }
        .addButton:hover, .cancelButton:hover {
          background-color: #357acb;
        }
      `}</style>
    </div>
  );
}