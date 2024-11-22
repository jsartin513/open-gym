import Layout from "./components/layout";

import React, { useState, useEffect } from "react";
import axios from "axios";
import CollapsiblePanel from "./components/CollapsiblePanel";
import styles from "../styles/Home.module.css";
import { parseCSV } from "../utils/csv.js";
import NewPlayerModal from "./components/NewPlayerModal";
import TeamsDisplay from "./components/TeamsDisplay";

export default function Home() {
  const [attendance, setAttendance] = useState([]);
  const [query, setQuery] = useState("");
  const [teams, setTeams] = useState([]);
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAvailablePlayers, setShowAvailablePlayers] = useState(true);
  const [showPlayersInAttendance, setShowPlayersInAttendance] = useState(true);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [newPlayerGender, setNewPlayerGender] = useState("");
  const [newPlayerSkillLevel, setNewPlayerSkillLevel] =
    useState("intermediate");

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

    const savedTeams = localStorage.getItem("teams");
    if (savedTeams) {
      setTeams(JSON.parse(savedTeams));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("attendance", JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem("teams", JSON.stringify(teams));
  }, [teams]);

  function addPlayerToAttendance(player) {
    if (!attendance.some((p) => p.name === player.name)) {
      setAttendance([...attendance, player]);
    }
  }

  const removePlayerFromAttendance = (player) => {
    setAttendance(attendance.filter((p) => p.name !== player.name));
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

  const numberOfTeams = () => {
    const numPlayers = attendance.length;
    let numTeams = 2;

    if (numPlayers >= 15 && numPlayers <= 19) {
      numTeams = 3;
    } else if (numPlayers >= 20 && numPlayers <= 32) {
      numTeams = 4;
    } else if (numPlayers > 32) {
      numTeams = Math.floor(numPlayers / 8); // Max out at 8 players per team
    }
    return numTeams;
  };

  const createTeams = () => {
    const numTeams = numberOfTeams();

    const teams = Array.from({ length: numTeams }, () => []);

    const ordered_genders = ["male", "nonbinary", "female"];
    const ordered_skill_levels = [
      "anarchy",
      "elite",
      "advanced",
      "intermediate",
    ];

    let orderedPlayers = [];
    ordered_genders.forEach((gender) => {
      const thisGenderPlayers = attendance.filter(
        (player) => player.gender.toLowerCase() === gender
      );
      ordered_skill_levels.forEach((skillLevel) => {
        const playerSet = thisGenderPlayers.filter(
          (player) => player.skillLevel.toLowerCase() === skillLevel
        );
        orderedPlayers = [...orderedPlayers, ...playerSet];
      });
    });
    const unassignedPlayers = attendance.filter(
      (player) => !orderedPlayers.includes(player)
    );
    orderedPlayers = [...orderedPlayers, ...unassignedPlayers];

    const distributePlayersBySnake = (playersSkillOrdered) => {
      let descending = false;
      playersSkillOrdered.forEach((player, index) => {
        const playerTeam = descending
          ? numTeams - (index % numTeams) - 1
          : index % numTeams;
        teams[playerTeam].push(player);
        if (
          (descending && playerTeam === 0) ||
          (!descending && playerTeam === numTeams - 1)
        ) {
          descending = !!!descending;
        }
      });
    };
    distributePlayersBySnake(orderedPlayers);

    setTeams(teams);
  };

  return (
    <div className={styles.container}>
      <Layout>
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

          <CollapsiblePanel
            title="Players in Attendance"
            isOpen={showPlayersInAttendance}
            toggleOpen={() =>
              setShowPlayersInAttendance(!showPlayersInAttendance)
            }
          >
            <button onClick={clearAttendance} className={styles.clearButton}>
              Clear All
            </button>
            <button onClick={createTeams} className={styles.createButton}>
              Create Teams
            </button>

            <div className={styles.grid}>
              {attendance.map((player) => (
                <div key={player.name} className={styles.playerPanel}>
                  <div>{player.name}</div>
                  <div>
                    <button
                      onClick={() => removePlayerFromAttendance(player)}
                      className={styles.removeButton}
                    >
                      X
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CollapsiblePanel>

        
        <TeamsDisplay 
          teams={teams} 
          players={attendance} 
          setTeams={setTeams} 
          setPlayers={setAttendance}
          clearTeams={clearTeams}
          createTeams={createTeams}
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
      `}</style>
    </div>
  );
}
