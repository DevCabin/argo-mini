import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { experiments } from '../experiments/registry';
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

  return (
    <>
      <Head>
        <title>Experiments - AI Chat</title>
        <meta name="description" content="Experimental features and tools" />
      </Head>

      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Experiments</h1>
          <Link href="/" className={styles.backLink}>
            Back to Chat
          </Link>
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