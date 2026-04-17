// Production server untuk deployment di Railway.
// Menyajikan static build dari Vite (dist/) dan fallback ke index.html
// agar React Router (SPA) bekerja pada semua route.

import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Serve static files dari folder dist (hasil build Vite)
app.use(express.static(path.join(__dirname, "dist")));

// SPA fallback: semua route diarahkan ke index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`StudyHub server running on port ${PORT}`);
});

