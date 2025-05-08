import { EXPERIMENT_ID as DICE_EXPERIMENT } from './dice/constants';
import { diceDbService } from './dice/diceDb';

// Registry of all available experiments
export const experiments = {
  [DICE_EXPERIMENT]: {
    id: DICE_EXPERIMENT,
    name: 'Dice Roller',
    component: () => import('./dice/DiceExperiment').then(mod => mod.DiceExperiment),
    dbService: diceDbService,
    keywords: ['dice', 'roll', 'number', 'experiment'],
  }
};

// Helper to get experiment context for AI
export async function getExperimentContext(message) {
  const lowerMessage = message.toLowerCase();
  
  // Check each experiment's keywords
  for (const exp of Object.values(experiments)) {
    if (exp.keywords.some(keyword => lowerMessage.includes(keyword))) {
      try {
        // Get context from the experiment's DB service
        const context = await exp.dbService.getExperimentContext();
        return context;
      } catch (error) {
        console.error(`Error getting context for experiment ${exp.id}:`, error);
      }
    }
  }
  
  return null;
} 