/*!
 * Site Voice Assistant — drop-in widget
 * Add before </body>:  <script src="voice-assistant.js"></script>
 * Uses the browser's built-in Web Speech API (Chrome, Edge, Safari).
 * No build step, no dependencies.
 */
(function () {
  "use strict";

  // ---------- 1. Customize your commands here ----------
  // Each command: a test function on the lowercased transcript,
  // and a run function that receives the transcript and a `respond` callback.
  var COMMANDS = [
    {
      test: function (t) { return /what time|current time/.test(t); },
      run: function (t, respond) {
        var time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        respond("It's " + time + ".");
      }
    },
    {
      test: function (t) { return /what.*date|today.*date/.test(t); },
      run: function (t, respond) {
        var date = new Date().toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
        respond("Today is " + date + ".");
      }
    },
    {
      test: function (t) { return /scroll to top|go to top/.test(t); },
      run: function (t, respond) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        respond("Scrolling to the top.");
      }
    },
    {
      test: function (t) { return /scroll to bottom|go to bottom/.test(t); },
      run: function (t, respond) {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        respond("Scrolling to the bottom.");
      }
    },
    {
      // "go to <section>" / "open <section>" — matches an element whose id,
      // heading text, or nav link text contains the requested word.
      test: function (t) { return /^(go to|open|show me|navigate to) /.test(t); },
      run: function (t, respond) {
        var target = t.replace(/^(go to|open|show me|navigate to) /, "").trim();
        var el = findSectionByName(target);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          respond("Here's " + target + ".");
        } else {
          respond("I couldn't find a section called " + target + " on this page.");
        }
      }
    },
    {
      test: function (t) { return /search (the site |this site )?for (.+)/.test(t); },
      run: function (t, respond) {
        var m = t.match(/search (?:the site |this site )?for (.+)/);
        var query = m ? m[1].trim() : "";
        if (query) {
          respond("Searching for " + query + ".");
          window.location.href = "https://www.google.com/search?q=" +
            encodeURIComponent("site:" + window.location.hostname + " " + query);
        } else {
          respond("What would you like to search for?");
        }
      }
    },
    {
      // Example custom command — remove or edit for your own site.
      test: function (t) { return /how much|cost|pricing/.test(t); },
      run: function (t, respond) {
        var el = document.querySelector("#pricing");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        respond("Here's our pricing.");
      }
    },
    {
      test: function (t) { return /help|what can you do/.test(t); },
      run: function (t, respond) {
        respond("You can ask me for the time or date, say 'go to' a section name, 'scroll to top', or 'search for' something.");
      }
    }
  ];

  var FALLBACK_RESPONSE = "Sorry, I didn't catch a command I know. Try saying 'help' to hear what I can do.";
  var GREETING = "Hi, I'm listening. What can I help with?";

  function findSectionByName(name) {
    name = name.toLowerCase();
    var candidates = document.querySelectorAll("[id], h1, h2, h3, nav a");
    for (var i = 0; i < candidates.length; i++) {
      var el = candidates[i];
      var idMatch = el.id && el.id.toLowerCase().replace(/[-_]/g, " ").indexOf(name) !== -1;
      var textMatch = el.textContent && el.textContent.toLowerCase().indexOf(name) !== -1;
      if (idMatch || textMatch) {
        return el.id ? el : (el.getAttribute("href") && document.querySelector(el.getAttribute("href"))) || el;
      }
    }
    return null;
  }

  // ---------- 2. Styles ----------
  var css = ""
    + ".va-btn{position:fixed;right:24px;bottom:24px;width:58px;height:58px;border-radius:50%;"
    + "background:#1F2937;border:none;cursor:pointer;z-index:999998;box-shadow:0 4px 14px rgba(0,0,0,.25);"
    + "display:flex;align-items:center;justify-content:center;transition:transform .15s ease;}"
    + ".va-btn:hover{transform:scale(1.06);}"
    + ".va-btn.va-listening{background:#3D6E5B;}"
    + ".va-bars{display:flex;align-items:center;gap:3px;height:22px;}"
    + ".va-bar{width:3px;background:#F2EFE6;border-radius:2px;height:8px;transition:height .12s ease;}"
    + ".va-btn.va-listening .va-bar{animation:va-pulse 0.9s ease-in-out infinite;}"
    + ".va-bar:nth-child(1){animation-delay:0s;}"
    + ".va-bar:nth-child(2){animation-delay:.15s;}"
    + ".va-bar:nth-child(3){animation-delay:.3s;}"
    + ".va-bar:nth-child(4){animation-delay:.15s;}"
    + ".va-bar:nth-child(5){animation-delay:0s;}"
    + "@keyframes va-pulse{0%,100%{height:8px;}50%{height:20px;}}"
    + ".va-panel{position:fixed;right:24px;bottom:92px;width:280px;max-width:calc(100vw - 48px);"
    + "background:#FFFFFF;border:1px solid #E5E3DC;border-radius:14px;box-shadow:0 10px 30px rgba(0,0,0,.16);"
    + "padding:16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;z-index:999999;"
    + "display:none;flex-direction:column;gap:10px;}"
    + ".va-panel.va-open{display:flex;}"
    + ".va-title{font-size:13px;font-weight:600;color:#1A1A1A;margin:0;}"
    + ".va-sub{font-size:13px;color:#6B6B6B;margin:0;line-height:1.5;min-height:20px;}"
    + ".va-transcript{font-size:12px;color:#3D6E5B;margin:0;font-style:italic;min-height:16px;}"
    + ".va-close{position:absolute;top:10px;right:12px;border:none;background:none;cursor:pointer;"
    + "font-size:16px;color:#9A9A93;line-height:1;padding:2px;}"
    + ".va-close:hover{color:#1A1A1A;}";

  var styleTag = document.createElement("style");
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  // ---------- 3. Markup ----------
  var button = document.createElement("button");
  button.className = "va-btn";
  button.setAttribute("aria-label", "Open voice assistant");
  button.innerHTML = '<div class="va-bars">'
    + '<span class="va-bar"></span><span class="va-bar"></span><span class="va-bar"></span>'
    + '<span class="va-bar"></span><span class="va-bar"></span></div>';

  var panel = document.createElement("div");
  panel.className = "va-panel";
  panel.innerHTML = ''
    + '<button class="va-close" aria-label="Close">&times;</button>'
    + '<p class="va-title">Voice assistant</p>'
    + '<p class="va-transcript"></p>'
    + '<p class="va-sub">Tap the mic and speak.</p>';

  document.body.appendChild(panel);
  document.body.appendChild(button);

  var transcriptEl = panel.querySelector(".va-transcript");
  var subEl = panel.querySelector(".va-sub");
  var closeBtn = panel.querySelector(".va-close");

  function respond(text) {
    subEl.textContent = text;
    speak(text);
  }

  function speak(text) {
    if (!("speechSynthesis" in window)) return;
    var utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }

  // ---------- 4. Speech recognition ----------
  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  var recognition = null;
  var listening = false;

  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = document.documentElement.lang || "en-US";

    recognition.onstart = function () {
      listening = true;
      button.classList.add("va-listening");
      transcriptEl.textContent = "";
      subEl.textContent = "Listening...";
    };

    recognition.onresult = function (event) {
      var text = "";
      for (var i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      transcriptEl.textContent = text;

      if (event.results[event.results.length - 1].isFinal) {
        handleCommand(text.toLowerCase().trim());
      }
    };

    recognition.onerror = function (event) {
      subEl.textContent = event.error === "not-allowed"
        ? "Microphone access was blocked. Check your browser permissions."
        : "I didn't catch that, try again.";
    };

    recognition.onend = function () {
      listening = false;
      button.classList.remove("va-listening");
    };
  }

  function handleCommand(text) {
    for (var i = 0; i < COMMANDS.length; i++) {
      if (COMMANDS[i].test(text)) {
        COMMANDS[i].run(text, respond);
        return;
      }
    }
    respond(FALLBACK_RESPONSE);
  }

  function openPanel() {
    panel.classList.add("va-open");
    if (!recognition) {
      subEl.textContent = "Voice recognition isn't supported in this browser. Try Chrome, Edge, or Safari.";
      return;
    }
    subEl.textContent = GREETING;
    speak(GREETING);
    try { recognition.start(); } catch (e) { /* already started */ }
  }

  function closePanel() {
    panel.classList.remove("va-open");
    if (recognition && listening) recognition.stop();
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }

  button.addEventListener("click", function () {
    if (panel.classList.contains("va-open")) {
      closePanel();
    } else {
      openPanel();
    }
  });

  closeBtn.addEventListener("click", closePanel);
})();
