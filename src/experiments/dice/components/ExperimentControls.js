import styles from '../DiceExperiment.module.scss';

export function ExperimentControls({ onClearData }) {
  return (
    <div className={styles.controls}>
      <button 
        onClick={onClearData}
        className={styles.clearButton}
      >
        Clear All Data
      </button>
    </div>
  );
} 