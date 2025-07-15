import React from 'react';
import styles from './ChallengeSelection.module.scss';

const challengeDescriptions = {
  'click-frenzy': {
    icon: '⚡',
    description: 'Click the button 34 times in 5 seconds',
    difficulty: 'Medium'
  },
  'reaction-time': {
    icon: '⏱️',
    description: 'Click when the card lights up (don\'t click too early!)',
    difficulty: 'Easy'
  },
  'memory-match': {
    icon: '🧠',
    description: 'Match 3 pairs of cards with only 3 strikes',
    difficulty: 'Hard'
  },
  'hold-to-cast': {
    icon: '🎯',
    description: 'Hold the button for 45 seconds to cast your draft position',
    difficulty: 'Final'
  }
};

const ChallengeSelection = ({ 
  availableChallenges = [], 
  completedChallenges = [], 
  requiredChallenges = 3,
  onChallengeSelect = () => {},
  participantName = '',
  showHoldToCast = false
}) => {
  const remainingChallenges = requiredChallenges - completedChallenges.length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.welcomeText}>Welcome, {participantName}!</h3>
        {!showHoldToCast ? (
          <p className={styles.instructionText}>
            Complete {remainingChallenges} more challenge{remainingChallenges !== 1 ? 's' : ''} to proceed to the final stage.
          </p>
        ) : (
          <p className={styles.instructionText}>
            🎉 All challenges completed! You can now attempt the final challenge or retry any previous challenges.
          </p>
        )}
      </div>

      <div className={styles.challengeGrid}>
        {availableChallenges.map((challenge) => {
          const info = challengeDescriptions[challenge.id];
          const isHoldToCast = challenge.id === 'hold-to-cast';
          
          return (
            <div 
              key={challenge.id} 
              className={`${styles.challengeCard} ${isHoldToCast ? styles.finalChallenge : ''}`}
              onClick={() => onChallengeSelect(challenge.id)}
            >
              <div className={styles.challengeIcon}>
                {info.icon}
              </div>
              <h4 className={styles.challengeName}>
                {challenge.name}
              </h4>
              <p className={styles.challengeDescription}>
                {info.description}
              </p>
              <div className={styles.challengeFooter}>
                <span className={`${styles.difficulty} ${styles[info.difficulty.toLowerCase()]}`}>
                  {info.difficulty}
                </span>
                <span className={`${styles.selectButton} ${isHoldToCast ? styles.finalButton : ''}`}>
                  {isHoldToCast ? 'Cast Now' : 'Select'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {completedChallenges.length > 0 && (
        <div className={styles.completedSection}>
          <h4 className={styles.completedTitle}>✅ Completed Challenges</h4>
          <div className={styles.completedList}>
            {completedChallenges.map((challengeId) => {
              const challenge = { id: challengeId, name: challengeId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') };
              const info = challengeDescriptions[challengeId];
              return (
                <div key={challengeId} className={styles.completedChallenge}>
                  <span className={styles.completedIcon}>{info.icon}</span>
                  <span className={styles.completedName}>{challenge.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {availableChallenges.length === 0 && !showHoldToCast && (
        <div className={styles.noMoreChallenges}>
          <div className={styles.readyIcon}>🚀</div>
          <h4>All challenges completed!</h4>
          <p>Get ready for the final challenge...</p>
        </div>
      )}
    </div>
  );
};

export default ChallengeSelection; 