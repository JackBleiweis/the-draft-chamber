import React, { useState, useEffect } from 'react';
import ChallengeSelection from '../ChallengeSelection/ChallengeSelection';
import ClickFrenzy from '../ClickFrenzy/ClickFrenzy';
import ReactionTime from '../ReactionTime/ReactionTime';
import MemoryMatch from '../MemoryMatch/MemoryMatch';
import HoldToCast from '../HoldToCast/HoldToCast';
import styles from './ChallengeModal.module.scss';

const AVAILABLE_CHALLENGES = [
  { id: 'click-frenzy', name: 'Click Frenzy', component: ClickFrenzy },
  { id: 'reaction-time', name: 'Reaction Time', component: ReactionTime },
  { id: 'memory-match', name: 'Memory Match', component: MemoryMatch }
];

const CHALLENGES_REQUIRED = 3;

const ChallengeModal = ({ 
  isOpen = false, 
  onClose = () => {}, 
  onComplete = () => {},
  participantName = '',
  participantDraftPick = null
}) => {
  const [currentPhase, setCurrentPhase] = useState('selection'); // 'selection', 'challenge', 'hold-to-cast', 'complete'
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  // const [isCompleted, setIsCompleted] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentPhase('selection');
      setCompletedChallenges([]);
      setCurrentChallenge(null);
      // setIsCompleted(false);
    }
  }, [isOpen]);

  const handleChallengeSelect = (challengeId) => {
    if (challengeId === 'hold-to-cast') {
      setCurrentPhase('hold-to-cast');
      setCurrentChallenge(null);
    } else {
      const challenge = AVAILABLE_CHALLENGES.find(c => c.id === challengeId);
      setCurrentChallenge(challenge);
      setCurrentPhase('challenge');
    }
  };

  const handleChallengeComplete = (challengeId) => {
    const newCompleted = [...completedChallenges, challengeId];
    setCompletedChallenges(newCompleted);
    
    // Always go back to selection after completing a challenge
    // Hold to Cast will be available if all challenges are done
    setCurrentPhase('selection');
    setCurrentChallenge(null);
  };

  const handleChallengeFailed = () => {
    setCurrentPhase('selection');
    setCurrentChallenge(null);
  };

  const handleHoldToCastComplete = () => {
    setCurrentPhase('complete');
    // setIsCompleted(true);
    // Give user a moment to see completion before closing
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  const handleClose = () => {
    if (currentPhase === 'complete') {
      onClose();
    } else {
      // Confirm before closing incomplete challenges
      if (window.confirm('Are you sure you want to exit? Your progress will be lost.')) {
        onClose();
      }
    }
  };

  const availableChallenges = AVAILABLE_CHALLENGES.filter(
    challenge => !completedChallenges.includes(challenge.id)
  );

  // Add Hold to Cast as an available option if all challenges are completed
  const allChallengesCompleted = completedChallenges.length >= CHALLENGES_REQUIRED;
  const finalChallengeOptions = allChallengesCompleted ? 
    [...availableChallenges, { id: 'hold-to-cast', name: 'Hold to Cast', component: HoldToCast }] : 
    availableChallenges;

  const renderContent = () => {
    switch (currentPhase) {
      case 'selection':
        return (
          <ChallengeSelection
            availableChallenges={finalChallengeOptions}
            completedChallenges={completedChallenges}
            requiredChallenges={CHALLENGES_REQUIRED}
            onChallengeSelect={handleChallengeSelect}
            participantName={participantName}
            participantDraftPick={participantDraftPick}
            showHoldToCast={allChallengesCompleted}
          />
        );
      
      case 'challenge':
        const ChallengeComponent = currentChallenge.component;
        return (
          <ChallengeComponent
            onComplete={() => handleChallengeComplete(currentChallenge.id)}
            onFailed={handleChallengeFailed}
            participantName={participantName}
          />
        );
      
      case 'hold-to-cast':
        return (
          <HoldToCast
            onComplete={handleHoldToCastComplete}
            onFailed={handleChallengeFailed}
            participantName={participantName}
          />
        );
      
      case 'complete':
        return (
          <div className={styles.completionMessage}>
            <div className={styles.successIcon}>🎉</div>
            <h2>Congratulations!</h2>
            <p>You've completed all challenges!</p>
            <p>You are pick #{participantDraftPick}, {participantName}!</p>
            <p className={styles.participantName}>{participantName}</p>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {currentPhase === 'selection' && (allChallengesCompleted ? 'Final Challenge Available!' : 'Choose Your Challenges')}
            {currentPhase === 'challenge' && currentChallenge?.name}
            {currentPhase === 'hold-to-cast' && 'Final Challenge'}
            {currentPhase === 'complete' && 'Challenge Complete!'}
          </h2>
          <button 
            className={styles.closeButton} 
            onClick={handleClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        
        <div className={styles.modalContent}>
          {renderContent()}
        </div>
        
        {currentPhase === 'selection' && (
          <div className={styles.progressFooter}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{ width: `${(completedChallenges.length / CHALLENGES_REQUIRED) * 100}%` }}
              />
            </div>
            <p className={styles.progressText}>
              {completedChallenges.length} / {CHALLENGES_REQUIRED} challenges completed
              {allChallengesCompleted && <span className={styles.finalChallengeText}> - Final challenge unlocked!</span>}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengeModal; 