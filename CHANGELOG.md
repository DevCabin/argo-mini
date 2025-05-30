# Changelog

## [2.2.0] - 2025-01-27

### Added
- **DeepSeek R1 Integration**: Full support for DeepSeek R1 8B reasoning model via Ollama
- Added DeepSeek R1 to available models in personality.json configuration
- Created dedicated DeepSeek integration module (src/lib/deepseek.js)
- Enhanced model selection dropdown with DeepSeek R1 option
- Support for tagged model versions (e.g., deepseek-r1:8b, llama3.2:3b)

### Improvements
- **Enhanced Model Management**: Fixed model loading to properly handle tagged versions
- Improved `loadModel` function to check for models with specific tags
- Updated `isModelLoaded` function for better model compatibility
- Enhanced error handling for model connection and loading
- Better model persistence and state management
- Improved Ollama service integration with tagged model support

### Technical Enhancements
- Fixed model ID handling in Ollama service for tagged models
- Enhanced model existence checking to support both tagged and latest versions
- Improved model loading progress tracking
- Better error messages for model-related issues
- Streamlined model selection and switching

### Features
- **Local AI Reasoning**: Complete offline processing with DeepSeek R1's advanced reasoning capabilities
- **Consciousness-Aware Prompts**: Enhanced personality system with mood-based consciousness simulation
- **Dual Model Support**: Seamless switching between local Ollama models and cloud options
- **Advanced Model Compatibility**: Support for various model formats and versions

### Bug Fixes
- Fixed model loading errors with tagged model versions
- Resolved model existence checking for non-latest tagged models
- Fixed model persistence issues across sessions
- Improved error handling for model connection failures

## [1.7.0] - 2024-03-07

### Added
- Enhanced dice rolling experiment with auto-roll feature
- Added cryptographic random number generation option
- Implemented batch processing for multiple rolls
- Added UI toggle between Math.random() and crypto.getRandomValues()
- Improved experiment statistics display

### Improvements
- Optimized IndexedDB operations for batch processing
- Enhanced UI responsiveness during auto-rolling
- Added visual feedback for RNG method selection
- Improved error handling in experiment components
- Updated documentation for experiment features

## [1.3.5] - 2024-03-07

### Added
- Implemented IndexedDB for persistent data storage
- Added experimental features section
- Added interactive dice roller with statistics
- Added conversation history storage capability

### Improvements
- Reduced personality options to two focused profiles
- Added experiments page with navigation
- Added distribution visualization for dice rolls
- Improved header navigation with multiple links
- Added persistent storage for chat history and experiments

## [1.3.4] - 2024-03-07

### Improvements
- Added localStorage-based personality settings
- Added options page for editing personality configurations
- Added Reset to Default functionality
- Removed API routes in favor of client-side storage
- Fixed styling consistency in options page header buttons
- Improved personality settings persistence across sessions

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