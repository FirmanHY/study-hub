// Production server untuk deployment di Railway.
// Menyajikan static build dari Vite (dist/) dan fallback ke index.html
// agar React Router (SPA) bekerja pada semua route.

import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

const distPath = path.join(__dirname, "dist");

app.use(express.static(distPath));

// SPA fallback — semua route yang tidak match static asset di-rewrite ke index.html
app.get("*", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ StudyHub server berjalan di port ${PORT}`);
});
