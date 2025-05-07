# Changelog

## [1.3.3] - 2024-03-07

### Stable Release
- Fixed streaming response handling from Ollama API
- Improved error handling and response parsing
- Cleaned up unused code and dependencies
- Fixed Next.js component issues
- Stable chat functionality with proper response display

### Improvements
- Simplified Ollama service implementation
- Removed unused WebAssembly configuration
- Streamlined personality configurations
- Fixed React component declarations
- Improved error messages and handling

## [1.0.0] - 2024-03-07

### Added
- Initial stable release
- Local LLM integration with Ollama
- Multiple personality support with configurable parameters
- Offline-first architecture
- Real-time chat interface with streaming responses
- Context memory (last 5 messages) for better conversation flow
- Model persistence across sessions
- Progress tracking for model downloads
- Error handling and user feedback
- Responsive dark theme UI
- Offline status indicator

### Features
- **Local Processing**: All AI processing happens locally through Ollama
- **Personality System**: Multiple AI personalities with different characteristics
- **Context Awareness**: Maintains conversation context for more coherent responses
- **Offline Support**: Works without internet connection once model is loaded
- **Model Management**: Automatic model loading and persistence
- **User Interface**: Modern, responsive dark theme with real-time updates

### Technical Details
- Built with Next.js 14
- Uses SCSS for styling
- Implements streaming responses
- Maintains conversation history
- Handles model state persistence
- Provides real-time feedback during model loading

### Dependencies
- Next.js
- React
- Axios
- SCSS
- Ollama (local LLM server)

### Requirements
- Node.js 18+
- Ollama installed locally
- At least 8GB RAM recommended for model loading 