import React, { useState, useEffect, useRef } from 'react';
import styles from './ClickFrenzy.module.scss';

const TARGET_CLICKS = 34;
// const TARGET_CLICKS = 3;
const TIME_LIMIT = 5; // seconds

const ClickFrenzy = ({ onComplete, onFailed, participantName }) => {
  const [gameState, setGameState] = useState('ready'); // 'ready', 'playing', 'success', 'failed'
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef(null);
  const gameStartTime = useRef(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsActive(false);
            // Check clicks at the time of timer completion
            setClicks(currentClicks => {
              if (currentClicks >= TARGET_CLICKS) {
                setGameState('success');
                setTimeout(() => onComplete(), 1500);
              } else {
                setGameState('failed');
              }
              return currentClicks;
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(intervalRef.current);
    }
  }, [isActive, timeLeft, onComplete]);

  const startGame = () => {
    setGameState('playing');
    setClicks(0);
    setTimeLeft(TIME_LIMIT);
    setIsActive(true);
    gameStartTime.current = Date.now();
  };

  const handleClick = () => {
    if (gameState === 'playing' && isActive) {
      const newClicks = clicks + 1;
      setClicks(newClicks);
      
      if (newClicks >= TARGET_CLICKS) {
        setIsActive(false);
        setGameState('success');
        setTimeout(() => onComplete(), 1500);
      }
    }
  };

  const resetGame = () => {
    setGameState('ready');
    setClicks(0);
    setTimeLeft(TIME_LIMIT);
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const progress = Math.min((clicks / TARGET_CLICKS) * 100, 100);

  return (
    <div className={styles.container}>
      {gameState === 'ready' && (
        <div className={styles.readyState}>
          <div className={styles.challengeIcon}>⚡</div>
          <h3>Click Frenzy Challenge</h3>
          <p className={styles.description}>
            Click the button <strong>{TARGET_CLICKS} times</strong> in <strong>{TIME_LIMIT} seconds</strong>
          </p>
          <p className={styles.tip}>
            💡 Tip: Use rapid clicks or tap rapidly on mobile!
          </p>
          <button className={styles.startButton} onClick={startGame}>
            Start Challenge
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className={styles.playingState}>
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Clicks</span>
              <span className={styles.statValue}>{clicks}/{TARGET_CLICKS}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Time</span>
              <span className={styles.statValue}>{timeLeft}s</span>
            </div>
          </div>
          
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <button 
            className={styles.clickButton} 
            onClick={handleClick}
            onMouseDown={(e) => e.preventDefault()}
          >
            <span className={styles.clickCount}>{clicks}</span>
            <span className={styles.clickText}>CLICK!</span>
          </button>
          
          <p className={styles.instruction}>
            {TARGET_CLICKS - clicks} clicks remaining!
          </p>
        </div>
      )}

      {gameState === 'success' && (
        <div className={styles.successState}>
          <div className={styles.successIcon}>🎉</div>
          <h3>Success!</h3>
          <p>You clicked {clicks} times in {TIME_LIMIT - timeLeft} seconds!</p>
          <p className={styles.completingText}>Completing challenge...</p>
        </div>
      )}

      {gameState === 'failed' && (
        <div className={styles.failedState}>
          <div className={styles.failedIcon}>😅</div>
          <h3>Time's Up!</h3>
          <p>You got {clicks} out of {TARGET_CLICKS} clicks.</p>
          <p className={styles.encouragement}>Don't give up! Try again!</p>
          <div className={styles.failedActions}>
            <button className={styles.retryButton} onClick={resetGame}>
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

export default ClickFrenzy;