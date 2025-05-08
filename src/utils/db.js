const DB_NAME = 'ArgoChatDB';
const DB_VERSION = 1;

class DatabaseService {
  constructor() {
    this.db = null;
    if (typeof window !== 'undefined') {
      this.initDatabase();
    }
  }

  initDatabase() {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        resolve(null);
        return;
      }

      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create chat history store
        if (!db.objectStoreNames.contains('conversations')) {
          const conversationStore = db.createObjectStore('conversations', { 
            keyPath: 'id',
            autoIncrement: true 
          });
          // Indexes for searching
          conversationStore.createIndex('timestamp', 'timestamp');
          conversationStore.createIndex('personalityId', 'personalityId');
          conversationStore.createIndex('modelId', 'modelId');
          conversationStore.createIndex('searchText', 'searchText', { unique: false });
        }

        // Create dice rolls store
        if (!db.objectStoreNames.contains('diceRolls')) {
          const diceStore = db.createObjectStore('diceRolls', {
            keyPath: 'id',
            autoIncrement: true
          });
          diceStore.createIndex('timestamp', 'timestamp');
          diceStore.createIndex('value', 'value');
        }
      };
    });
  }

  // Chat History Methods
  async saveConversation(conversation) {
    if (!this.db) {
      if (typeof window === 'undefined') return null;
      await this.initDatabase();
    }
    // Create searchable text from all messages
    const searchText = conversation.messages
      .map(msg => msg.content)
      .join(' ')
      .toLowerCase();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['conversations'], 'readwrite');
      const store = transaction.objectStore('conversations');
      const request = store.add({
        ...conversation,
        searchText,
        timestamp: new Date().toISOString()
      });

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async searchConversations(query, limit = 10) {
    const db = await this.initDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['conversations'], 'readonly');
      const store = transaction.objectStore('conversations');
      const request = store.getAll();

      request.onsuccess = () => {
        const results = request.result
          .filter(conv => conv.searchText.includes(query.toLowerCase()))
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .slice(0, limit);
        resolve(results);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getRecentConversations(limit = 10) {
    const db = await this.initDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['conversations'], 'readonly');
      const store = transaction.objectStore('conversations');
      const index = store.index('timestamp');
      const request = index.openCursor(null, 'prev');

      const conversations = [];
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor && conversations.length < limit) {
          conversations.push(cursor.value);
          cursor.continue();
        } else {
          resolve(conversations);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Dice Roll Methods
  async saveDiceRoll(value) {
    const db = await this.initDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['diceRolls'], 'readwrite');
      const store = transaction.objectStore('diceRolls');
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
      const transaction = db.transaction(['diceRolls'], 'readonly');
      const store = transaction.objectStore('diceRolls');
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
      const transaction = db.transaction(['diceRolls'], 'readonly');
      const store = transaction.objectStore('diceRolls');
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

  async clearExperimentalData() {
    const db = await this.initDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['diceRolls'], 'readwrite');
      const store = transaction.objectStore('diceRolls');
      const request = store.clear();

      request.onsuccess = () => {
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }
}

// Create a singleton instance
export const dbService = new DatabaseService(); 