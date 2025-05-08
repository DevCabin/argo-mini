import styles from '../DiceExperiment.module.scss';

export function DiceStats({ stats, recentRolls }) {
  return (
    <>
      <div className={styles.statsSection}>
        <h3>Statistics</h3>
        <div className={styles.distribution}>
          {stats.distribution.map((count, index) => (
            <div key={index} className={styles.distributionBar}>
              <span className={styles.number}>{index + 1}</span>
              <div 
                className={styles.bar}
                style={{ 
                  '--progress-width': stats.total ? `${(count / stats.total) * 100}%` : '0%'
                }}
              />
              <span className={styles.count}>{count}</span>
            </div>
          ))}
        </div>
        <div className={styles.total}>
          Total rolls: {stats.total}
        </div>
      </div>

      <div className={styles.historySection}>
        <h3>Recent Rolls</h3>
        <div className={styles.rolls}>
          {recentRolls.map((roll) => (
            <div key={roll.id} className={styles.roll}>
              <span className={styles.value}>{roll.value}</span>
              <span className={styles.time}>
                {new Date(roll.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
} 