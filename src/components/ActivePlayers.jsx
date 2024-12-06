import React, { useState } from "react";
import styles from "../styles/Home.module.css";
import CollapsiblePanel from "./CollapsiblePanel";

export default function ActivePlayers ({players, removePlayerFromAttendance, clearAttendance}) {


    return (<CollapsiblePanel
        title="Players in Attendance"
      >
        <button onClick={clearAttendance} className={styles.clearButton}>
          Clear All
        </button>

        <div className={styles.grid}>
          {players.map((player) => (
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
      </CollapsiblePanel>);
}