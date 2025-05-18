import React, { useState, useEffect } from 'react';
import './DigitalFace.css';

const DigitalFace = ({ state = '2', color = '#33dd44' }) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  
  // Emotional states mapped to pixel patterns
  const facePatterns = {
    // 1: Happy/Joyous
    '1': [
      [0,0,0,0,0,0,0,0],
      [0,0,1,0,0,1,0,0],
      [0,0,1,0,0,1,0,0],
      [0,0,0,0,0,0,0,0],
      [0,1,0,0,0,0,1,0],
      [0,0,1,1,1,1,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0]
    ],
    
    // 2: Calm/Peaceful
    '2': [
      [0,0,0,0,0,0,0,0],
      [0,0,1,0,0,1,0,0],
      [0,0,1,0,0,1,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,1,1,1,1,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0]
    ],
    
    // 3: Sad/Depressive
    '3': [
      [0,0,0,0,0,0,0,0],
      [0,0,1,0,0,1,0,0],
      [0,0,1,0,0,1,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,1,1,1,1,0,0],
      [0,1,0,0,0,0,1,0],
      [0,0,0,0,0,0,0,0]
    ],
    
    // 4: Anxious/Fearful
    '4': [
      [0,0,0,0,0,0,0,0],
      [0,0,1,0,0,1,0,0],
      [0,0,1,0,0,1,0,0],
      [0,0,0,0,0,0,0,0],
      [0,1,0,0,0,0,1,0],
      [0,0,1,1,1,1,0,0],
      [0,1,0,0,0,0,1,0],
      [0,0,0,0,0,0,0,0]
    ],
    
    // 5: Angry/Aggressive
    '5': [
      [0,0,0,0,0,0,0,0],
      [0,1,0,0,0,0,1,0],
      [0,0,1,0,0,1,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,1,1,1,1,0,0],
      [0,1,0,0,0,0,1,0],
      [0,0,0,0,0,0,0,0]
    ],
    
    // 6: Energetic/Excited
    '6': [
      [0,0,0,0,0,0,0,0],
      [0,1,1,0,0,1,1,0],
      [0,1,1,0,0,1,1,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,1,0,0,0,0,1,0],
      [0,0,1,1,1,1,0,0],
      [0,0,0,0,0,0,0,0]
    ],
  };
  
  // Animation frames
  const animations = {
    // 7: Talking animation
    '7': [
      // Frame 1
      [
        [0,0,0,0,0,0,0,0],
        [0,0,1,0,0,1,0,0],
        [0,0,1,0,0,1,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,1,1,1,1,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0]
      ],
      // Frame 2
      [
        [0,0,0,0,0,0,0,0],
        [0,0,1,0,0,1,0,0],
        [0,0,1,0,0,1,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,1,1,1,1,1,1,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0]
      ],
      // Frame 3
      [
        [0,0,0,0,0,0,0,0],
        [0,0,1,0,0,1,0,0],
        [0,0,1,0,0,1,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,1,0,0,1,0,0],
        [0,0,0,1,1,0,0,0],
        [0,0,0,0,0,0,0,0]
      ],
    ],
    
    // 8: Idle/resting with occasional blink
    '8': [
      // Normal
      [
        [0,0,0,0,0,0,0,0],
        [0,0,1,0,0,1,0,0],
        [0,0,1,0,0,1,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,1,1,1,1,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0]
      ],
      // Blinking
      [
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,1,1,1,1,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,1,1,1,1,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0]
      ]
    ]
  };

  useEffect(() => {
    let animationInterval;
    
    // Animate if state is 7 (talking) or 8 (idle)
    if (state === '7' || state === '8') {
      const frames = animations[state];
      animationInterval = setInterval(() => {
        setCurrentFrame(prev => {
          // For idle state, blink occasionally
          if (state === '8') {
            // 10% chance to blink each interval
            return Math.random() < 0.1 ? 1 : 0;
          }
          // For talking state, cycle through frames
          return (prev + 1) % frames.length;
        });
      }, state === '7' ? 150 : 2000); // Faster for talking, slower for idle
    }
    
    return () => {
      if (animationInterval) clearInterval(animationInterval);
    };
  }, [state]);

  // Determine which pattern to display
  const getPattern = () => {
    if (state === '7' || state === '8') {
      return animations[state][currentFrame];
    }
    return facePatterns[state] || facePatterns['2']; // Default to calm if state not found
  };

  // Create the pixel grid from the pattern
  const renderPixels = () => {
    const pattern = getPattern();
    return pattern.flatMap((row, rowIndex) => 
      row.map((pixel, colIndex) => (
        <div 
          key={`${rowIndex}-${colIndex}`}
          className={`pixel ${pixel ? 'active' : ''}`}
          style={{ backgroundColor: pixel ? color : 'transparent' }}
        />
      ))
    );
  };

  return (
    <div className="digital-face">
      <div className="pixel-grid">
        {renderPixels()}
      </div>
    </div>
  );
};

export default DigitalFace;