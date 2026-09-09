VOICE ASSISTANT WEBSITE — FULL SETUP
=====================================

WHAT'S IN THIS FOLDER
   index.html          A starter homepage with the assistant already wired in
   css/style.css        Basic site styling
   js/voice-assistant.js  The voice assistant widget (self-contained, no deps)


1) RUN IT LOCALLY

   Browsers require HTTPS or localhost for microphone access, so you can't
   just double-click index.html — you need a local server. Pick one:

   Option A — Python (already installed on most machines):
       cd voice-assistant-full
       python3 -m http.server 8000
   Then open: http://localhost:8000

   Option B — Node.js:
       npx serve .
   Then open the URL it prints.

   Option C — VS Code: install the "Live Server" extension, right-click
   index.html, choose "Open with Live Server".


2) TEST IT
   Click the mic button (bottom-right), allow microphone access, and try:
     "help"
     "what time is it"
     "go to pricing"
     "how much does it cost"     (custom example command)
     "scroll to bottom"
     "search for <anything>"

   Works in Chrome, Edge, and Safari. Firefox doesn't yet support the
   speech recognition API the widget relies on.


3) MAKE IT YOUR OWN SITE
   - Edit index.html: replace the placeholder text, sections, and nav links.
     Keep section ids (id="about", id="pricing", etc.) if you want voice
     navigation like "go to about" to keep working — or add ids to your
     own sections and it'll find them automatically.
   - Edit css/style.css: colors are set as CSS variables at the top
     (--ink, --accent, --border, --bg) — change those to match your brand.
   - Edit js/voice-assistant.js: add your own commands to the COMMANDS
     array near the top (a "pricing" example is already there to copy).


4) DEPLOY IT
   This is a static site — no backend, no build step. Any of these work:
     - Drag the whole folder into Netlify's dashboard (netlify.com/drop)
     - GitHub Pages: push this folder to a repo, enable Pages in settings
     - Vercel: `npx vercel` from inside this folder
     - Or upload via FTP to any standard web host

   Whichever host you use, it will serve over HTTPS by default, which is
   what the microphone permission needs — no extra config required.


5) ADDING THE WIDGET TO AN EXISTING SITE (not this starter)
   You don't need index.html or style.css for this — just:
     1. Copy js/voice-assistant.js into your project
     2. Add before </body>:  <script src="/js/voice-assistant.js"></script>
   The widget works standalone; it doesn't depend on this starter's HTML/CSS.


TROUBLESHOOTING
   - Mic button does nothing / "not supported" message: use Chrome, Edge,
     or Safari — Firefox lacks SpeechRecognition support.
   - "Microphone access blocked": check the browser's site permissions
     (click the lock icon in the address bar) and allow microphone.
   - Works on localhost but not after deploying: confirm the deployed URL
     is https:// — mixed content or plain http:// will block the mic.
