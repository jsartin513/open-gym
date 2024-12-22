import React from 'react';
import styles from '../styles/PrintableSchedule.module.css';

const PrintableSchedule = ({ schedule }) => {
  return (
    <div className={styles.printableContainer}>
      <h1>Printable Game Schedule</h1>
      <table className={styles.scheduleTable}>
        <thead>
          <tr>
            <th>Home Team/Inner Wall</th>
            <th>Away Team/Door Side</th>
            <th className={styles.winnersColumn}>Winner</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((game, index) => (
            <tr key={index}>
              <td>{game.homeTeam}</td>
              <td>{game.awayTeam}</td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PrintableSchedule;