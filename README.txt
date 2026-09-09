ADD THE VOICE ASSISTANT TO YOUR WEBSITE
========================================

1) Copy voice-assistant.js into your website's files (e.g. /js/voice-assistant.js).

2) Add one line just before the closing </body> tag on any page you want it on:

       <script src="/js/voice-assistant.js"></script>

That's it — a mic button appears in the bottom-right corner of the page.

HOW IT WORKS
   - Click the mic button, allow microphone access when the browser asks.
   - It uses the browser's built-in Web Speech API — no server, no API keys,
     no cost. Works in Chrome, Edge, and Safari. Firefox does not support
     the recognition API yet.
   - Must be served over HTTPS (or localhost) — browsers block microphone
     access on plain HTTP.

BUILT-IN COMMANDS
   - "what time is it" / "what's the date"
   - "go to <section name>" — jumps to any element whose id, heading, or
     nav link matches (e.g. "go to services" finds <section id="services">
     or a heading/nav link containing "services")
   - "scroll to top" / "scroll to bottom"
   - "search for <query>" — searches Google scoped to your domain
   - "help" — lists what it can do

ADDING YOUR OWN COMMANDS
   Open voice-assistant.js and add to the COMMANDS array near the top:

       {
         test: function (t) { return /pricing/.test(t); },
         run: function (t, respond) {
           document.querySelector("#pricing").scrollIntoView({behavior:"smooth"});
           respond("Here's our pricing.");
         }
       }

   `t` is the lowercased thing the visitor said. `respond(text)` shows the
   reply in the panel and speaks it aloud.

CUSTOMIZING LOOKS
   All styles are in the `css` string near the top of voice-assistant.js —
   colors, size, and position (`.va-btn` controls the button, `.va-panel`
   the popup panel).

TRY IT LOCALLY
   Open demo.html in Chrome, Edge, or Safari (via a local server — e.g.
   `python -m http.server` in this folder, then visit
   http://localhost:8000/demo.html) to see it working end to end.
