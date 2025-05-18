import { useState, useEffect } from 'react';
import { diceDbService } from '../experiments/dice/diceDb';
import styles from './RollHistory.module.scss';

export function RollHistory() {
  const [rolls, setRolls] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    distribution: Array(6).fill(0)
  });

  useEffect(() => {
    loadRollHistory();
  }, []);

  const loadRollHistory = async () => {
    const recentRolls = await diceDbService.getRecentDiceRolls(10);
    const rollStats = await diceDbService.getDiceRollStats();
    setRolls(recentRolls);
    setStats(rollStats);
  };

  return (
    <div className={styles.container}>
      <h2>Roll History</h2>
      
      <div className={styles.stats}>
        <h3>Distribution</h3>
        <div className={styles.distribution}>
          {stats.distribution.map((count, index) => (
            <div key={index} className={styles.barContainer}>
              <div className={styles.label}>Roll {index + 1}</div>
              <div className={styles.barWrapper}>
                <div 
                  className={styles.bar} 
                  style={{ 
                    width: `${(count / stats.total) * 100}%`,
                    opacity: count > 0 ? 1 : 0.3
                  }}
                />
                <span className={styles.count}>{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.recentRolls}>
        <h3>Recent Rolls</h3>
        <table>
          <thead>
            <tr>
              <th>Roll</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {rolls.map((roll, index) => (
              <tr key={index}>
                <td>{roll.value}</td>
                <td>{new Date(roll.timestamp).toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 