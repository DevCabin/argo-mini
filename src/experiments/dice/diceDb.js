import { EXPERIMENT_ID } from './constants';

class DiceExperimentDb {
  constructor() {
    this.dbName = 'ExperimentsDB';
    this.storeName = `experiment_${EXPERIMENT_ID}`;
    this.version = 1;
    this.db = null;
  }

  async initDatabase() {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, {
            keyPath: 'id',
            autoIncrement: true
          });
          store.createIndex('timestamp', 'timestamp');
          store.createIndex('value', 'value');
        }
      };
    });
  }

  async saveDiceRoll(value) {
    const db = await this.initDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const roll = {
        value,
        timestamp: new Date().toISOString()
      };
      const request = store.add(roll);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getRecentDiceRolls(limit = 10) {
    const db = await this.initDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const index = store.index('timestamp');
      const request = index.openCursor(null, 'prev');

      const rolls = [];
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor && rolls.length < limit) {
          rolls.push(cursor.value);
          cursor.continue();
        } else {
          resolve(rolls);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getDiceRollStats() {
    const db = await this.initDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        const rolls = request.result;
        const stats = {
          total: rolls.length,
          distribution: Array(6).fill(0),
          lastRoll: rolls[rolls.length - 1]?.value || null
        };
        
        rolls.forEach(roll => {
          stats.distribution[roll.value - 1]++;
        });

        resolve(stats);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async clearData() {
    const db = await this.initDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Helper method to get experiment data for AI context
  async getExperimentContext() {
    const stats = await this.getDiceRollStats();
    if (stats.total === 0) {
      return "No dice rolls have been recorded yet.";
    }

    // Find the highest count and sort by frequency
    const distributionWithNumbers = stats.distribution
      .map((count, i) => ({ number: i + 1, count }))
      .sort((a, b) => b.count - a.count); // Sort by count descending

    const maxCount = distributionWithNumbers[0].count;
    const winningNumbers = distributionWithNumbers.filter(item => item.count === maxCount);

    return `Here is the current dice roll experiment data (higher numbers of rolls means more frequent):
- Total rolls: ${stats.total}
- Distribution of rolls (sorted by frequency, highest to lowest):
${distributionWithNumbers.map(({number, count}) => 
  `  Number ${number}: ${count} times (${((count / stats.total) * 100).toFixed(1)}%)`
).join('\n')}
- Most frequent roll(s): ${winningNumbers.map(w => `Number ${w.number} (${w.count} times)`).join(', ')}`;
  }
}

export const diceDbService = new DiceExperimentDb(); 