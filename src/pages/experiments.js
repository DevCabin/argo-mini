import Head from 'next/head';
import Link from 'next/link';
import DiceRoller from '../components/DiceRoller';
import styles from '../styles/Options.module.scss';

export default function Experiments() {
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

        <DiceRoller />
      </div>
    </>
  );
} 