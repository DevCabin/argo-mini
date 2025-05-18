import { useState, useEffect } from 'react';
import styles from '../styles/AIFace.module.scss';
import personalityConfig from '../data/personality.json';

// Define the pixel patterns for each mood
const MOOD_PATTERNS = {
  '1': [ // Happy/Joyous
    [0,0,0,0,0,0,0,0],
    [0,0,1,0,0,1,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,1,0,0,0,0,1,0],
    [0,0,1,1,1,1,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0]
  ],
  '2': [ // Calm/Peaceful
    [0,0,0,0,0,0,0,0],
    [0,0,1,0,0,1,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,1,1,1,1,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0]
  ],
  '3': [ // Sad/Depressive
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,1,0,0,1,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,1,1,1,1,0,0],
    [0,1,0,0,0,0,1,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0]
  ],
  '4': [ // Anxious/Fearful
    [0,0,0,0,0,0,0,0],
    [0,0,1,0,0,1,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,1,1,1,1,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0]
  ],
  '5': [ // Angry/Aggressive
    [0,0,0,0,0,0,0,0],
    [0,1,0,0,0,0,1,0],
    [0,0,1,0,0,1,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,1,1,1,1,0,0],
    [0,1,0,0,0,0,1,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0]
  ],
  '6': [ // Energetic/Excited
    [0,0,1,0,0,1,0,0],
    [0,0,1,0,0,1,0,0],
    [0,0,0,0,0,0,0,0],
    [0,1,1,1,1,1,1,0],
    [0,1,0,0,0,0,1,0],
    [0,0,1,1,1,1,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0]
  ],
  '7': [ // Talking animation
    [0,0,0,0,0,0,0,0],
    [0,0,1,0,0,1,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,1,1,0,0,0],
    [0,0,1,1,1,1,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0]
  ],
  '8': [ // Thinking/Processing animation
    [0,0,0,0,0,0,0,0],
    [0,0,1,0,0,1,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,1,1,1,1,0,0],
    [0,0,0,1,1,0,0,0],
    [0,0,0,0,0,0,0,0]
  ],
  '9': [ // Blinking animation
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,1,1,1,1,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0]
  ]
};

function AIFace({ initialMood = '1', onMoodChange, isTalking = false, isProcessing = false }) {
  const [mood, setMood] = useState(initialMood);
  const [currentPattern, setCurrentPattern] = useState(MOOD_PATTERNS[initialMood]);
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    if (onMoodChange) {
      onMoodChange(mood);
    }
  }, [mood, onMoodChange]);

  // Handle blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150); // Blink duration
    }, 4000); // Blink every 4 seconds

    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    let pattern;
    if (isBlinking) {
      pattern = MOOD_PATTERNS['9'];
      console.log('Debug - Face State: Blinking');
    } else if (isTalking) {
      pattern = MOOD_PATTERNS['7'];
      console.log('Debug - Face State: Talking');
    } else if (isProcessing) {
      pattern = MOOD_PATTERNS['8'];
      console.log('Debug - Face State: Thinking');
    } else {
      pattern = MOOD_PATTERNS[mood];
      console.log('Debug - Face State: Mood', mood, personalityConfig.moods[mood]?.name);
    }
    setCurrentPattern(pattern);
  }, [mood, isTalking, isProcessing, isBlinking]);

  const currentMoodName = personalityConfig.moods[mood]?.name || 'Unknown Mood';

  return (
    <div className={styles.container}>
      <div className={styles.faceContainer}>
        <div className={styles.face} title={currentMoodName}>
          <div className={styles.pixelGrid}>
            {currentPattern.map((row, i) => (
              row.map((pixel, j) => (
                <div
                  key={`${i}-${j}`}
                  className={`${styles.pixel} ${pixel ? styles.active : ''}`}
                  style={{ backgroundColor: pixel ? '#00ff00' : '#111' }}
                />
              ))
            ))}
          </div>
        </div>
        <div className={styles.tooltip}>{currentMoodName}</div>
      </div>
    </div>
  );
}

export default AIFace; 