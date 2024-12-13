import Layout from "../components/(layout)/layout.js";
import React, { useState, useEffect } from "react";
import axios from "axios";
import CollapsiblePanel from "../components/CollapsiblePanel.jsx";
import styles from "../styles/Home.module.css";
import { parseCSV } from "../utils/csv.js";
import NewPlayerModal from "../components/NewPlayerModal.jsx";
import TeamsDisplay from "../components/TeamsDisplay.jsx";
import ActivePlayers from "../components/ActivePlayers.jsx";

export default function AttendancePage() {
  const [attendance, setAttendance] = useState([]);
  const [query, setQuery] = useState("");
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [expectedPlayers, setExpectedPlayers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [newPlayerGender, setNewPlayerGender] = useState("");
  const [newPlayerSkillLevel, setNewPlayerSkillLevel] = useState("intermediate");

  const fetchPlayerData = () => {
    const csvUrl = process.env.NEXT_PUBLIC_CSV_URL; // Replace with your Google Sheets CSV file URL
    axios
      .get(csvUrl)
      .then((response) => {
        const parsedCsvData = parseCSV(response.data)
          .sort((a, b) => b.frequency - a.frequency)
          .filter((player) => player.frequency > 2);
        setAvailablePlayers(parsedCsvData);
      })
      .catch((error) => {
        console.error("Error fetching CSV data:", error);
      });
  };

  useEffect(() => {
    fetchPlayerData();
  }, []);

  useEffect(() => {
    const savedAttendance = localStorage.getItem("attendance");
    if (savedAttendance) {
      setAttendance(JSON.parse(savedAttendance));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("attendance", JSON.stringify(attendance));
  }, [attendance]);


  // People tell me that someone else is coming - so I want
  // that person on a team, but we can't fill the team
  // with players who aren't there yet
  function addPlayerToExpectedPlayers(player){
    if (!expectedPlayers.some((p) => p.name === player.name)) {
      setExpectedPlayers([...expectedPlayers, player])
    }
  }

  function addPlayerToAttendance(player) {
    if (!attendance.some((p) => p.name === player.name)) {
      setAttendance([...attendance, player]);
    }
    setExpectedPlayers(expectedPlayers.filter((p) => p.name !== player.name));
  }

  const removePlayerFromAttendance = (player) => {
    setAttendance(attendance.filter((p) => p.name !== player.name));
  };

  const clearAttendance = () => {
    setAttendance([]);
    setExpectedPlayers([]);
  };

  const clearTeams = () => {
    setTeams([]);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    const playerExists = availablePlayers.some((player) =>
      player.name.toLowerCase().includes(value.toLowerCase())
    );
    if (!playerExists && value !== "") {
      setNewPlayerName(value);
      setShowModal(true);
    }
  };

  const handleAddNewPlayer = () => {
    const newPlayer = {
      name: newPlayerName,
      gender: newPlayerGender,
      skillLevel: newPlayerSkillLevel,
    };
    setAvailablePlayers([...availablePlayers, newPlayer]);
    addPlayerToAttendance(newPlayer);
    setShowModal(false);
    setNewPlayerName("");
    setNewPlayerSkillLevel("intermediate");
    setQuery("");
  };

  const filteredPlayers = availablePlayers.filter((player) =>
    player.name.toLowerCase().includes(query.toLowerCase())
  );


  return (
    <div className={styles.container}>
      <Layout>
        <main>
          <h1>Open Gym Teammaker</h1>
          <CollapsiblePanel
            title="Add Player to Attendance"
          >
            <input
              type="text"
              placeholder="Search or add players..."
              value={query}
              onChange={handleSearchChange}
            />
            <div className={styles.grid}>
              {filteredPlayers.map((player) => (
                <button
                  key={player.name}
                  onClick={() => addPlayerToAttendance(player)}
                  disabled={attendance.some((p) => p.name === player.name)}
                  className={
                    attendance.some((p) => p.name === player.name)
                      ? styles.disabledButton
                      : styles.playerButton
                  }
                >
                  {player.name}
                </button>
              ))}
            </div>
          </CollapsiblePanel>

          <ActivePlayers 
            players={attendance}
            removePlayerFromAttendance={removePlayerFromAttendance}
            clearAttendance={clearAttendance}/>

        
        <TeamsDisplay 
          attendance={attendance} 
          setPlayers={setAttendance}
          clearTeams={clearTeams}
        />
          
        </main>
      </Layout>

      {showModal && (
        <NewPlayerModal
          showModal={showModal}
          newPlayerName={newPlayerName}
          setNewPlayerName={setNewPlayerName}
          newPlayerGender={newPlayerGender}
          setNewPlayerGender={setNewPlayerGender}
          newPlayerSkillLevel={newPlayerSkillLevel}
          setNewPlayerSkillLevel={setNewPlayerSkillLevel}
          handleAddNewPlayer={handleAddNewPlayer}
          setShowModal={setShowModal}
        />
      )}
    </div>
  );
}
