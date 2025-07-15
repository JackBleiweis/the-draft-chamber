import React, { useState, useEffect, useRef } from 'react';
import styles from './HoldToCast.module.scss';

const HOLD_TIME = 90; // seconds
// const HOLD_TIME = 2; // secondso
const HOLD_TIME_MS = HOLD_TIME * 1000; // milliseconds

const HoldToCast = ({ onComplete, onFailed, participantName }) => {
  const [gameState, setGameState] = useState('ready');
  const [timeHeld, setTimeHeld] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  // eslint-disable-next-line
  const [isTouchingScreen, setIsTouchingScreen] = useState(false);
  
  // Refs for precise timing
  const buttonRef = useRef(null);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);
  const isHoldingRef = useRef(false);
  const isTouchingScreenRef = useRef(false);
  const activePointerRef = useRef(null);

  // Animation loop - only advances when actually touching
  const updateTimer = (currentTime) => {
    if (!isHoldingRef.current || !startTimeRef.current) {
      return;
    }

    // Only advance timer if actively touching
    if (!isTouchingScreenRef.current) {
      animationRef.current = requestAnimationFrame(updateTimer);
      return;
    }

    const elapsedTime = currentTime - startTimeRef.current;
    const elapsedSeconds = elapsedTime / 1000;
    
    // Update display
    setTimeHeld(elapsedSeconds);
    
    // Check if we've reached the target time
    if (elapsedTime >= HOLD_TIME_MS) {
      // SUCCESS - Complete the challenge
      completeChallenge();
      return;
    }
    
    // Continue the animation loop
    animationRef.current = requestAnimationFrame(updateTimer);
  };

  const completeChallenge = () => {
    setGameState('success');
    setIsHolding(false);
    setIsTouchingScreen(false);
    isHoldingRef.current = false;
    isTouchingScreenRef.current = false;
    cancelAnimationFrame(animationRef.current);
    startTimeRef.current = null;
    activePointerRef.current = null;
    
    // Give user a moment to see completion before closing
    setTimeout(() => onComplete(), 2000);
  };

  const startHolding = (e) => {
    e.preventDefault();
    
    // Track the pointer/touch
    if (e.pointerId !== undefined) {
      activePointerRef.current = e.pointerId;
    } else if (e.touches && e.touches.length > 0) {
      activePointerRef.current = e.touches[0].identifier;
    }
    
    setIsTouchingScreen(true);
    isTouchingScreenRef.current = true;
    
    // Record the exact start time
    startTimeRef.current = performance.now();
    setGameState('holding');
    setTimeHeld(0);
    setIsHolding(true);
    isHoldingRef.current = true;
    
    // Start the animation loop
    animationRef.current = requestAnimationFrame(updateTimer);
  };

  const stopHolding = (e, reason = 'unknown') => {
    // Update touching state immediately
    setIsTouchingScreen(false);
    isTouchingScreenRef.current = false;
    
    // Validate it's the same pointer/touch
    if (e && activePointerRef.current !== null) {
      let isCorrectPointer = false;
      
      if (e.pointerId !== undefined) {
        isCorrectPointer = e.pointerId === activePointerRef.current;
      } else if (e.changedTouches) {
        isCorrectPointer = Array.from(e.changedTouches).some(t => t.identifier === activePointerRef.current);
      } else {
        isCorrectPointer = true; // Mouse events
      }
      
      if (!isCorrectPointer) {
        return;
      }
    }
    
    // Cancel the hold completely
    if (isHoldingRef.current) {
      isHoldingRef.current = false;
      setIsHolding(false);
      cancelAnimationFrame(animationRef.current);
      
      // Only set to failed if we were actually holding
      if (gameState === 'holding') {
        setGameState('failed');
      }
      
      startTimeRef.current = null;
      activePointerRef.current = null;
    }
  };

  const resetChallenge = () => {
    setGameState('ready');
    setTimeHeld(0);
    setIsHolding(false);
    setIsTouchingScreen(false);
    isHoldingRef.current = false;
    isTouchingScreenRef.current = false;
    cancelAnimationFrame(animationRef.current);
    startTimeRef.current = null;
    activePointerRef.current = null;
  };

  // Global event listeners to catch pointer/touch events anywhere
  useEffect(() => {
    const handleGlobalPointerUp = (e) => {
      stopHolding(e, 'global-pointerup');
    };

    const handleGlobalPointerCancel = (e) => {
      stopHolding(e, 'global-pointercancel');
    };

    const handleGlobalTouchEnd = (e) => {
      stopHolding(e, 'global-touchend');
    };

    const handleGlobalTouchCancel = (e) => {
      stopHolding(e, 'global-touchcancel');
    };

    const handleGlobalMouseUp = (e) => {
      stopHolding(e, 'global-mouseup');
    };

    const handleGlobalPointerMove = (e) => {
      if (!buttonRef.current || !isHoldingRef.current || !activePointerRef.current) return;
      
      if (e.pointerId !== activePointerRef.current) return;

      const rect = buttonRef.current.getBoundingClientRect();
      const isOverButton = (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      );
      
      if (!isOverButton) {
        stopHolding(e, 'moved-outside-button');
      }
    };

    // Add global listeners when holding starts
    if (isHolding) {
      document.addEventListener('pointerup', handleGlobalPointerUp, { passive: false });
      document.addEventListener('pointercancel', handleGlobalPointerCancel, { passive: false });
      document.addEventListener('touchend', handleGlobalTouchEnd, { passive: false });
      document.addEventListener('touchcancel', handleGlobalTouchCancel, { passive: false });
      document.addEventListener('mouseup', handleGlobalMouseUp, { passive: false });
      document.addEventListener('pointermove', handleGlobalPointerMove, { passive: false });
    }

    return () => {
      document.removeEventListener('pointerup', handleGlobalPointerUp);
      document.removeEventListener('pointercancel', handleGlobalPointerCancel);
      document.removeEventListener('touchend', handleGlobalTouchEnd);
      document.removeEventListener('touchcancel', handleGlobalTouchCancel);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('pointermove', handleGlobalPointerMove);
    };
    // eslint-disable-next-line
  }, [isHolding, gameState, timeHeld,]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const progress = Math.min((timeHeld / HOLD_TIME) * 100, 100);
  const timeRemaining = Math.max(HOLD_TIME - timeHeld, 0);

  return (
    <div className={styles.container}>
      {gameState === 'ready' && (
        <div className={styles.readyState}>
          <div className={styles.challengeIcon}>🎯</div>
          <h3>Final challenge to unlock your pick!</h3>
          <h3>Hold to Cast</h3>
          <p className={styles.description}>
            Hold the button for <strong>{HOLD_TIME} seconds</strong> without letting go
          </p>
          <div className={styles.rules}>
            <p>• Press and hold the button continuously</p>
            <p>• Don't let go or move your mouse/finger</p>
            <p>• If you let go, you'll have to start over</p>
            <p>• Unlimited attempts - keep trying!</p>
          </div>
          <button className={styles.startButton} onClick={() => setGameState('ready-to-hold')}>
            Get Ready
          </button>
        </div>
      )}

      {gameState === 'ready-to-hold' && (
        <div className={styles.readyToHold}>
          <div className={styles.instructionText}>
            <h3>Ready to Cast</h3>
            <p>Press and hold the button below for {HOLD_TIME} seconds</p>
            <p className={styles.warning}>⚠️ Don't let go once you start!</p>
          </div>
          <div
            ref={buttonRef}
            className={styles.holdButton}
            onPointerDown={startHolding}
            onMouseDown={startHolding}
            onTouchStart={startHolding}
            style={{ 
              touchAction: 'none',
              userSelect: 'none',
              cursor: 'pointer'
            }}
          >
            <span className={styles.holdText}>HOLD TO CAST</span>
          </div>
        </div>
      )}

      {gameState === 'holding' && (
        <div className={styles.holdingState}>
          <div className={styles.stats}>
            <div className={styles.timeDisplay}>
              <span className={styles.timeLabel}>Time Remaining</span>
              <span className={styles.timeValue}>{timeRemaining.toFixed(1)}s</span>
            </div>
          </div>
          
          <div className={styles.progressRing}>
            <svg className={styles.progressSvg} viewBox="0 0 120 120">
              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="rgba(102, 126, 234, 0.2)"
                strokeWidth="8"
              />
              {/* Progress circle */}
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="var(--primary-color)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="326.73"
                strokeDashoffset={326.73 - (progress / 100) * 326.73}
                transform="rotate(-90 60 60)"
                className={styles.progressCircle}
              />
            </svg>
            <div className={styles.progressCenter}>
              <span className={styles.progressPercent}>{Math.round(progress)}%</span>
            </div>
          </div>
          
          <div
            ref={buttonRef}
            className={`${styles.holdButton} ${styles.active}`}
            style={{ 
              touchAction: 'none',
              userSelect: 'none',
              cursor: 'pointer'
            }}
          >
            <span className={styles.holdText}>CASTING...</span>
          </div>
          
          <p className={styles.holdInstruction}>
            Keep holding! {timeRemaining.toFixed(1)} seconds left
          </p>
        </div>
      )}

      {gameState === 'success' && (
        <div className={styles.successState}>
          <div className={styles.successIcon}>🎉</div>
          <h3>Cast Complete!</h3>
          <p>You held the button for {HOLD_TIME} seconds!</p>
          <p className={styles.completingText}>All challenges completed! 🎯</p>
        </div>
      )}

      {gameState === 'failed' && (
        <div className={styles.failedState}>
          <div className={styles.failedIcon}>💔</div>
          <h3>Cast Interrupted!</h3>
          <p>You held for {timeHeld.toFixed(1)} seconds out of {HOLD_TIME}.</p>
          <p className={styles.encouragement}>
            Don't give up! You can keep trying until you succeed.
          </p>
          
          <div className={styles.failedActions}>
            <button className={styles.retryButton} onClick={resetChallenge}>
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

export default HoldToCast; 