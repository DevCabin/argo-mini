import { useState } from 'react';
import styles from './DiceRoller.module.scss';

export function DiceRoller({ onRoll, lastRoll }) {
  const [isAutoRolling, setIsAutoRolling] = useState(false);
  const [useCrypto, setUseCrypto] = useState(false);

  const generateRoll = () => {
    if (useCrypto) {
      const array = new Uint32Array(1);
      crypto.getRandomValues(array);
      return (array[0] % 6) + 1;
    } else {
      return Math.floor(Math.random() * 6) + 1;
    }
  };

  const handleRoll = () => {
    const value = generateRoll();
    onRoll(value);
  };

  const handleAutoRoll = async () => {
    if (isAutoRolling) return;
    
    setIsAutoRolling(true);
    const totalRolls = 100;
    const batchSize = 10;
    
    try {
      for (let i = 0; i < totalRolls; i += batchSize) {
        const batch = Math.min(batchSize, totalRolls - i);
        const rolls = Array(batch).fill(0).map(() => generateRoll());
        
        for (const value of rolls) {
          await onRoll(value);
        }
        
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    } finally {
      setIsAutoRolling(false);
    }
  };

  return (
    <div className={styles.diceSection}>
      <div className={styles.controls}>
        <button onClick={handleRoll} className={styles.rollButton} disabled={isAutoRolling}>
          Roll Dice
        </button>
        <button 
          onClick={handleAutoRoll} 
          className={`${styles.rollButton} ${styles.autoRollButton}`}
          disabled={isAutoRolling}
        >
          {isAutoRolling ? 'Rolling...' : 'Auto-Roll (100x)'}
        </button>
      </div>
      
      <div className={styles.settings}>
        <label className={styles.cryptoToggle}>
          <input
            type="checkbox"
            checked={useCrypto}
            onChange={(e) => setUseCrypto(e.target.checked)}
            disabled={isAutoRolling}
          />
          Use Cryptographic RNG
        </label>
        <div className={styles.rngInfo}>
          Using: {useCrypto ? 'Crypto.getRandomValues()' : 'Math.random()'}
        </div>
      </div>

      {lastRoll && (
        <div className={styles.lastRoll}>
          You rolled: <span>{lastRoll}</span>
        </div>
      )}
    </div>
  );
} 