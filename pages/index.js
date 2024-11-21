import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { parseCSV } from '../utils/csv.js';


export default function Home() {
  const [attendance, setAttendance] = useState([]);
  const [query, setQuery] = useState('');
  const [teams, setTeams] = useState([]);
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAvailablePlayers, setShowAvailablePlayers] = useState(true);
  const [showPlayersInAttendance, setShowPlayersInAttendance] = useState(true);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerGender, setNewPlayerGender] = useState('');
  const [newPlayerSkillLevel, setNewPlayerSkillLevel] = useState('intermediate');


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

  useEffect(() => {
    const savedAttendance = localStorage.getItem('attendance');
    if (savedAttendance) {
      setAttendance(JSON.parse(savedAttendance));
    }

    const savedTeams = localStorage.getItem('teams');
    if (savedTeams) {
      setTeams(JSON.parse(savedTeams));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('teams', JSON.stringify(teams));
  }, [teams]);

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


  const numberOfTeams = () => {
    const numPlayers = attendance.length;
    let numTeams = 2;

    if (numPlayers >= 15 && numPlayers <= 19) {
      numTeams = 3;
    } else if (numPlayers >= 20 && numPlayers <= 32) {
      numTeams = 4;
    }
    else {
      numTeams = Math.floor(numPlayers / 8); // Max out at 8 players per team
    }
    return numTeams;
  }



  const createTeams = () => {
    const numTeams = numberOfTeams();

    const teams = Array.from({ length: numTeams }, () => []);


    const ordered_genders = ['male', 'nonbinary', 'female']
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

  const CollapsiblePanel = ({ title, isOpen, toggleOpen, children }) => (
    <div className={isOpen ? styles.collapsiblePanel.open : styles.collapsiblePanel}>
      <h2>
        {title}
        <button onClick={toggleOpen} className={styles.toggleButton}>
          {isOpen ? 'Hide' : 'Show'}
        </button>
      </h2>
      {isOpen && children}
    </div>
  );

  return (
    <div className={styles.container}>
      <Head>
        <title>Open Gym Teammaker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Open Gym Teammaker</h1>
        <CollapsiblePanel
          title="Add Player to Attendance"
          isOpen={showAvailablePlayers}
          toggleOpen={() => setShowAvailablePlayers(!showAvailablePlayers)}
        >
          <input
            type="text"
            placeholder="Search or add players..."
            value={query}
            onChange={handleSearchChange}
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
        </CollapsiblePanel>

        <CollapsiblePanel
          title="Players in Attendance"
          isOpen={showPlayersInAttendance}
          toggleOpen={() => setShowPlayersInAttendance(!showPlayersInAttendance)}
        >
          <button onClick={clearAttendance} className={styles.clearButton}>Clear All</button>
          <button onClick={createTeams} className={styles.createButton}>Create Teams</button>

          <div className={styles.grid}>
            {attendance.map(player => (
              <div key={player.name} className={styles.playerPanel}>
                <div>{player.name}</div>
                <div><button onClick={() => removePlayerFromAttendance(player)} className={styles.removeButton}>X</button></div>
              </div>
            ))}
          </div>
        </CollapsiblePanel>

        <div>
          <h2>Teams</h2>
          <button onClick={clearTeams} className={styles.clearButton}>Clear Teams</button>
          <button onClick={createTeams} className={styles.createButton}>Create/Update Teams</button>
          <div className={styles.teamOuter}>
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
        </div>
      </main>

      {showModal && (
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
      `}</style>
    </div>
  );
}