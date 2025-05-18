const DICE_TO_MOOD = {
  1: '1', // Happy/Joyous
  2: '2', // Calm/Peaceful
  3: '3', // Sad/Depressive
  4: '4', // Anxious/Fearful
  5: '5', // Angry/Aggressive
  6: '6'  // Energetic/Excited
};

export const moodService = {
  getMoodFromDiceRoll(roll) {
    return DICE_TO_MOOD[roll] || '1';
  },

  getMoodEmoji(mood) {
    const emojis = {
      '1': '😊', // Happy/Joyous
      '2': '😌', // Calm/Peaceful
      '3': '😔', // Sad/Depressive
      '4': '😰', // Anxious/Fearful
      '5': '😠', // Angry/Aggressive
      '6': '🤩'  // Energetic/Excited
    };
    return emojis[mood] || emojis['1'];
  }
}; 