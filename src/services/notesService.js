import { ref, push, set, update, remove, onValue } from "firebase/database";
import { db } from "../firebase/config.js";

const path = (uid) => `users/${uid}/notes`;
const itemPath = (uid, id) => `users/${uid}/notes/${id}`;

// CREATE #1 — Notes
export async function createNote(uid, { title, content, imageUrl = null, imagePublicId = null }) {
  const newRef = push(ref(db, path(uid)));
  await set(newRef, {
    title,
    content,
    imageUrl,
    imagePublicId,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
  return newRef.key;
}

// READ #1 — Notes (real-time subscription)
export function subscribeNotes(uid, callback) {
  const notesRef = ref(db, path(uid));
  return onValue(notesRef, (snapshot) => {
    const items = [];
    snapshot.forEach((child) => {
      items.push({ id: child.key, ...child.val() });
    });
    items.sort((a, b) => b.updatedAt - a.updatedAt);
    callback(items);
  });
}

// UPDATE #1 — Notes
export async function updateNote(uid, id, { title, content, imageUrl, imagePublicId }) {
  const updates = { title, content, updatedAt: Date.now() };
  // Hanya update field gambar bila eksplisit diberikan (undefined = jangan ubah)
  if (imageUrl !== undefined) updates.imageUrl = imageUrl;
  if (imagePublicId !== undefined) updates.imagePublicId = imagePublicId;
  await update(ref(db, itemPath(uid, id)), updates);
}

// DELETE #1 — Notes
export async function deleteNote(uid, id) {
  await remove(ref(db, itemPath(uid, id)));
}
