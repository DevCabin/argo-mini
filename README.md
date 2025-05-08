# AI Chat - Local LLM Assistant

A standalone AI chat application that runs locally in your browser, powered by Ollama. This application provides a modern, responsive interface for interacting with local language models, with support for multiple personalities and offline operation.

## Features

- 🤖 **Local Processing**: All AI processing happens locally through Ollama
- 🎭 **Multiple Personalities**: Choose from different AI personalities with unique characteristics
- 💾 **Offline Support**: Works without internet connection once model is loaded
- 🧠 **Context Awareness**: Maintains conversation context for more coherent responses
- 🎨 **Modern UI**: Clean, responsive dark theme interface
- 📱 **Mobile Friendly**: Works great on both desktop and mobile devices
- 📊 **Data Persistence**: Uses IndexedDB for storing chat history and experimental data
- 🧪 **Experiments**: Interactive features like dice rolling with statistics

## Prerequisites

- Node.js 18 or higher
- Ollama installed locally
- At least 8GB RAM recommended for model loading
- Modern browser with IndexedDB support

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-chat.git
   cd ai-chat
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Ollama:
   - macOS: `brew install ollama`
   - Linux: Follow instructions at [Ollama's website](https://ollama.ai)
   - Windows: Download from [Ollama's website](https://ollama.ai)

4. Start Ollama:
   ```bash
   ollama serve
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **First Launch**:
   - The application will automatically download the required model
   - You'll see a progress bar during the download
   - Once downloaded, the model will be cached locally

2. **Chat Interface**:
   - Select a personality from the dropdown menu
   - Type your message and press Enter or click Send
   - The AI will respond in real-time
   - Previous messages are maintained for context

3. **Offline Mode**:
   - Once the model is loaded, you can use the application offline
   - An "Offline" indicator will show when you're not connected to the internet
   - All processing continues to work locally

4. **Experiments**:
   - Access experimental features from the navigation menu
   - Try the interactive dice roller with real-time statistics
   - View distribution visualizations and history

## Data Storage

The application uses IndexedDB for persistent storage:

### Chat History
```javascript
{
  conversations: {
    id: auto-increment,
    timestamp: Date,
    modelId: string,
    personalityId: string,
    messages: [
      {
        role: 'user' | 'ai',
        content: string,
        timestamp: Date
      }
    ]
  }
}
```

### Experimental Data
```javascript
{
  diceRolls: {
    id: auto-increment,
    value: number,
    timestamp: Date
  }
}
```

## Configuration

### Personalities

Personalities can be configured in `src/data/personality.json`:

```json
{
  "personalities": [
    {
      "id": "assistant",
      "name": "AI Assistant",
      "systemPrompt": "You are a helpful, friendly AI assistant...",
      "temperature": 0.7,
      "maxTokens": 2000
    }
  ]
}
```

### Model Settings

Model settings can be adjusted in the same file:

```json
{
  "availableModels": [
    {
      "id": "llama2",
      "name": "Llama 2 (7B)",
      "description": "Default balanced model",
      "size": "3.8GB"
    }
  ]
}
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Ollama](https://ollama.ai) for the local LLM server
- [Next.js](https://nextjs.org) for the React framework
- [React](https://reactjs.org) for the UI library
- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) for client-side storage 