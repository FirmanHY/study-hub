import { ref, push, set, update, remove, onValue } from "firebase/database";
import { db } from "../firebase/config.js";

const path = (uid) => `users/${uid}/tasks`;
const itemPath = (uid, id) => `users/${uid}/tasks/${id}`;

// CREATE #2 — Tasks
export async function createTask(uid, { title, deadline, priority }) {
  const newRef = push(ref(db, path(uid)));
  await set(newRef, {
    title,
    deadline,
    priority,
    done: false,
    createdAt: Date.now(),
  });
  return newRef.key;
}

// READ #2 — Tasks (real-time subscription)
export function subscribeTasks(uid, callback) {
  const tasksRef = ref(db, path(uid));
  return onValue(tasksRef, (snapshot) => {
    const items = [];
    snapshot.forEach((child) => {
      items.push({ id: child.key, ...child.val() });
    });
    items.sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1;
      return new Date(a.deadline) - new Date(b.deadline);
    });
    callback(items);
  });
}

// UPDATE #2 — Tasks
export async function updateTask(uid, id, fields) {
  await update(ref(db, itemPath(uid, id)), fields);
}

// DELETE #2 — Tasks
export async function deleteTask(uid, id) {
  await remove(ref(db, itemPath(uid, id)));
}
