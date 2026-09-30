# Marketing-Clips YASMILE

- `videos/` – fertige Clips, 1080 × 1920 (9:16), 30 fps, H.264 – für Instagram/Facebook Reels & Stories, TikTok, YouTube Shorts
- `Beitragstexte.md` – passende Texte und Hashtags je Clip
- `clips-quellen/` – Animationen als HTML/CSS/JS in den Markenfarben (Grün #204b30, Creme #f5f4ea, Gold #b89a5e)

## Clip neu rendern

Voraussetzungen: Node.js mit Playwright und ein ffmpeg mit libx264.

```bash
cd marketing/clips-quellen
FFMPEG=/pfad/zu/ffmpeg node record.js clip1.html ../videos/YASMILE-Clip1-Markenclip.mp4 30
```

Texte und Timing stehen direkt in `clip1.html` – `clip3.html` (Funktion `render(t)`, Zeit in Sekunden).
Schriften: Montserrat und Cormorant Garamond (SIL Open Font License).
