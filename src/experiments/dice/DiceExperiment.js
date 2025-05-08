import { useState, useEffect } from 'react';
import styles from './DiceExperiment.module.scss';
import { diceDbService } from './diceDb';
import { DiceRoller } from './components/DiceRoller';
import { DiceStats } from './components/DiceStats';
import { ExperimentControls } from './components/ExperimentControls';
import { EXPERIMENT_NAME, EXPERIMENT_DESCRIPTION } from './constants';

export const EXPERIMENT_ID = 'dice_roller';

export function DiceExperiment() {
  const [stats, setStats] = useState({
    total: 0,
    distribution: Array(6).fill(0),
    lastRoll: null
  });
  const [recentRolls, setRecentRolls] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadStats();
    loadRecentRolls();
  }, []);

  const loadStats = async () => {
    const stats = await diceDbService.getDiceRollStats();
    setStats(stats);
  };

  const loadRecentRolls = async () => {
    const rolls = await diceDbService.getRecentDiceRolls(10);
    setRecentRolls(rolls);
  };

  const handleRoll = async (value) => {
    await diceDbService.saveDiceRoll(value);
    await loadStats();
    await loadRecentRolls();
  };

  const handleClearData = async () => {
    if (window.confirm('⚠️ WARNING: Are you sure you want to clear all dice roll data? This action cannot be undone.')) {
      try {
        await diceDbService.clearData();
        setMessage('Dice roll data has been cleared!');
        setTimeout(() => setMessage(''), 3000);
        await loadStats();
        await loadRecentRolls();
      } catch (error) {
        setMessage('Error clearing data. Please try again.');
        console.error('Error:', error);
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2>{EXPERIMENT_NAME}</h2>
      <p className={styles.description}>{EXPERIMENT_DESCRIPTION}</p>
      
      {message && (
        <div className={`${styles.message} ${message.includes('Error') ? styles.error : styles.success}`}>
          {message}
        </div>
      )}

      <ExperimentControls onClearData={handleClearData} />
      <DiceRoller onRoll={handleRoll} lastRoll={stats.lastRoll} />
      <DiceStats stats={stats} recentRolls={recentRolls} />
    </div>
  );
} 