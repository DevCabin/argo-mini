import { useState, useEffect } from 'react';
import { diceDbService } from '../experiments/dice/diceDb';
import styles from './SessionDice.module.scss';

export function SessionDice() {
  const [sessionRoll, setSessionRoll] = useState(null);

  useEffect(() => {
    const initializeSessionRoll = async () => {
      let roll = await diceDbService.getSessionRoll();
      
      if (!roll) {
        // Use crypto.getRandomValues for true randomness
        const array = new Uint32Array(1);
        crypto.getRandomValues(array);
        roll = (array[0] % 6) + 1; // Get a number between 1 and 6
        await diceDbService.saveSessionRoll(roll);
      }
      
      setSessionRoll(roll);
    };

    initializeSessionRoll();
  }, []);

  if (!sessionRoll) return null;

  return (
    <div className={styles.sessionDice}>
      <span>Session Roll: {sessionRoll}</span>
    </div>
  );
} 