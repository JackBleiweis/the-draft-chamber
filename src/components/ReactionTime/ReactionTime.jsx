import React, { useState, useEffect, useRef } from 'react';
import styles from './ReactionTime.module.scss';

const ReactionTime = ({ onComplete, onFailed, participantName }) => {
  const [gameState, setGameState] = useState('ready'); // 'ready', 'waiting', 'active', 'success', 'failed', 'penalty'
  const [reactionTime, setReactionTime] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [bestTime, setBestTime] = useState(null);
  const [message, setMessage] = useState('');
  const [penaltyTimeLeft, setPenaltyTimeLeft] = useState(0);
  const startTimeRef = useRef(null);
  const timeoutRef = useRef(null);
  const penaltyIntervalRef = useRef(null);

  const MAX_ATTEMPTS = 3;
  // const SUCCESS_THRESHOLD = 1350; // milliseconds
  const SUCCESS_THRESHOLD = 250; // milliseconds
  const PENALTY_DURATION = 15; // seconds

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (penaltyIntervalRef.current) {
        clearInterval(penaltyIntervalRef.current);
      }
    };
  }, []);

  const startGame = () => {
    setGameState('waiting');
    setMessage('Wait for the card to light up...');
    
    // Random delay between 1-5 seconds
    const delay = Math.random() * 4000 + 1000;
    
    timeoutRef.current = setTimeout(() => {
      setGameState('active');
      setMessage('CLICK NOW!');
      startTimeRef.current = Date.now();
    }, delay);
  };

  const handleClick = () => {
    if (gameState === 'waiting') {
      // Clicked too early
      setGameState('failed');
      setMessage('Too early! You clicked before the card lit up.');
      clearTimeout(timeoutRef.current);
      setAttempts(prev => prev + 1);
    } else if (gameState === 'active') {
      // Calculate reaction time
      const endTime = Date.now();
      const reaction = endTime - startTimeRef.current;
      setReactionTime(reaction);
      
      if (reaction <= SUCCESS_THRESHOLD) {
        setGameState('success');
        setMessage(`Great reaction! ${reaction}ms`);
        if (!bestTime || reaction < bestTime) {
          setBestTime(reaction);
        }
        setTimeout(() => onComplete(), 2000);
      } else {
        setGameState('failed');
        setMessage(`Too slow! ${reaction}ms (need under ${SUCCESS_THRESHOLD}ms)`);
        setAttempts(prev => prev + 1);
      }
    }
  };

  const startPenalty = () => {
    setGameState('penalty');
    setPenaltyTimeLeft(PENALTY_DURATION);
    
    penaltyIntervalRef.current = setInterval(() => {
      setPenaltyTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(penaltyIntervalRef.current);
          // Reset attempts and go back to ready state
          setAttempts(0);
          setGameState('ready');
          setMessage('');
          setReactionTime(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resetGame = () => {
    setGameState('ready');
    setMessage('');
    setReactionTime(null);
    clearTimeout(timeoutRef.current);
  };

  const getCardClass = () => {
    switch (gameState) {
      case 'waiting':
        return styles.waiting;
      case 'active':
        return styles.active;
      case 'success':
        return styles.success;
      case 'failed':
        return styles.failed;
      default:
        return '';
    }
      };

  return (
    <div className={styles.container}>
      {gameState === 'ready' && (
        <div className={styles.readyState}>
          <div className={styles.challengeIcon}>⏱️</div>
          <h3>Reaction Time Challenge</h3>
          <p className={styles.description}>
            Click the card as fast as possible when it lights up!
          </p>
          <div className={styles.rules}>
            <p>• Wait for the card to turn green</p>
            <p>• Click as fast as you can</p>
            <p>• Don't click too early or you'll fail</p>
            <p>• You need to react in under {SUCCESS_THRESHOLD}ms</p>
          </div>
          <p className={styles.attemptsLeft}>
            Attempts remaining: {MAX_ATTEMPTS - attempts}
          </p>
          <button className={styles.startButton} onClick={startGame}>
            Start Challenge
          </button>
        </div>
      )}

      {(gameState === 'waiting' || gameState === 'active') && (
        <div className={styles.gameState}>
          <div className={styles.instructions}>
            <p className={styles.message}>{message}</p>
            <p className={styles.attemptsInfo}>
              Attempt {attempts + 1} of {MAX_ATTEMPTS}
            </p>
          </div>
          
          <div 
            className={`${styles.reactionCard} ${getCardClass()}`}
            onClick={handleClick}
          >
            <div className={styles.cardContent}>
              {gameState === 'waiting' && (
                <>
                  <div className={styles.waitingIcon}>⏳</div>
                  <span>Wait...</span>
                </>
              )}
              {gameState === 'active' && (
                <>
                  <div className={styles.activeIcon}>⚡</div>
                  <span>CLICK!</span>
                </>
              )}
            </div>
          </div>
          
          <p className={styles.warning}>
            Don't click until the card turns green!
          </p>
        </div>
      )}

      {gameState === 'success' && (
        <div className={styles.successState}>
          <div className={styles.successIcon}>🎉</div>
          <h3>Excellent!</h3>
          <p>Your reaction time: <strong>{reactionTime}ms</strong></p>
          {bestTime && <p>Best time: <strong>{bestTime}ms</strong></p>}
          <p className={styles.completingText}>Completing challenge...</p>
        </div>
      )}

      {gameState === 'failed' && (
        <div className={styles.failedState}>
          <div className={styles.failedIcon}>😅</div>
          <h3>Try Again!</h3>
          <p className={styles.failMessage}>{message}</p>
          {reactionTime && (
            <p>Your reaction time: <strong>{reactionTime}ms</strong></p>
          )}
          <p className={styles.attemptsLeft}>
            Attempts remaining: {MAX_ATTEMPTS - attempts}
          </p>
          
          <div className={styles.failedActions}>
            {attempts < MAX_ATTEMPTS ? (
              <button className={styles.retryButton} onClick={resetGame}>
                Try Again
              </button>
            ) : (
              <button className={styles.backButton} onClick={startPenalty}>
                Watch Monkey Dance
              </button>
            )}
          </div>
        </div>
      )}

      {gameState === 'penalty' && (
        <div className={styles.penaltyState}>
          <div className={styles.penaltyHeader}>
            <div className={styles.penaltyIcon}>🙈</div>
            <h3>Oh no! You've lost all your strikes!</h3>
            <p className={styles.penaltyMessage}>
              Please watch the monkey dance until your strikes have been refilled and try again!
            </p>
          </div>
          
          <div className={styles.monkeyContainer}>
            <img 
              src="/dancing-monkey.gif" 
              alt="Dancing monkey" 
              className={styles.dancingMonkey}
            />
          </div>
          
          <div className={styles.penaltyTimer}>
            <p className={styles.timerText}>
              Strikes refilling in: <span className={styles.countdown}>{penaltyTimeLeft}</span> seconds
            </p>
            <div className={styles.timerBar}>
              <div 
                className={styles.timerFill}
                style={{ width: `${((PENALTY_DURATION - penaltyTimeLeft) / PENALTY_DURATION) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReactionTime; 