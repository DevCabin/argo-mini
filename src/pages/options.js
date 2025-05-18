import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Options.module.scss';
import personalityConfig from '../data/personality.json';

export default function Options() {
  const [personalities, setPersonalities] = useState([]);
  const [message, setMessage] = useState('');
  const [expandedCards, setExpandedCards] = useState({});

  // Load personalities from localStorage or default from JSON
  useEffect(() => {
    const savedPersonalities = localStorage.getItem('personalities');
    if (savedPersonalities) {
      const parsed = JSON.parse(savedPersonalities);
      setPersonalities(parsed);
      // Initialize expanded state for each personality
      const initialExpanded = {};
      parsed.forEach(p => {
        initialExpanded[p.id] = true;
      });
      setExpandedCards(initialExpanded);
    } else {
      setPersonalities(personalityConfig.personalities);
      // Initialize expanded state for default personalities
      const initialExpanded = {};
      personalityConfig.personalities.forEach(p => {
        initialExpanded[p.id] = true;
      });
      setExpandedCards(initialExpanded);
    }
  }, []);

  const toggleCard = (id) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleChange = (id, field, value) => {
    setPersonalities(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, [field]: value };
      }
      return p;
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('personalities', JSON.stringify(personalities));
      setMessage('Changes saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving changes. Please try again.');
      console.error('Error:', error);
    }
  };

  const handleReset = () => {
    localStorage.removeItem('personalities');
    setPersonalities(personalityConfig.personalities);
    setMessage('Reset to default settings!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <>
      <Head>
        <title>Settings - AI Chat</title>
        <meta name="description" content="Edit AI personality settings" />
      </Head>

      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Settings</h1>
          <div className={styles.headerButtons}>
            <button onClick={handleReset} className={styles.resetButton}>
              Reset to Default
            </button>
            <Link href="/" className={styles.backLink}>
              Back to Chat
            </Link>
          </div>
        </header>

        <div className={styles.section}>
          <h2>Personality Settings</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            {personalities.map((personality) => (
              <div key={personality.id} className={styles.personalityCard}>
                <button 
                  type="button"
                  className={styles.cardHeader} 
                  onClick={() => toggleCard(personality.id)}
                >
                  <h3>{personality.name}</h3>
                  <span className={`${styles.arrow} ${expandedCards[personality.id] ? styles.expanded : ''}`}>
                    ▼
                  </span>
                </button>
                {expandedCards[personality.id] && (
                  <div className={styles.cardContent}>
                    <div className={styles.field}>
                      <label htmlFor={`${personality.id}-description`}>Description:</label>
                      <input
                        id={`${personality.id}-description`}
                        type="text"
                        value={personality.description}
                        onChange={(e) => handleChange(personality.id, 'description', e.target.value)}
                      />
                    </div>
                    <div className={styles.field}>
                      <label htmlFor={`${personality.id}-prompt`}>System Prompt:</label>
                      <textarea
                        id={`${personality.id}-prompt`}
                        value={personality.systemPrompt}
                        onChange={(e) => handleChange(personality.id, 'systemPrompt', e.target.value)}
                        rows={4}
                      />
                    </div>
                    <div className={styles.fieldGroup}>
                      <div className={styles.field}>
                        <label htmlFor={`${personality.id}-temperature`}>Temperature:</label>
                        <input
                          id={`${personality.id}-temperature`}
                          type="number"
                          min="0"
                          max="2"
                          step="0.1"
                          value={personality.temperature}
                          onChange={(e) => handleChange(personality.id, 'temperature', parseFloat(e.target.value))}
                        />
                      </div>
                      <div className={styles.field}>
                        <label htmlFor={`${personality.id}-tokens`}>Max Tokens:</label>
                        <input
                          id={`${personality.id}-tokens`}
                          type="number"
                          min="100"
                          max="10000"
                          step="100"
                          value={personality.maxTokens}
                          onChange={(e) => handleChange(personality.id, 'maxTokens', parseInt(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div className={styles.saveContainer}>
              <button type="submit" className={styles.saveButton}>
                Save Changes
              </button>
              {message && (
                <div className={`${styles.message} ${message.includes('Error') ? styles.error : styles.success}`}>
                  {message}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
} 