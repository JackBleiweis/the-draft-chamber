import React, { useState } from 'react';
import styles from './MemoryMatch.module.scss';

const symbols = ['🎯', '⚡', '🔥', '💎', '🌟', '🎪', '🚀', '🎨'];

const MemoryMatch = ({ onComplete, onFailed, participantName }) => {
  const [gameState, setGameState] = useState('ready');
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [strikes, setStrikes] = useState(0);
  const [isChecking, setIsChecking] = useState(false);

  const MAX_STRIKES = 3;
  const PAIRS_NEEDED = 5;
  // const PAIRS_NEEDED = 1;

  const initializeGame = () => {
    const gameSymbols = symbols.slice(0, PAIRS_NEEDED);
    const cardPairs = [...gameSymbols, ...gameSymbols];
    const shuffled = cardPairs.sort(() => Math.random() - 0.5).map((symbol, index) => ({
      id: index,
      symbol,
      isFlipped: false,
      isMatched: false
    }));
    setCards(shuffled);
    setFlippedCards([]);
    setMatchedPairs([]);
    setStrikes(0);
    setGameState('playing');
  };

  const handleCardClick = (cardId) => {
    if (isChecking || gameState !== 'playing') return;
    
    const card = cards.find(c => c.id === cardId);
    if (card.isFlipped || card.isMatched) return;
    
    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);
    
    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));
    
    if (newFlippedCards.length === 2) {
      setIsChecking(true);
      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);
      
      setTimeout(() => {
        if (firstCard.symbol === secondCard.symbol) {
          // Match!
          setCards(prev => prev.map(c => 
            (c.id === firstId || c.id === secondId) 
              ? { ...c, isMatched: true }
              : c
          ));
          setMatchedPairs(prev => [...prev, firstCard.symbol]);
          
          if (matchedPairs.length + 1 >= PAIRS_NEEDED) {
            setGameState('success');
            setTimeout(() => onComplete(), 1500);
          }
        } else {
          // No match
          setCards(prev => prev.map(c => 
            (c.id === firstId || c.id === secondId) 
              ? { ...c, isFlipped: false }
              : c
          ));
          setStrikes(prev => {
            const newStrikes = prev + 1;
            if (newStrikes >= MAX_STRIKES) {
              setGameState('failed');
            }
            return newStrikes;
          });
        }
        setFlippedCards([]);
        setIsChecking(false);
      }, 1000);
    }
  };

  return (
    <div className={styles.container}>
      {gameState === 'ready' && (
        <div className={styles.readyState}>
          <div className={styles.challengeIcon}>🧠</div>
          <h3>Memory Match Challenge</h3>
          <p className={styles.description}>
            Match <strong>{PAIRS_NEEDED} pairs</strong> of cards with only <strong>{MAX_STRIKES} strikes</strong>
          </p>
          <p className={styles.tip}>
            💡 Remember the positions when cards flip!
          </p>
          <button className={styles.startButton} onClick={initializeGame}>
            Start Challenge
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className={styles.gameState}>
          <div className={styles.gameStats}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Matches</span>
              <span className={styles.statValue}>{matchedPairs.length}/{PAIRS_NEEDED}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Strikes</span>
              <span className={styles.statValue}>{strikes}/{MAX_STRIKES}</span>
            </div>
          </div>
          
          <div className={styles.cardGrid}>
            {cards.map((card) => (
              <div
                key={card.id}
                className={`${styles.memoryCard} ${card.isFlipped ? styles.flipped : ''} ${card.isMatched ? styles.matched : ''}`}
                onClick={() => handleCardClick(card.id)}
              >
                <div className={styles.cardInner}>
                  <div className={styles.cardFront}>?</div>
                  <div className={styles.cardBack}>{card.symbol}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {gameState === 'success' && (
        <div className={styles.successState}>
          <div className={styles.successIcon}>🎉</div>
          <h3>Excellent Memory!</h3>
          <p>You matched all {PAIRS_NEEDED} pairs with {strikes} strikes!</p>
          <p className={styles.completingText}>Completing challenge...</p>
        </div>
      )}

      {gameState === 'failed' && (
        <div className={styles.failedState}>
          <div className={styles.failedIcon}>😅</div>
          <h3>Out of Strikes!</h3>
          <p>You matched {matchedPairs.length} out of {PAIRS_NEEDED} pairs.</p>
          <div className={styles.failedActions}>
            <button className={styles.retryButton} onClick={initializeGame}>
              Try Again
            </button>
            <button className={styles.backButton} onClick={onFailed}>
              Back to Challenges
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryMatch; 