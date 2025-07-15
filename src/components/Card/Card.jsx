import React from 'react';
import styles from './Card.module.scss';

const Card = ({ 
  participant, 
  isLocked = false, 
  isFlipped = false, 
  isCompleted = false,
  onClick = () => {} 
}) => {
  const cardClasses = [
    styles.card,
    isLocked && styles.locked,
    isFlipped && styles.flipped
  ].filter(Boolean).join(' ');

  const getCardNumber = (id) => {
    return 1000 + (id * 9973) % 9900;
  }
  
  return (
    <div 
      className={cardClasses} 
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
    >
      <div className={styles.cardInner}>
        <div className={styles.cardFront}>
          <div className={styles.cardHeader}>
            <span className={styles.cardNumber}>#{getCardNumber(participant.id)}</span>
            {isLocked && <span className={styles.lockIcon}>🔒</span>}
          </div>
          <div className={styles.cardContent}>
            <h3 className={styles.participantName}>{participant.name}</h3>
            <div className={styles.cardFooter}>
                {isCompleted ? <h3 className={styles.flipText}>Flip me over!</h3> : <h3 className={styles.flipText}>Challenges await!</h3>}
              <span className={styles.status}>
                {isLocked ? 'Locked' : 'Ready'}
              </span>
            </div>
          </div>
        </div>
        <div className={styles.cardBack}>
          <div className={styles.cardBackPattern}></div>
          <div className={styles.cardBackContent}>
            {isCompleted ? (
              <div className={styles.draftInfo}>
                <div className={styles.draftPickNumber}>#{participant.draftPick}</div>
                <div className={styles.draftPickLabel}>Draft Pick</div>
                <div className={styles.draftParticipantName}>{participant.name}</div>
              </div>
            ) : (
              <span className={styles.cardBackText}>Draft Card</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card; 