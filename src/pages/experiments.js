import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { experiments } from '../experiments/registry';
import { diceDbService } from '../experiments/dice/diceDb';
import styles from '../styles/Options.module.scss';

export default function Experiments() {
  const [activeExperiments, setActiveExperiments] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExperiments();
  }, []);

  const loadExperiments = async () => {
    const loaded = {};
    for (const [id, exp] of Object.entries(experiments)) {
      try {
        const ExperimentComponent = await exp.component();
        loaded[id] = ExperimentComponent;
      } catch (error) {
        console.error(`Error loading experiment ${id}:`, error);
      }
    }
    setActiveExperiments(loaded);
    setLoading(false);
  };

  const handleReroll = async () => {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    const roll = (array[0] % 6) + 1;
    await diceDbService.saveSessionRoll(roll);
    // Force a page reload to update the session roll display
    window.location.reload();
  };

  return (
    <>
      <Head>
        <title>Experiments - AI Chat</title>
        <meta name="description" content="Experimental features and tools" />
      </Head>

      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Experiments</h1>
          <div className={styles.headerControls}>
            <button onClick={handleReroll} className={styles.rerollButton}>
              Re-roll Session Dice
            </button>
            <Link href="/" className={styles.backLink}>
              Back to Chat
            </Link>
          </div>
        </header>

        {loading ? (
          <div className={styles.loading}>Loading experiments...</div>
        ) : (
          <div className={styles.experimentsContainer}>
            {Object.entries(activeExperiments).map(([id, Experiment]) => (
              <div key={id} className={styles.experimentWrapper}>
                <Experiment />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
} 