(function () {
  var toggle = document.querySelector(".nav-toggle");
  var list = document.getElementById("nav-list");
  if (toggle && list) {
    toggle.addEventListener("click", function () {
      var open = list.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    list.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        list.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function chartBounds(candles) {
    var lo = Infinity;
    var hi = -Infinity;
    for (var i = 0; i < candles.length; i++) {
      lo = Math.min(lo, candles[i].l);
      hi = Math.max(hi, candles[i].h);
    }
    var r = hi - lo || 1;
    return { min: lo - r * 0.1, max: hi + r * 0.08 };
  }

  function yAt(p, b, top, h) {
    return top + ((b.max - p) / (b.max - b.min)) * h;
  }

  function renderCandleChart(candles, highlightIndex) {
    var b = chartBounds(candles);
    var vbW = 400;
    var vbH = 220;
    var chartLeft = 44;
    var chartRight = 356;
    var chartW = chartRight - chartLeft;
    var chartTop = 32;
    var chartH = 156;
    var n = candles.length;
    var gap = chartW / (n + 1);
    var bodyW = Math.min(26, gap * 0.52);
    var parts = [];
    parts.push(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' +
        vbW +
        " " +
        vbH +
        '" width="400" height="220" aria-hidden="true">'
    );
    parts.push(
      '<rect x="36" y="24" width="328" height="172" rx="6" fill="#050807" stroke="rgba(95,125,105,0.22)"/>'
    );
    for (var i = 0; i < n; i++) {
      var cx = chartLeft + gap * (i + 1);
      var c = candles[i];
      var bull = c.c >= c.o;
      var yH = yAt(c.h, b, chartTop, chartH);
      var yL = yAt(c.l, b, chartTop, chartH);
      var yO = yAt(c.o, b, chartTop, chartH);
      var yC = yAt(c.c, b, chartTop, chartH);
      var yTop = Math.min(yO, yC);
      var yBot = Math.max(yO, yC);
      var bodyH = Math.max(yBot - yTop, 2);
      var col = bull ? "#22c55e" : "#ef4444";
      parts.push(
        '<line x1="' +
          cx +
          '" y1="' +
          yH +
          '" x2="' +
          cx +
          '" y2="' +
          yL +
          '" stroke="#64748b" stroke-width="2"/>'
      );
      parts.push(
        '<rect x="' +
          (cx - bodyW / 2) +
          '" y="' +
          yTop +
          '" width="' +
          bodyW +
          '" height="' +
          bodyH +
          '" fill="' +
          col +
          '" rx="1"/>'
      );
      if (i === highlightIndex) {
        var boxTop = Math.min(yH, yTop) - 5;
        var boxBot = Math.max(yL, yBot) + 5;
        parts.push(
          '<rect x="' +
            (cx - bodyW / 2 - 7) +
            '" y="' +
            boxTop +
            '" width="' +
            (bodyW + 14) +
            '" height="' +
            (boxBot - boxTop) +
            '" fill="none" stroke="#fbbf24" stroke-width="2.5" rx="5"/>'
        );
      }
    }
    parts.push("</svg>");
    return parts.join("");
  }

  var QUIZ = [
    {
      candles: [
        { o: 62, h: 63, l: 60, c: 60 },
        { o: 60, h: 61, l: 57, c: 58 },
        { o: 58, h: 59, l: 48, c: 57 },
      ],
      highlight: 2,
      scenario:
        "Price has been falling. The last (highlighted) candle has a small real body and a long lower shadow. At the end of a downtrend, what does this shape often suggest?",
      choices: [
        {
          text: "Possible bullish reversal—an early sign buyers may be stepping in",
          correct: true,
        },
        { text: "Bearish continuation—too early to consider longs", correct: false },
        { text: "Guaranteed profit—enter with full leverage", correct: false },
      ],
      explain:
        "A hammer-like candle after a decline often links to a <strong>possible bullish reversal</strong>: sellers failed to hold price down. You still want confirmation from the next candles or levels—this is not an order to trade.",
    },
    {
      candles: [
        { o: 42, h: 48, l: 41, c: 47 },
        { o: 47, h: 54, l: 46, c: 53 },
        { o: 53, h: 64, l: 52, c: 53 },
      ],
      highlight: 2,
      scenario:
        "After a rise, the last candle has a small body near the lows of the range and a long upper shadow. What does that often imply for price above?",
      choices: [
        {
          text: "Bearish reversal risk—consider protecting profit or exiting longs",
          correct: true,
        },
        { text: "Only stronger upside—add new longs immediately", correct: false },
        { text: "The market always ignores this pattern", correct: false },
      ],
      explain:
        "A shooting-star-like signal near the top of an uptrend often shows <strong>seller pressure returning</strong>. It does not automatically mean short—it means <strong>risk above increased</strong>; review your stop and plan.",
    },
    {
      candles: [
        { o: 55, h: 56, l: 53, c: 53 },
        { o: 53, h: 58, l: 52, c: 57 },
      ],
      highlight: 1,
      scenario:
        "The red candle’s body is fully swallowed by the next green candle (bodies only). After a downtrend, what does this two-candle pattern often suggest?",
      choices: [
        { text: "Bullish engulfing—often a start or strengthening of upward movement", correct: true },
        { text: "Bearish continuation—short only", correct: false },
        { text: "Nothing meaningful—random noise", correct: false },
      ],
      explain:
        "<strong>Bullish engulfing</strong>: the green body fully covers the prior red body—often selling pressure eased. Context (level, trend, news) still decides the trade.",
    },
    {
      candles: [
        { o: 45, h: 47, l: 44, c: 46 },
        { o: 46, h: 47, l: 41, c: 42 },
      ],
      highlight: 1,
      scenario:
        "After a rise, a small green body is fully engulfed by the next red candle. What does that often suggest?",
      choices: [
        { text: "Bearish engulfing—higher loss risk if you are long", correct: true },
        { text: "Certain continuation upward", correct: false },
        { text: "Sideways market only", correct: false },
      ],
      explain:
        "<strong>Bearish engulfing</strong> in an uptrend often shows sellers pushing back. Treat it as a <strong>caution</strong> signal, not a guaranteed instant reversal.",
    },
    {
      candles: [
        { o: 50, h: 52, l: 49, c: 51 },
        { o: 51, h: 52, l: 50, c: 50.5 },
        { o: 50.5, h: 51.2, l: 49.8, c: 50.2 },
      ],
      highlight: 2,
      scenario:
        "The last candle has almost no body (open ≈ close) and upper and lower shadows are similar. What does that often mean?",
      choices: [
        {
          text: "Doji—indecision; a pause or reversal may follow, needs confirmation",
          correct: true,
        },
        { text: "100% bullish—enter with high leverage", correct: false },
        { text: "Only a charting glitch", correct: false },
      ],
      explain:
        "A <strong>doji</strong> shows balance between buyers and sellers. It often appears near trend turns or before the next leg—wait for confirmation.",
    },
    {
      candles: [
        { o: 48, h: 49, l: 47.5, c: 48.5 },
        { o: 48.5, h: 49, l: 48.2, c: 48.8 },
        { o: 49, h: 56, l: 48.9, c: 55.5 },
      ],
      highlight: 2,
      scenario:
        "The last green candle is mostly body with tiny wicks. In an uptrend, what does that often suggest?",
      choices: [
        {
          text: "Strong bullish pressure—often continuation (still use a stop)",
          correct: true,
        },
        { text: "Immediate bearish reversal only", correct: false },
        { text: "No liquidity—always sell", correct: false },
      ],
      explain:
        "A strong body similar to a <strong>marubozu</strong> shows one side dominated the session. That often supports <strong>continuation</strong>, but stretched moves can snap back—manage risk.",
    },
    {
      candles: [
        { o: 40, h: 45, l: 39, c: 44 },
        { o: 44, h: 48, l: 43, c: 47 },
        { o: 47, h: 48, l: 38, c: 46 },
      ],
      highlight: 2,
      scenario:
        "After a rise, the last candle looks like a hammer, but the context is the <strong>upper</strong> area of the move. What does that often warn about for price below?",
      choices: [
        {
          text: "Hanging man—bearish caution; consider taking profit or tightening longs",
          correct: true,
        },
        { text: "Same as a hammer at a bottom—always buy", correct: false },
        { text: "Sideways only", correct: false },
      ],
      explain:
        "The same shape at the <strong>top</strong> of an uptrend is often read as a <strong>hanging man</strong>—sellers probing lower. Context changes meaning: hammer at lows vs hanging man at highs.",
    },
  ];

  var root = document.getElementById("quiz-root");
  if (!root) return;

  var elProgress = document.getElementById("quiz-progress");
  var elScore = document.getElementById("quiz-score");
  var elChart = document.getElementById("quiz-chart");
  var elScenario = document.getElementById("quiz-scenario");
  var elChoices = document.getElementById("quiz-choices");
  var elFeedback = document.getElementById("quiz-feedback");
  var btnNext = document.getElementById("quiz-next");
  var btnRestart = document.getElementById("quiz-restart");

  var idx = 0;
  var score = 0;
  var answered = false;

  function shuffleInPlace(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i];
      arr[i] = arr[j];
      arr[j] = t;
    }
    return arr;
  }

  function showQuestion() {
    answered = false;
    var q = QUIZ[idx];
    elProgress.textContent = "Question " + (idx + 1) + " / " + QUIZ.length;
    elScore.textContent = score > 0 ? "Correct: " + score + " / " + idx : "";
    elChart.innerHTML = renderCandleChart(q.candles, q.highlight);
    elScenario.textContent = q.scenario;
    elFeedback.hidden = true;
    elFeedback.innerHTML = "";
    btnNext.hidden = true;
    btnRestart.hidden = true;

    elChoices.innerHTML = "";
    var opts = q.choices.map(function (c, i) {
      return { text: c.text, correct: c.correct, key: i };
    });
    shuffleInPlace(opts);

    opts.forEach(function (opt) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quiz-choice";
      btn.textContent = opt.text;
      btn.dataset.correct = opt.correct ? "1" : "0";
      btn.addEventListener("click", onPick);
      elChoices.appendChild(btn);
    });
  }

  function onPick(ev) {
    if (answered) return;
    answered = true;
    var btn = ev.currentTarget;
    var ok = btn.dataset.correct === "1";
    if (ok) score++;

    elChoices.querySelectorAll(".quiz-choice").forEach(function (b) {
      b.disabled = true;
      if (b.dataset.correct === "1") b.classList.add("is-correct");
      else if (b === btn && !ok) b.classList.add("is-wrong");
    });

    var q = QUIZ[idx];
    elFeedback.hidden = false;
    elFeedback.innerHTML = (ok ? "Correct. " : "Not quite—") + q.explain;
    elScore.textContent = "Correct: " + score + " / " + (idx + 1);
    btnNext.hidden = false;
    if (idx === QUIZ.length - 1) {
      btnNext.textContent = "Results";
    } else {
      btnNext.textContent = "Next question";
    }
  }

  btnNext.addEventListener("click", function () {
    if (!answered) return;
    if (idx < QUIZ.length - 1) {
      idx++;
      showQuestion();
    } else {
      elChart.innerHTML = "";
      elScenario.textContent =
        "Finished. You answered " +
        score +
        " of " +
        QUIZ.length +
        " questions correctly. Repeat these patterns on real charts in a demo account.";
      elChoices.innerHTML = "";
      elFeedback.hidden = false;
      elFeedback.innerHTML =
        "<strong>Reminder:</strong> Candlesticks speak in <strong>probabilities</strong>, not certainties. Always pair entries and exits with a plan and a stop.";
      btnNext.hidden = true;
      btnRestart.hidden = false;
      elProgress.textContent = "Complete";
      elScore.textContent = "Score: " + score + " / " + QUIZ.length;
    }
  });

  btnRestart.addEventListener("click", function () {
    idx = 0;
    score = 0;
    showQuestion();
  });

  showQuestion();
})();
