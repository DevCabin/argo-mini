import axios from 'axios';
import personalityConfig from '../data/personality.json';

class OpenAIService {
  async generateResponse(message, personality, currentMood) {
    try {
      const requestData = {
        message,
        personality,
        currentMood
      };
      
      console.log('Sending to API:', requestData);
      
      const response = await axios.post('/api/chat', requestData);
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating response:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
      }
      throw error;
    }
  }
}

let openaiService;
if (typeof window !== 'undefined') {
  openaiService = new OpenAIService();
}

export { openaiService }; 