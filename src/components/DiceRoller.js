import { useState, useEffect } from 'react';
import { dbService } from '../utils/db';
import styles from '../styles/DiceRoller.module.scss';

export default function DiceRoller() {
  const [lastRoll, setLastRoll] = useState(null);
  const [recentRolls, setRecentRolls] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    distribution: Array(6).fill(0),
    lastRoll: null
  });

  useEffect(() => {
    loadStats();
    loadRecentRolls();
  }, []);

  const loadStats = async () => {
    const stats = await dbService.getDiceRollStats();
    setStats(stats);
  };

  const loadRecentRolls = async () => {
    const rolls = await dbService.getRecentDiceRolls(10);
    setRecentRolls(rolls);
  };

  const rollDice = async () => {
    const value = Math.floor(Math.random() * 6) + 1;
    setLastRoll(value);
    await dbService.saveDiceRoll(value);
    await loadStats();
    await loadRecentRolls();
  };

  return (
    <div className={styles.container}>
      <h2>Dice Roller</h2>
      
      <div className={styles.diceSection}>
        <button onClick={rollDice} className={styles.rollButton}>
          Roll Dice
        </button>
        {lastRoll && (
          <div className={styles.lastRoll}>
            You rolled: <span>{lastRoll}</span>
          </div>
        )}
      </div>

      <div className={styles.statsSection}>
        <h3>Statistics</h3>
        <div className={styles.distribution}>
          {stats.distribution.map((count, index) => (
            <div key={index} className={styles.distributionBar}>
              <span className={styles.number}>{index + 1}</span>
              <div 
                className={styles.bar} 
                style={{ 
                  width: stats.total ? `${(count / stats.total) * 100}%` : '0%'
                }}
              />
              <span className={styles.count}>{count}</span>
            </div>
          ))}
        </div>
        <div className={styles.total}>
          Total rolls: {stats.total}
        </div>
      </div>

      <div className={styles.historySection}>
        <h3>Recent Rolls</h3>
        <div className={styles.rolls}>
          {recentRolls.map((roll) => (
            <div key={roll.id} className={styles.roll}>
              <span className={styles.value}>{roll.value}</span>
              <span className={styles.time}>
                {new Date(roll.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 