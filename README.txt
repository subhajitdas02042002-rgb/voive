VOICE ASSISTANT — LANDING PAGE
================================

WHAT'S IN THIS FOLDER
   index.html          The showcase/landing page (also runs the live demo)
   css/style.css        Styling for the page
   js/voice-assistant.js  The actual voice assistant widget


RUN IT LOCALLY
   Microphone access requires HTTPS or localhost, so open it via a local
   server rather than double-clicking the file:

       cd va-landing
       python3 -m http.server 8000

   Then visit http://localhost:8000 — the mic button in the corner is the
   real widget, live on the page. Say "help" to hear what it can do, or
   "go to features" / "go to how" / "go to code" to test section navigation.


DEPLOY IT
   Static site, no build step. Drag the folder into Netlify
   (netlify.com/drop), push it to GitHub Pages, or run `npx vercel` inside
   the folder — any static host works, and all of them serve HTTPS by
   default.


CUSTOMIZING
   - Copy: edit the headline, feature cards, and steps directly in
     index.html.
   - Colors/fonts: CSS variables at the top of css/style.css
     (--ink, --accent, --paper, --display, --sans).
   - The widget itself: js/voice-assistant.js — its COMMANDS array near
     the top is where you'd add or change voice commands.

To use just the widget on a different site (without this landing page),
see the comments at the top of js/voice-assistant.js — it only needs one
script tag.
