import React from 'react';
import styles from './RayquazaCreature.module.scss';

const RayquazaCreature = () => {
  return (
    <div className={styles.container}>
      <div className={styles.creature}>
        {/* Head */}
        <div className={styles.head}>
          <div className={styles.eye}></div>
          <div className={styles.eye}></div>
          <div className={styles.horn}></div>
        </div>
        
        {/* Body segments */}
        <div className={styles.bodySegment} style={{ '--delay': '0.1s' }}>
          <div className={styles.fin}></div>
        </div>
        <div className={styles.bodySegment} style={{ '--delay': '0.2s' }}>
          <div className={styles.fin}></div>
        </div>
        <div className={styles.bodySegment} style={{ '--delay': '0.3s' }}>
          <div className={styles.fin}></div>
        </div>
        <div className={styles.bodySegment} style={{ '--delay': '0.4s' }}>
          <div className={styles.fin}></div>
        </div>
        <div className={styles.bodySegment} style={{ '--delay': '0.5s' }}>
          <div className={styles.fin}></div>
        </div>
        <div className={styles.bodySegment} style={{ '--delay': '0.6s' }}>
          <div className={styles.fin}></div>
        </div>
        <div className={styles.bodySegment} style={{ '--delay': '0.7s' }}>
          <div className={styles.fin}></div>
        </div>
        <div className={styles.bodySegment} style={{ '--delay': '0.8s' }}>
          <div className={styles.fin}></div>
        </div>
        
        {/* Tail */}
        <div className={styles.tail}>
          <div className={styles.tailFin}></div>
        </div>
      </div>
    </div>
  );
};

export default RayquazaCreature;