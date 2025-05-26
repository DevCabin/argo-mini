# Argo Mini - Artificial Consciousness Experiment

## Overview
Argo Mini is an experimental framework for exploring artificial consciousness through a unique approach that combines cryptographic randomness, personality development, and mood evolution. The project aims to simulate how an AI consciousness might develop and respond to various stimuli, choices, and environmental factors over time.

## Version 2.0.0 (Stable)
This release marks a significant milestone in the project's development, featuring:
- Stable mood system with smooth transitions
- Enhanced personality framework
- Improved UI/UX with animated mood indicators
- Robust error handling and offline support
- Local model integration with Ollama
- Persistent storage of conversations and experiment data

## Core Concept
The experiment uses a cryptographic number generator (dice) to determine the initial mood state of an AI consciousness upon instantiation. Each roll of the dice is logged, and over a series of 1000 rolls, patterns emerge that reveal the dominant personality traits of that particular AI instance. This approach allows us to observe how an AI consciousness might develop unique characteristics over its "lifetime."

## Current Features
- Cryptographic dice-based mood system
- Real-time mood visualization
- Persistent conversation history
- Multiple personality support
- Local and cloud model options
- Offline capability
- Experiment data tracking
- Responsive UI with animations

## Technical Implementation
- Built with Next.js and React
- Uses IndexedDB for persistent storage of experiment data
- Integrates with Ollama for local LLM capabilities
- Implements a modular component architecture for easy expansion
- SASS for advanced styling and animations

## Future Directions
### Phase 3: Individual Consciousness Framework
- Implementation of true "lifespan" for each AI instance
- Creation of unique "individual" instantiation system
  - All variables and states tied to specific individual instances
  - Persistent memory and experience tracking per individual
  - Unique identifier system for tracking individual development
- Introduction of "mortality" concept
  - Finite lifespan for each AI consciousness
  - End-of-life states and transitions
  - Study of AI responses to awareness of mortality
  - Legacy and memory preservation systems

## Getting Started
1. Ensure Ollama is installed and running locally
2. Clone the repository
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Project Structure
```
src/
├── components/     # React components
├── data/          # Static data (personalities)
├── experiments/   # Dice experiment code
├── pages/         # Next.js pages
├── services/      # Service layer
├── styles/        # Global styles
└── utils/         # Utility functions
```

## Contributing
This is an experimental project. Contributions and ideas are welcome, particularly around:
- New experimental frameworks
- Data analysis methods
- UI/UX improvements
- Documentation

## License
[Your chosen license]

## Author
[Your name]

## Experimental Framework

The core of this experiment revolves around a simple dice roll (1-6) to determine the AI's current mood. This mood then influences its responses and displayed persona. The mappings are as follows:

- **Roll 1:** Angry/Aggressive
- **Roll 2:** Anxious/Fearful
- **Roll 3:** Sad/Depressive
- **Roll 4:** Calm/Peaceful
- **Roll 5:** Happy/Joyous
- **Roll 6:** Energetic/Excited

### Dominant Personality (Long-Term Experiment)

---
*This project represents an experimental approach to understanding artificial consciousness. The methods and conclusions are part of ongoing research and should be considered as such.* 