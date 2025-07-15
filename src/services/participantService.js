import {
  collection,
  doc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

const PARTICIPANTS_COLLECTION = "participants";

// Listen to real-time updates
export const subscribeToParticipants = (callback) => {
  return onSnapshot(collection(db, PARTICIPANTS_COLLECTION), (snapshot) => {
    const participants = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(participants);
  });
};

// Update participant (unlock card)
export const unlockParticipant = async (participantId) => {
  try {
    // Convert participant ID to document ID format
    const docId = `participant-${participantId}`;
    const participantRef = doc(db, PARTICIPANTS_COLLECTION, docId);
    await updateDoc(participantRef, {
      isLocked: false,
      unlockedAt: serverTimestamp(),
    });
    console.log(`Unlocked participant ${participantId}`);
  } catch (error) {
    console.error("Error unlocking participant:", error);
  }
};

// Re-lock participant (when they give up on challenges)
export const lockParticipant = async (participantId) => {
  try {
    // Convert participant ID to document ID format
    const docId = `participant-${participantId}`;
    const participantRef = doc(db, PARTICIPANTS_COLLECTION, docId);
    await updateDoc(participantRef, {
      isLocked: true,
      lockedAt: serverTimestamp(),
    });
    console.log(`Locked participant ${participantId}`);
  } catch (error) {
    console.error("Error locking participant:", error);
  }
};

// Mark challenges as completed
export const completeParticipant = async (participantId) => {
  try {
    // Convert participant ID to document ID format
    const docId = `participant-${participantId}`;
    const participantRef = doc(db, PARTICIPANTS_COLLECTION, docId);
    await updateDoc(participantRef, {
      isCompleted: true,
      completedAt: serverTimestamp(),
    });
    console.log(`Completed participant ${participantId}`);
  } catch (error) {
    console.error("Error completing participant:", error);
  }
};

// File cleaned up - initialization functions removed since data is already in Firebase
