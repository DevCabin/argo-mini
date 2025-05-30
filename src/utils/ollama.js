import axios from 'axios';
import personalityConfig from '../data/personality.json';

const OLLAMA_API = 'http://localhost:11434/api';

class OllamaService {
  constructor() {
    this.model = typeof window !== 'undefined' ? window.localStorage.getItem('loadedModel') : null;
  }

  async loadModel(modelId, onProgress) {
    try {
      const { data: models } = await axios.get(`${OLLAMA_API}/tags`);
      
      // Check if model already exists (with or without tag)
      const modelExists = models.models.some(m => {
        return m.name === modelId || m.name === `${modelId}:latest`;
      });

      if (!modelExists) {
        await axios.post(`${OLLAMA_API}/pull`, {
          name: modelId
        }, {
          onDownloadProgress: (progressEvent) => {
            if (onProgress && progressEvent.total) {
              const percentage = Math.round((progressEvent.loaded / progressEvent.total) * 100);
              onProgress(percentage);
            }
          }
        });
      }

      // Store the model ID as provided (preserving tags like :8b)
      this.model = modelId;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('loadedModel', this.model);
      }
      return true;
    } catch (error) {
      console.error('Error loading model:', error);
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Could not connect to Ollama. Please make sure Ollama is running.');
      }
      throw error;
    }
  }

  async generateResponse(message, personality, currentMood) {
    try {
      if (!this.model) {
        throw new Error('No model loaded');
      }

      // Get the mood prompt modifier
      const moodConfig = personalityConfig.moods[currentMood];
      const moodPrompt = moodConfig ? moodConfig.promptModifier : '';

      // Create the system prompt with mood
      const systemPrompt = personality.systemPrompt.replace('{moodPrompt}', moodPrompt);

      console.log('Debug - Mood Details:', {
        currentMood,
        moodConfig,
        moodPrompt,
        systemPrompt
      });

      const requestBody = {
        model: this.model,
        prompt: message,
        system: systemPrompt,
        options: {
          temperature: personality.temperature,
          num_predict: personality.maxTokens
        }
      };

      console.log('Debug - Ollama Request:', requestBody);

      const response = await axios.post(`${OLLAMA_API}/generate`, requestBody, {
        responseType: 'text'
      });

      // Split the response into lines and parse each JSON object
      const lines = response.data.split('\n').filter(line => line.trim());
      let fullResponse = '';
      
      for (const line of lines) {
        try {
          const data = JSON.parse(line);
          if (data.response) {
            fullResponse += data.response;
          }
        } catch (e) {
          console.error('Error parsing line:', e);
        }
      }

      console.log('Debug - Ollama Response:', fullResponse);

      return fullResponse;
    } catch (error) {
      console.error('Error generating response:', error);
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
}

let ollamaService;
if (typeof window !== 'undefined') {
  ollamaService = new OllamaService();
}

export { ollamaService }; 