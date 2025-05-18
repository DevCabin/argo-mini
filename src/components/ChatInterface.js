'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../styles/ChatInterface.module.scss';
import personalityConfig from '../data/personality.json';
import { ollamaService } from '../utils/ollama';
import { openaiService } from '../utils/openai';
import { dbService } from '../utils/db';
import { getExperimentContext } from '../experiments/registry';
import { diceDbService } from '../experiments/dice/diceDb';
import AIFace from './AIFace';

const ChatInterface = () => {
  const [modelLoaded, setModelLoaded] = useState(false);
  const [personalities, setPersonalities] = useState(personalityConfig.personalities);
  const [selectedPersonality, setSelectedPersonality] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  const [currentMood, setCurrentMood] = useState(null);
  const [showMoodIndicator, setShowMoodIndicator] = useState(false);
  const messagesEndRef = useRef(null);
  const router = useRouter();
  const [selectedModel, setSelectedModel] = useState(personalityConfig.defaultModel);
  const inputRef = useRef(null);

  // Load chat history on mount
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const recentConversations = await dbService.getRecentConversations(1);
        if (recentConversations.length > 0) {
          setMessages(recentConversations[0].messages);
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    };
    loadChatHistory();
  }, []);

  // Save chat history when messages change
  useEffect(() => {
    const saveChatHistory = async () => {
      if (messages.length > 0 && selectedPersonality) {
        try {
          await dbService.saveConversation({
            messages,
            personalityId: selectedPersonality.id,
            modelId: selectedModel
          });
        } catch (error) {
          console.error('Error saving chat history:', error);
        }
      }
    };
    saveChatHistory();
  }, [messages, selectedPersonality, selectedModel]);

  // Load personalities from localStorage
  useEffect(() => {
    const savedPersonalities = localStorage.getItem('personalities');
    if (savedPersonalities) {
      const parsed = JSON.parse(savedPersonalities);
      setPersonalities(parsed);
      setSelectedPersonality(parsed[0]); // Set first personality as default
    } else {
      setSelectedPersonality(personalityConfig.personalities[0]); // Set default if no saved data
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Check online status
    const handleOnlineStatus = () => {
      setIsOffline(!navigator.onLine);
    };
    
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    handleOnlineStatus(); // Check initial status

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  useEffect(() => {
    // Check if a model is already loaded
    const checkModel = async () => {
      try {
        setError(null);
        const isLoaded = await ollamaService.isModelLoaded();
        if (isLoaded) {
          setModelLoaded(true);
        } else {
          // Load the model if not already loaded
          setIsLoading(true);
          await ollamaService.loadModel('llama2', (progress) => {
            setLoadingProgress(progress);
          });
          setModelLoaded(true);
        }
      } catch (error) {
        console.error('Error checking model status:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    checkModel();
  }, []);

  // Add effect to handle mood indicator fade
  useEffect(() => {
    if (currentMood) {
      setShowMoodIndicator(true);
      const timer = setTimeout(() => {
        setShowMoodIndicator(false);
      }, 3000); // Show for 3 seconds
      return () => clearTimeout(timer);
    }
  }, [currentMood]);

  const handleClearChat = () => {
    setMessages([]);
    // Clear the current conversation from IndexedDB
    dbService.clearCurrentConversation();
  };

  const handleRollDice = async () => {
    try {
      // Generate a new random roll using crypto
      const array = new Uint32Array(1);
      crypto.getRandomValues(array);
      const roll = (array[0] % 6) + 1;
      
      // Save the new roll to both session and roll history
      await diceDbService.saveSessionRoll(roll);
      await diceDbService.saveDiceRoll(roll);
      
      // Update the current mood
      setCurrentMood(roll);
      
      // Force a re-render of the AIFace component
      const newMood = roll.toString();
      setCurrentMood(newMood);
      
      console.log('Debug - New Roll:', {
        roll,
        currentMood: newMood
      });
    } catch (error) {
      console.error('Error rolling dice:', error);
      setError('Failed to roll dice. Please try again.');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    const newMessages = [...messages, { text: userMessage, sender: 'user' }];
    setMessages(newMessages);
    setIsLoading(true);
    setError(null);

    try {
      // Check for experiment context
      let contextualPrompt = userMessage;
      const experimentContext = await getExperimentContext(userMessage);
      
      // Get the current session roll from the experiment context
      const sessionRoll = experimentContext?.currentSessionRoll || 1;
      setCurrentMood(sessionRoll);
      
      console.log('Debug - Mood State:', {
        sessionRoll,
        currentMood: sessionRoll,
        experimentContext
      });
      
      // Determine which service to use based on the selected model
      const modelConfig = personalityConfig.availableModels.find(m => m.id === selectedModel);
      let response;
      
      if (modelConfig.type === 'openai') {
        console.log('Debug - OpenAI Request:', {
          message: contextualPrompt,
          personality: selectedPersonality,
          currentMood: sessionRoll
        });
        // Use the selected personality directly since it's already the full object
        if (!selectedPersonality) {
          throw new Error('No personality selected');
        }
        response = await openaiService.generateResponse(contextualPrompt, selectedPersonality, sessionRoll);
      } else {
        console.log('Debug - Ollama Request:', {
          message: contextualPrompt,
          personality: selectedPersonality,
          currentMood: sessionRoll
        });
        response = await ollamaService.generateResponse(contextualPrompt, selectedPersonality, sessionRoll);
      }

      const updatedMessages = [...newMessages, { text: response, sender: 'ai' }];
      setMessages(updatedMessages);
    } catch (error) {
      console.error('Error generating response:', error);
      setError(error.message);
      setMessages(prev => [...prev, { 
        text: "Sorry, I encountered an error. Please try again.", 
        sender: 'ai',
        error: true 
      }]);
    } finally {
      setIsLoading(false);
      // Focus the input after response
      inputRef.current?.focus();
    }
  };

  if (!modelLoaded) {
    return (
      <div className={styles.loadingScreen}>
        <h1>Welcome to AI Chat</h1>
        <div className={styles.loadingContainer}>
          {error ? (
            <div className={styles.errorMessage}>
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className={styles.retryButton}
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill}
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
              <p>Loading AI model... {loadingProgress}%</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chatContainer}>
      <div className={styles.faceSection}>
        <AIFace 
          initialMood={currentMood || '1'} 
          isTalking={isLoading}
          isProcessing={isLoading}
          key={currentMood}
        />
      </div>
      {isOffline && (
        <div className={styles.offlineBanner}>
          Working offline - using local model
        </div>
      )}
      <div className={styles.controlsContainer}>
        <div className={styles.controlsRow}>
          <select
            value={selectedPersonality?.id}
            onChange={(e) => {
              const personality = personalities.find(
                p => p.id === e.target.value
              );
              setSelectedPersonality(personality);
            }}
            className={styles.controlSelect}
          >
            {personalities.map((personality) => (
              <option key={personality.id} value={personality.id}>
                {personality.name}
              </option>
            ))}
          </select>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className={styles.controlSelect}
          >
            {personalityConfig.availableModels.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.controlsRow}>
          <button 
            onClick={handleClearChat}
            className={styles.controlButton}
          >
            Clear Chat
          </button>
          <button 
            onClick={handleRollDice}
            className={styles.rollButton}
          >
            Roll Dice
          </button>
          <Link href="/options" className={styles.controlLink}>
            Settings
          </Link>
          <Link href="/experiments" className={styles.controlLink}>
            Stats
          </Link>
        </div>
        {currentMood && showMoodIndicator && (
          <div className={styles.moodIndicator}>
            Current Mood: {personalityConfig.moods[currentMood].name}
          </div>
        )}
      </div>

      <div className={styles.messagesContainer}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`${styles.message} ${
              message.sender === 'user' ? styles.userMessage : styles.aiMessage
            } ${message.error ? styles.errorMessage : ''}`}
          >
            <div className={styles.messageContent}>{message.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className={styles.inputContainer}>
        <input
          ref={inputRef}
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
          className={styles.messageInput}
        />
        <button
          type="submit"
          disabled={isLoading || !inputMessage.trim()}
          className={styles.sendButton}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatInterface; 