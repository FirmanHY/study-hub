import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import * as notesService from "../services/notesService.js";

export function useNotes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = notesService.subscribeNotes(user.uid, (items) => {
      setNotes(items);
      setLoading(false);
    });
    return unsubscribe;
  }, [user]);

  const create = useCallback(
    (data) => notesService.createNote(user.uid, data),
    [user]
  );

  const update = useCallback(
    (id, data) => notesService.updateNote(user.uid, id, data),
    [user]
  );

  const remove = useCallback(
    (id) => notesService.deleteNote(user.uid, id),
    [user]
  );

  return { notes, loading, create, update, remove };
}
