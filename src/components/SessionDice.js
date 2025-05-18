import { useState, useEffect } from 'react';
import { diceDbService } from '../experiments/dice/diceDb';
import { moodService } from '../services/moodService';
import AIFace from './AIFace';
import styles from './SessionDice.module.scss';

export function SessionDice() {
  const [sessionRoll, setSessionRoll] = useState(null);
  const [currentMood, setCurrentMood] = useState('happy');

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
      setCurrentMood(moodService.getMoodFromDiceRoll(roll));
    };

    initializeSessionRoll();
  }, []);

  const handleMoodChange = (newMood) => {
    setCurrentMood(newMood);
  };

  if (!sessionRoll) return null;

  return (
    <div className={styles.container}>
      <div className={styles.diceDisplay}>
        <span>Session Roll: {sessionRoll}</span>
      </div>
      <AIFace initialMood={currentMood} onMoodChange={handleMoodChange} />
    </div>
  );
} 