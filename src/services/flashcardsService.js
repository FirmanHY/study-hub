import { ref, push, set, update, remove, onValue } from "firebase/database";
import { db } from "../firebase/config.js";

const path = (uid) => `users/${uid}/flashcards`;
const itemPath = (uid, id) => `users/${uid}/flashcards/${id}`;

// CREATE #3 — Flashcards
export async function createFlashcard(uid, { question, answer }) {
  const newRef = push(ref(db, path(uid)));
  await set(newRef, {
    question,
    answer,
    createdAt: Date.now(),
  });
  return newRef.key;
}

// READ #3 — Flashcards (real-time subscription)
export function subscribeFlashcards(uid, callback) {
  const cardsRef = ref(db, path(uid));
  return onValue(cardsRef, (snapshot) => {
    const items = [];
    snapshot.forEach((child) => {
      items.push({ id: child.key, ...child.val() });
    });
    items.sort((a, b) => b.createdAt - a.createdAt);
    callback(items);
  });
}

// UPDATE #3 — Flashcards
export async function updateFlashcard(uid, id, { question, answer }) {
  await update(ref(db, itemPath(uid, id)), { question, answer });
}

// DELETE #3 — Flashcards
export async function deleteFlashcard(uid, id) {
  await remove(ref(db, itemPath(uid, id)));
}
