/**
 * Filter notes berdasarkan keyword pada title & content.
 * Case-insensitive, mendukung partial match.
 */
export function searchNotes(notes, keyword) {
  if (!keyword || !keyword.trim()) return notes;
  const q = keyword.toLowerCase().trim();
  return notes.filter(
    (n) =>
      n.title?.toLowerCase().includes(q) ||
      n.content?.toLowerCase().includes(q)
  );
}

/**
 * Filter tasks berdasarkan keyword dan/atau status (done/pending).
 */
export function filterTasks(tasks, { keyword = "", status = "all" } = {}) {
  let result = tasks;

  if (keyword.trim()) {
    const q = keyword.toLowerCase().trim();
    result = result.filter((t) => t.title?.toLowerCase().includes(q));
  }

  if (status === "done") {
    result = result.filter((t) => t.done === true);
  } else if (status === "pending") {
    result = result.filter((t) => t.done === false);
  }

  return result;
}