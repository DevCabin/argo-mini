import axios from 'axios';

const OLLAMA_API = 'http://localhost:11434/api';

class OllamaService {
  constructor() {
    this.model = typeof window !== 'undefined' ? window.localStorage.getItem('loadedModel') : null;
  }

  async loadModel(modelId, onProgress) {
    try {
      const { data: models } = await axios.get(`${OLLAMA_API}/tags`);
      const modelExists = models.models.some(m => m.name === `${modelId}:latest`);

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
      throw error;
    }
  }

  async generateResponse(message, personality) {
    try {
      if (!this.model) {
        throw new Error('No model loaded');
      }

      const response = await axios.post(`${OLLAMA_API}/generate`, {
        model: this.model,
        prompt: message,
        system: personality.systemPrompt,
        options: {
          temperature: personality.temperature,
          num_predict: personality.maxTokens
        }
      }, {
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