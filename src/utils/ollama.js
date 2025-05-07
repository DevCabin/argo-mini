import axios from 'axios';

const OLLAMA_API = 'http://localhost:11434/api';

class OllamaService {
  constructor() {
    // Safe check for localStorage (client-side only)
    this.model = typeof window !== 'undefined' ? window.localStorage.getItem('loadedModel') : null;
    this.conversationHistory = [];
  }

  async loadModel(modelId, onProgress) {
    try {
      // Check if model exists
      const { data: models } = await axios.get(`${OLLAMA_API}/tags`);
      const modelExists = models.models.some(m => m.name === `${modelId}:latest`);

      if (!modelExists) {
        // Pull the model if it doesn't exist
        const response = await axios.post(`${OLLAMA_API}/pull`, {
          name: modelId,
          stream: true
        }, {
          onDownloadProgress: (progressEvent) => {
            if (onProgress) {
              const percentage = Math.round((progressEvent.loaded / progressEvent.total) * 100);
              onProgress(percentage);
            }
          }
        });
      }

      this.model = `${modelId}:latest`;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('loadedModel', this.model);
      }
      return true;
    } catch (error) {
      console.error('Error loading model:', error);
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Could not connect to Ollama. Please make sure Ollama is running.');
      }
      throw new Error(`Failed to load model: ${error.message}`);
    }
  }

  async generateResponse(message, personality, onProgress) {
    try {
      if (!this.model) {
        throw new Error('No model loaded. Please load a model first.');
      }

      // Get the last 5 messages for context
      const recentMessages = this.conversationHistory.slice(-5);
      const messages = [
        { role: 'system', content: personality.systemPrompt },
        ...recentMessages,
        { role: 'user', content: message }
      ];

      const response = await axios.post(`${OLLAMA_API}/chat`, {
        model: this.model,
        messages: messages,
        stream: true,
        options: {
          temperature: personality.temperature,
          num_predict: personality.maxTokens
        }
      });

      let fullResponse = '';
      const lines = response.data.split('\n').filter(Boolean);
      
      for (const line of lines) {
        try {
          const data = JSON.parse(line);
          if (data.message?.content) {
            fullResponse += data.message.content;
            if (onProgress) {
              onProgress(fullResponse);
            }
          }
        } catch (e) {
          console.error('Error parsing chunk:', e);
        }
      }

      // Add the new message and response to conversation history
      this.conversationHistory.push(
        { role: 'user', content: message },
        { role: 'assistant', content: fullResponse }
      );

      // Keep only the last 10 messages to prevent context window from growing too large
      if (this.conversationHistory.length > 10) {
        this.conversationHistory = this.conversationHistory.slice(-10);
      }

      return fullResponse;
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Could not connect to Ollama. Please make sure Ollama is running.');
      }
      throw error;
    }
  }

  async isModelLoaded() {
    try {
      if (!this.model) return false;
      
      const { data: models } = await axios.get(`${OLLAMA_API}/tags`);
      const isLoaded = models.models.some(m => m.name === this.model);
      
      if (!isLoaded) {
        // Clear stored model if it's not actually loaded
        this.model = null;
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem('loadedModel');
        }
      }
      
      return isLoaded;
    } catch (error) {
      console.error('Error checking model status:', error);
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Could not connect to Ollama. Please make sure Ollama is running.');
      }
      return false;
    }
  }

  async getModelInfo(modelId) {
    try {
      const { data: models } = await axios.get(`${OLLAMA_API}/tags`);
      const model = models.models.find(m => m.name === `${modelId}:latest`);
      return model ? {
        size: model.size,
        digest: model.digest,
        details: model.details
      } : null;
    } catch (error) {
      console.error('Error getting model info:', error);
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Could not connect to Ollama. Please make sure Ollama is running.');
      }
      return null;
    }
  }
}

// Create instance only on client side
let ollamaService;
if (typeof window !== 'undefined') {
  ollamaService = new OllamaService();
}

export { ollamaService }; 