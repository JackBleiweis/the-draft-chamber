import React, { useState, useEffect } from 'react';
import CardGrid from '../CardGrid/CardGrid';
import PasswordModal from '../PasswordModal/PasswordModal';
import ChallengeModal from '../ChallengeModal/ChallengeModal';
import RayquazaCreature from '../RayquazaCreature/RayquazaCreature';
import { subscribeToParticipants, unlockParticipant, completeParticipant, lockParticipant } from '../../services/participantService';
import styles from './App.module.scss';

// Individual passwords are now stored in Firebase for each participant

const App = () => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [passwordModal, setPasswordModal] = useState({
    isOpen: false,
    cardId: null,
    cardName: ''
  });
  const [challengeModal, setChallengeModal] = useState({
    isOpen: false,
    cardId: null,
    cardName: '',
    draftPick: null
  });

  // Subscribe to Firebase real-time updates
  useEffect(() => {
    const unsubscribe = subscribeToParticipants((firebaseParticipants) => {
      // Add isFlipped state (UI-only, not synced)
      const participantsWithFlipped = firebaseParticipants.map(participant => ({
        ...participant,
        isFlipped: false // UI state only
      }));
      setParticipants(participantsWithFlipped);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleCardClick = (participant, index) => {
    console.log(`Card clicked:`, participant);
    
    if (participant.isLocked) {
      // Open password modal for locked cards
      setPasswordModal({
        isOpen: true,
        cardId: participant.id,
        cardName: participant.name
      });
    } else if (!participant.isCompleted) {
      // Open challenge modal for unlocked but incomplete cards
      setChallengeModal({
        isOpen: true,
        cardId: participant.id,
        cardName: participant.name,
        draftPick: participant.draftPick
      });
    } else {
      // Toggle flip state for completed cards
      setParticipants(prev => 
        prev.map(p => 
          p.id === participant.id 
            ? { ...p, isFlipped: !p.isFlipped }
            : p
        )
      );
    }
  };

  const handlePasswordSubmit = async (password) => {
    // Find the participant to check their individual password
    const participant = participants.find(p => p.id === passwordModal.cardId);
    
    if (!participant) {
      alert('Participant not found. Please try again.');
      return;
    }
    
    if (password === participant.password) {
      try {
        // Unlock the card in Firebase
        await unlockParticipant(passwordModal.cardId);
        
        // Close password modal and open challenge modal
        setPasswordModal({ isOpen: false, cardId: null, cardName: '' });
        setChallengeModal({
          isOpen: true,
          cardId: passwordModal.cardId,
          cardName: passwordModal.cardName,
          draftPick: participant.draftPick
        });
        
        console.log(`Card unlocked: ${passwordModal.cardName}`);
      } catch (error) {
        console.error('Error unlocking card:', error);
        alert('Error unlocking card. Please try again.');
      }
    } else {
      // Show error for incorrect password
      alert(`Incorrect password for ${participant.name}. Please try again.`);
    }
  };

  const handlePasswordModalClose = () => {
    setPasswordModal({ isOpen: false, cardId: null, cardName: '' });
  };

  const handleChallengeComplete = async () => {
    try {
      // Mark participant as completed in Firebase
      await completeParticipant(challengeModal.cardId);
      
      // Close challenge modal
      setChallengeModal({ isOpen: false, cardId: null, cardName: '', draftPick: null });
      
      console.log(`Challenges completed for: ${challengeModal.cardName}`);
    } catch (error) {
      console.error('Error completing challenges:', error);
      alert('Error completing challenges. Please try again.');
    }
  };

  const handleChallengeModalClose = async () => {
    try {
      // Check if the participant is still not completed (they gave up)
      const participant = participants.find(p => p.id === challengeModal.cardId);
      
      if (participant && !participant.isCompleted) {
        // Re-lock the card since they gave up on challenges
        await lockParticipant(challengeModal.cardId);
        console.log(`Card re-locked due to giving up: ${challengeModal.cardName}`);
      }
      
      // Close challenge modal
      setChallengeModal({ isOpen: false, cardId: null, cardName: '', draftPick: null });
    } catch (error) {
      console.error('Error handling challenge modal close:', error);
      // Still close the modal even if there's an error
      setChallengeModal({ isOpen: false, cardId: null, cardName: '', draftPick: null });
    }
  };

  const getFooterText = () => {
    const completedCount = participants.filter(p => p.isCompleted).length;
    
    if (completedCount === participants.length) {
      return "🎉 All participants have completed their challenges!";
    } else if (completedCount > 0) {
      return `${completedCount} completed • Click locked cards to enter password`;
    } else {
      return "Click locked cards to enter password and start challenges";
    }
  };

  if (loading) {
    return (
      <div className={styles.app}>
        <header className={styles.header}>
          <h1 className={styles.title}>The Draft Chamber</h1>
          <p className={styles.subtitle}>Loading participants...</p>
        </header>
        <main className={styles.main}>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div>🔥 Connecting to Firebase...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>The Draft Chamber</h1>
        <p className={styles.subtitle}>
          Unlock your card and complete challenges to reveal your draft position
        </p>
      </header>
      
      <main className={styles.main}>
        <CardGrid 
          participants={participants} 
          onCardClick={handleCardClick}
        />
      </main>
      <RayquazaCreature />
      <footer className={styles.footer}>
        <p className={styles.footerText}>
          {getFooterText()}
        </p>
      </footer>

      <PasswordModal
        isOpen={passwordModal.isOpen}
        onClose={handlePasswordModalClose}
        onSubmit={handlePasswordSubmit}
        cardName={passwordModal.cardName}
      />

      <ChallengeModal
        isOpen={challengeModal.isOpen}
        onClose={handleChallengeModalClose}
        onComplete={handleChallengeComplete}
        participantName={challengeModal.cardName}
        participantDraftPick={challengeModal.draftPick}
      />
    </div>
  );
};

export default App; 