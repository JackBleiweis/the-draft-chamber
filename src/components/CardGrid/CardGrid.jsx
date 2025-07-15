import React from 'react';
import Card from '../Card/Card';
import styles from './CardGrid.module.scss';

const CardGrid = ({ participants = [], onCardClick = () => {} }) => {
  return (
    <div className={styles.gridContainer}>
      <div className={styles.grid}>
        {participants.map((participant, index) => (
          <Card
            key={participant.id}
            participant={participant}
            isLocked={participant.isLocked}
            isFlipped={participant.isFlipped}
            isCompleted={participant.isCompleted}
            onClick={() => onCardClick(participant, index)}
          />
        ))}
      </div>
    </div>
  );
};

export default CardGrid; 