# Darija TTS MOS Evaluation Platform

A web-based tool for Mean Opinion Score (MOS) evaluations of Darija Text-to-Speech models. Participants rate audio samples on naturalness, clarity, and accent authenticity.

## Features

- Comparison of 3 TTS models (Human, Qwen, and XTTS).
- Random selection of 15 sentences per session.
- Randomized audio playback order to prevent bias.
- Collection of participant demographics and 1-5 scale ratings.
- Support for server-side submission (Cloudflare D1) and local JSON download.

## Project Structure

- index.html: Main UI shell.
- app.js: Core logic and UI flow.
- data.js: Sentence text and audio file paths.
- functions/api/submit.js: Backend submission handler.
- audios/: Audio sample directories.

## Deployment

### Database Schema

Run this in your Cloudflare D1 database:

```sql
CREATE TABLE participants (
  participant_id TEXT PRIMARY KEY,
  age TEXT,
  gender TEXT,
  darija_level TEXT,
  headphones TEXT,
  comments TEXT,
  submitted_at TEXT
);

CREATE TABLE ratings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  participant_id TEXT,
  item_id TEXT,
  text TEXT,
  shown_sample_index INTEGER,
  model_id TEXT,
  file TEXT,
  naturalness INTEGER,
  clarity INTEGER,
  moroccan_accent INTEGER,
  timestamp TEXT
);
```

### Hosting

1. Upload the files to Cloudflare Pages.
2. Bind your D1 database to the variable name "DB" in the Pages settings.
3. Ensure audio paths in data.js match your directory structure.
