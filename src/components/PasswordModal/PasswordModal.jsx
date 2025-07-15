import React, { useState } from 'react';
import styles from './PasswordModal.module.scss';

const PasswordModal = ({ 
  isOpen = false, 
  onClose = () => {}, 
  onSubmit = () => {},
  cardName = ''
}) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder for future password validation logic
    onSubmit(password);
  };

  const handleClose = () => {
    setPassword(''); // Clear password when closing
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Unlock Card</h2>
          <button 
            className={styles.closeButton} 
            onClick={handleClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        
        <form className={styles.modalForm} onSubmit={handleSubmit}>
          {cardName && (
            <div className={styles.cardInfo}>
              <p className={styles.cardInfoText}>
                Enter password to unlock <strong>{cardName}</strong>'s card
              </p>
            </div>
          )}
          
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder={`Enter ${cardName}'s password`}
              autoFocus
            />
          </div>
          
          <div className={styles.modalActions}>
            <button 
              type="button" 
              className={styles.cancelButton}
              onClick={handleClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={!password.trim()}
            >
              Unlock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal; 