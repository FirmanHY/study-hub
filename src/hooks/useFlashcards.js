import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import * as flashcardsService from "../services/flashcardsService.js";

export function useFlashcards() {
  const { user } = useAuth();
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = flashcardsService.subscribeFlashcards(
      user.uid,
      (items) => {
        setFlashcards(items);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [user]);

  const create = useCallback(
    (data) => flashcardsService.createFlashcard(user.uid, data),
    [user]
  );

  const update = useCallback(
    (id, data) => flashcardsService.updateFlashcard(user.uid, id, data),
    [user]
  );

  const remove = useCallback(
    (id) => flashcardsService.deleteFlashcard(user.uid, id),
    [user]
  );

  return { flashcards, loading, create, update, remove };
}

