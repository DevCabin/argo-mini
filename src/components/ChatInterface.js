'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/ChatInterface.module.scss';
import personalityConfig from '../data/personality.json';
import { ollamaService } from '../utils/ollama';

const ChatInterface = () => {
  const [modelLoaded, setModelLoaded] = useState(false);
  const [selectedPersonality, setSelectedPersonality] = useState(personalityConfig.personalities[0]);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  const messagesEndRef = useRef(null);
  const router = useRouter();

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

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await ollamaService.generateResponse(userMessage, selectedPersonality);
      console.log('Response received:', response);
      setMessages(prev => [...prev, { text: response, sender: 'ai' }]);
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
      {isOffline && (
        <div className={styles.offlineBanner}>
          Working offline - using local model
        </div>
      )}
      <div className={styles.personalitySelector}>
        <select
          value={selectedPersonality.id}
          onChange={(e) => {
            const personality = personalityConfig.personalities.find(
              p => p.id === e.target.value
            );
            setSelectedPersonality(personality);
          }}
          className={styles.personalitySelect}
        >
          {personalityConfig.personalities.map((personality) => (
            <option key={personality.id} value={personality.id}>
              {personality.name}
            </option>
          ))}
        </select>
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