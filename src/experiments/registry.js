import { diceDbService } from './dice/diceDb';

// Registry of all available experiments
export const experiments = {};

// Helper to get experiment context for AI
export async function getExperimentContext(message) {
  // Always include the session roll in the context
  try {
    const context = await diceDbService.getExperimentContext();
    return context;
  } catch (error) {
    console.error('Error getting dice context:', error);
    return null;
  }
} 