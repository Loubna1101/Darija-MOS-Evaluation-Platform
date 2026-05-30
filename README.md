 Darija TTS MOS Evaluation Platform

  A web-based tool for Mean Opinion Score (MOS) evaluations of Darija Text-to-Speech models. Participants rate audio
  samples on naturalness, clarity, and accent authenticity.

  Features

   - Comparison of 2 TTS models (model_b and model_c).
   - Random selection of 15 sentences per session.
   - Randomized audio playback order to prevent bias.
   - Collection of participant demographics and 1-5 scale ratings.
   - Support for server-side submission (Cloudflare D1) and local JSON download.

  Project Structure

   - index.html: Main UI shell.
   - app.js: Core logic and UI flow.
   - data.js: Sentence text and audio file paths.
   - functions/api/submit.js: Backend submission handler.
   - audios/: Audio sample directories.

  Deployment

  Database Schema

  Run the following SQL in your Cloudflare D1 database to prepare the tables:

    1 CREATE TABLE participants (
    2   participant_id TEXT PRIMARY KEY,
    3   age TEXT,
    4   gender TEXT,
    5   darija_level TEXT,
    6   headphones TEXT,
    7   comments TEXT,
    8   submitted_at TEXT
    9 );
    1 CREATE TABLE ratings (
    2   id INTEGER PRIMARY KEY AUTOINCREMENT,
    3   participant_id TEXT,
    4   item_id TEXT,
    5   text TEXT,
    6   shown_sample_index INTEGER,
    7   model_id TEXT,
    8   file TEXT,
    9   naturalness INTEGER,
    10   clarity INTEGER,
    11   moroccan_accent INTEGER,
    12   timestamp TEXT
    13 );

  Hosting

   1. Upload the project files to Cloudflare Pages.
   2. Bind the D1 database to the variable name DB in the Cloudflare Pages settings.
   3. Verify that the audio file paths in data.js match your directory structure.

