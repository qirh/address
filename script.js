const $ = (selector) => document.querySelector(selector);

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;",
  })[character]);
}

function ordinal(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "";
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return "th";
  if (n % 10 === 1) return "st";
  if (n % 10 === 2) return "nd";
  if (n % 10 === 3) return "rd";
  return "th";
}

function playTrainSlap({ big = false } = {}) {
  if (
    typeof window === "undefined" ||
    (window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  ) {
    return;
  }
  const overlay = document.createElement("div");
  overlay.className = big ? "train-slap train-slap-big" : "train-slap";
  overlay.setAttribute("aria-hidden", "true");
  overlay.innerHTML = `
    <div class="train-7">
      <span class="train-bullet">7</span>
      <span class="train-body" aria-hidden="true"></span>
    </div>
    <div class="train-kablam">KABLAM</div>
  `;
  document.body.appendChild(overlay);
  setTimeout(() => overlay.remove(), big ? 2000 : 1200);
}

const avenueRules = {
  "Avenue A": [{ min: 0, max: Infinity, divisor: 20, offset: 3 }],
  "Avenue B": [{ min: 0, max: Infinity, divisor: 20, offset: 3 }],
  "Avenue C": [{ min: 0, max: Infinity, divisor: 20, offset: 3 }],
  "Avenue D": [{ min: 0, max: Infinity, divisor: 20, offset: 3 }],
  "1st Avenue": [{ min: 0, max: Infinity, divisor: 20, offset: 3 }],
  "2nd Avenue": [{ min: 0, max: Infinity, divisor: 20, offset: 3 }],
  "3rd Avenue": [{ min: 0, max: Infinity, divisor: 20, offset: 10 }],
  "4th Avenue": [{ min: 0, max: Infinity, divisor: 20, offset: 8 }],
  "5th Avenue": [
    { min: 63, max: 108, divisor: 20, offset: 11 },
    { min: 109, max: 200, divisor: 20, offset: 13 },
    { min: 201, max: 400, divisor: 20, offset: 16 },
    { min: 401, max: 600, divisor: 20, offset: 18 },
    { min: 601, max: 775, divisor: 20, offset: 20 },
    { min: 776, max: 1309, divisor: 10, offset: -18 },
    { min: 1310, max: 1494, custom: "fifth-high" },
    { min: 1500, max: Infinity, divisor: 20, offset: 24 },
  ],
  "6th Avenue": [{ min: 0, max: Infinity, divisor: 20, offset: -12 }],
  "7th Avenue": [
    { min: 0, max: 1800, divisor: 20, offset: 12 },
    { min: 1801, max: Infinity, divisor: 20, offset: 20 },
  ],
  "8th Avenue": [{ min: 0, max: Infinity, divisor: 20, offset: 9 }],
  "9th Avenue": [{ min: 0, max: Infinity, divisor: 20, offset: 13 }],
  "10th Avenue": [{ min: 0, max: Infinity, divisor: 20, offset: 14 }],
  "11th Avenue": [{ min: 0, max: Infinity, divisor: 20, offset: 15 }],
  "Amsterdam Avenue": [{ min: 0, max: Infinity, divisor: 20, offset: 59 }],
  "Audubon Avenue": [{ min: 0, max: Infinity, divisor: 20, offset: 165 }],
  "Broadway": [
    { min: 1, max: 754, named: "Building numbers from 1 to 754 are on named streets south of 8th Street." },
    { min: 756, max: 846, divisor: 10, offset: -29 },
    { min: 847, max: 953, divisor: 10, offset: -25 },
    { min: 954, max: Infinity, divisor: 10, offset: -31 },
  ],
  "Central Park West": [{ min: 0, max: Infinity, divisor: 10, offset: 60 }],
  "Columbus Avenue": [{ min: 0, max: Infinity, divisor: 20, offset: 60 }],
  "Convent Avenue": [{ min: 0, max: Infinity, divisor: 20, offset: 127 }],
  "Edgecombe Avenue": [{ min: 0, max: Infinity, divisor: 20, offset: 134 }],
  "Fort Washington Avenue": [{ min: 0, max: Infinity, divisor: 20, offset: 158 }],
  "Lenox Avenue": [{ min: 0, max: Infinity, divisor: 20, offset: 10 }],
  "Lexington Avenue": [{ min: 0, max: Infinity, divisor: 20, offset: 22 }],
  "Madison Avenue": [{ min: 0, max: Infinity, divisor: 20, offset: 27 }],
  "Manhattan Avenue": [{ min: 0, max: Infinity, divisor: 20, offset: 100 }],
  "Park Avenue": [{ min: 0, max: Infinity, divisor: 20, offset: 34 }],
  "Park Avenue South": [{ min: 0, max: Infinity, divisor: 20, offset: 8 }],
  "Pleasant Avenue": [{ min: 0, max: Infinity, divisor: 20, offset: 101 }],
  "Riverside Drive": [
    { min: 0, max: 567, divisor: 10, offset: 72 },
    { min: 568, max: Infinity, divisor: 10, offset: 78 },
  ],
  "St. Nicholas Avenue": [{ min: 0, max: Infinity, divisor: 20, offset: 110 }],
  "Wadsworth Avenue": [{ min: 0, max: Infinity, divisor: 20, offset: 173 }],
  "West End Avenue": [{ min: 0, max: Infinity, divisor: 20, offset: 59 }],
  "York Avenue": [{ min: 0, max: Infinity, divisor: 20, offset: 4 }],
};

const quiz = [
  {
    type: "choice",
    prompt: "In 21-23 15th Avenue, what is the 21?",
    options: [
      "The lower-numbered cross street",
      "The apartment number",
      "The ZIP code",
      "The avenue number",
    ],
    answer: 0,
    explain: "The first field is the lower-numbered cross street.",
  },
  {
    type: "breakdown",
    prompt: "Break down this Queens address: 43-12 47th Avenue",
    parts: [
      { label: "43", answer: "cross", choices: ["cross", "house", "street"] },
      { label: "12", answer: "house", choices: ["cross", "house", "street"] },
      { label: "47th Avenue", answer: "street", choices: ["cross", "house", "street"] },
    ],
    explain: "43 is the cross-street field, 12 is the house number, and 47th Avenue is the street name.",
  },
  {
    type: "match",
    prompt: "Match the Queens street family to the usual direction.",
    left: ["Street / Place / Lane", "Avenue / Road / Drive / Terrace", "Boulevard"],
    right: ["Major route or exception", "Usually north-south", "Usually east-west"],
    pairs: {
      "Street / Place / Lane": "Usually north-south",
      "Avenue / Road / Drive / Terrace": "Usually east-west",
      "Boulevard": "Major route or exception",
    },
    explain: "Queens has a pattern, but boulevards and older names can bend it.",
  },
  {
    type: "match",
    prompt: "Match each Queens landmark to its address.",
    left: [
      "Louis Armstrong House Museum",
      "Citi Field",
      "MoMA PS1",
      "Museum of the Moving Image",
      "New York Hall of Science",
    ],
    right: [
      "22-25 Jackson Avenue",
      "47-01 111th Street",
      "34-56 107th Street",
      "123-01 Roosevelt Avenue",
      "36-01 35th Avenue",
    ],
    pairs: {
      "Louis Armstrong House Museum": "34-56 107th Street",
      "Citi Field": "123-01 Roosevelt Avenue",
      "MoMA PS1": "22-25 Jackson Avenue",
      "Museum of the Moving Image": "36-01 35th Avenue",
      "New York Hall of Science": "47-01 111th Street",
    },
    explain: "Each Queens address reads as cross-street, then house number, then street name — which is enough to roughly place a building on the grid.",
  },
  {
    type: "input",
    prompt: "Which boro has the best address system?",
    answer: ["queens"],
    blocking: true,
    wrongMessages: ["ewwww, no", "of course no", "WRONG", "try again", "absolutely not"],
    explain: "Correct. Queens, obviously.",
  },
  {
    type: "choice",
    prompt: "Which pair could be very close to each other in Queens?",
    options: [
      "15-23 156th Street and 156-23 15th Avenue",
      "15-23 156th Street and 15-23 156th Avenue",
      "501 Fifth Avenue and 43-12 47th Avenue",
      "21-23 15th Avenue and 21-23 15th Street",
    ],
    answer: 0,
    explain: "Swapping the cross-street field and street name can put two Queens addresses around the corner from each other.",
  },
  {
    type: "letters",
    prompt: "What is the best boro?",
    answer: "QUEENS",
    givenIndexes: [0],
    explain: "Queens, obviously.",
  },
];

const quizState = {
  index: 0,
  score: 0,
  selected: null,
  answered: false,
  matchPairs: {},
};

function estimateManhattanCrossStreet(buildingNumber, avenue) {
  const number = Number(buildingNumber);
  const rules = avenueRules[avenue];
  if (!Number.isFinite(number) || number <= 0 || !rules) {
    return "Enter a positive building number and choose an avenue.";
  }

  const rule = rules.find((item) => number >= item.min && number <= item.max) || rules[0];
  if (rule.named) {
    return `
      <strong>${escapeHtml(buildingNumber)} ${escapeHtml(avenue)}</strong><br>
      ${rule.named}
    `;
  }

  const base = Math.trunc(number / 10);
  const fmt = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(1));

  let estimate;
  let steps;
  if (rule.custom === "fifth-high") {
    const deduction = 20 + Math.floor((number - 1310) / 20);
    estimate = base - deduction;
    steps = [
      `${number} --> ${base}`,
      `${base} - ${deduction} --> ${estimate}`,
    ];
  } else if (rule.divisor === 10) {
    estimate = Math.floor(base + rule.offset);
    const op = rule.offset >= 0 ? "+" : "-";
    steps = [
      `${number} --> ${base}`,
      `${base} ${op} ${Math.abs(rule.offset)} --> ${estimate}`,
    ];
  } else {
    const halved = base / 2;
    const sum = halved + rule.offset;
    estimate = Math.floor(sum);
    const op = rule.offset >= 0 ? "+" : "-";
    steps = [
      `${number} --> ${base}`,
      `${base} / 2 --> ${fmt(halved)}`,
      `${fmt(halved)} ${op} ${Math.abs(rule.offset)} --> ${fmt(sum)}`,
    ];
  }

  const stepsHtml = steps.map((s) => `<li>${s}</li>`).join("");
  return `
    <strong>${escapeHtml(buildingNumber)} ${escapeHtml(avenue)}</strong>
    <ol>${stepsHtml}</ol>
    <strong>Estimated cross street: ${estimate}${ordinal(estimate)} Street.</strong>
  `;
}

function inferQueensCrossFamily(street) {
  const lower = street.toLowerCase();
  if (/\b(street|st|place|pl|lane|ln)\b/.test(lower)) {
    return "Avenue / Road / Drive / Terrace family";
  }
  if (/\b(avenue|ave|road|rd|drive|dr|terrace|ter)\b/.test(lower)) {
    return "Street / Place / Lane family";
  }
  if (/\b(boulevard|blvd|parkway|expressway)\b/.test(lower)) {
    return "major-route exception family";
  }
  return "nearby numbered grid family";
}

function decodeQueensAddress(raw) {
  const cleaned = raw.trim().replace(/\s+/g, " ");
  const match = cleaned.match(/^(\d{1,3})-(\d{1,3})\s+(.+)$/i);
  if (!match) {
    return "Try the Queens format: <strong>43-12 47th Avenue</strong>.";
  }

  const [, cross, house, street] = match;
  const safeStreet = escapeHtml(street);
  return `
    <strong>${cross}</strong> = lower-numbered cross street field
    <br><strong>${house}</strong> = house number on the block
    <br><strong>${safeStreet}</strong> = street name
    <br><br>Since this is on <strong>${safeStreet}</strong>, the ${cross} clue likely belongs to the <strong>${inferQueensCrossFamily(street)}</strong>.
  `;
}

function setupLabs() {
  const manhattanInput = $("#manhattan-number");
  const avenueInput = $("#manhattan-avenue");
  const manhattanResult = $("#manhattan-result");
  const runManhattan = () => {
    manhattanResult.innerHTML = estimateManhattanCrossStreet(manhattanInput.value, avenueInput.value);
  };

  $("#decode-manhattan").addEventListener("click", runManhattan);
  manhattanInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") runManhattan();
  });

  const queensInput = $("#queens-address");
  const queensResult = $("#queens-result");
  const runQueens = () => {
    queensResult.innerHTML = decodeQueensAddress(queensInput.value);
  };

  $("#decode-queens").addEventListener("click", runQueens);
  queensInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") runQueens();
  });

  runManhattan();
  runQueens();
}

function renderQuiz() {
  const card = $("#quiz-card");
  const question = quiz[quizState.index];
  $("#quiz-count").textContent = `Question ${quizState.index + 1} / ${quiz.length}`;
  $("#quiz-score").textContent = `${quizState.score} ${quizState.score === 1 ? "point" : "points"}`;
  quizState.selected = null;
  quizState.answered = false;
  quizState.matchPairs = {};

  if (question.type === "choice") renderChoice(card, question);
  else if (question.type === "input") renderInput(card, question);
  else if (question.type === "match") renderMatch(card, question);
  else if (question.type === "breakdown") renderBreakdown(card, question);
  else if (question.type === "letters") renderLetters(card, question);
}

function renderLetters(card, question) {
  const given = new Set(question.givenIndexes || []);
  const answer = String(question.answer);
  const blanks = answer.length - given.size;
  const givenLetters = [...given]
    .sort((a, b) => a - b)
    .map((i) => answer[i])
    .join(", ");
  const groupLabel = given.size
    ? `${givenLetters} given; fill in the remaining ${blanks} ${blanks === 1 ? "letter" : "letters"}.`
    : `Fill in all ${blanks} ${blanks === 1 ? "letter" : "letters"}.`;

  card.innerHTML = `
    <h3>${escapeHtml(question.prompt)}</h3>
    <div class="letters-input" role="group" aria-label="${escapeHtml(groupLabel)}"></div>
    <div class="feedback" aria-live="polite"></div>
    <div class="quiz-actions">
      <button class="button" type="button" data-restart>Restart</button>
    </div>
  `;

  const container = card.querySelector(".letters-input");
  const inputs = [];

  for (let i = 0; i < answer.length; i++) {
    if (given.has(i)) {
      const span = document.createElement("span");
      span.className = "letter-given";
      span.textContent = answer[i];
      container.appendChild(span);
      continue;
    }
    const input = document.createElement("input");
    input.className = "letter-slot";
    input.type = "text";
    input.maxLength = 1;
    input.autocomplete = "off";
    input.autocapitalize = "characters";
    input.dataset.expected = answer[i].toUpperCase();
    inputs.push(input);
    container.appendChild(input);
  }

  if (inputs[0]) inputs[0].focus();

  const commit = wireQuizActions(
    card,
    () => {
      let assembled = "";
      let inputIdx = 0;
      for (let i = 0; i < answer.length; i++) {
        if (given.has(i)) {
          assembled += answer[i];
        } else {
          assembled += (inputs[inputIdx]?.value || "").toUpperCase();
          inputIdx++;
        }
      }
      return assembled.toUpperCase() === answer.toUpperCase();
    },
    question,
  );

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      const typed = input.value.toUpperCase();
      if (typed && typed !== input.dataset.expected) {
        input.value = "";
        return;
      }
      input.value = typed;
      if (typed.length === 1) {
        const next = inputs[inputs.indexOf(input) + 1];
        if (next) {
          next.focus();
        } else if (inputs.every((slot) => slot.value)) {
          commit();
        }
      }
    });
    input.addEventListener("keydown", (event) => {
      if (event.key === "Backspace" && !input.value) {
        const prev = inputs[inputs.indexOf(input) - 1];
        if (prev) {
          event.preventDefault();
          prev.focus();
        }
      } else if (event.key === "Enter") {
        if (inputs.every((slot) => slot.value)) commit();
      }
    });
  });
}

function renderChoice(card, question) {
  card.innerHTML = `
    <h3>${escapeHtml(question.prompt)}</h3>
    <div class="quiz-options"></div>
    <div class="feedback" aria-live="polite"></div>
    <div class="quiz-actions">
      <button class="button" type="button" data-restart>Restart</button>
    </div>
  `;

  const commit = wireQuizActions(
    card,
    () => quizState.selected === question.answer,
    question,
  );

  const options = card.querySelector(".quiz-options");
  question.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "quiz-option";
    button.type = "button";
    button.textContent = option;
    button.addEventListener("click", () => {
      quizState.selected = index;
      card.querySelectorAll(".quiz-option").forEach((node) => node.classList.remove("selected"));
      button.classList.add("selected");
      commit();
    });
    options.appendChild(button);
  });
}

function renderInput(card, question) {
  card.innerHTML = `
    <h3>${escapeHtml(question.prompt)}</h3>
    <input class="quiz-input" autocomplete="off" />
    <div class="feedback" aria-live="polite"></div>
    <div class="quiz-actions">
      <button class="button" type="button" data-restart>Restart</button>
    </div>
  `;
  const input = card.querySelector(".quiz-input");
  input.focus();

  const commit = wireQuizActions(
    card,
    () => question.answer.includes(input.value.trim().toLowerCase()),
    question,
  );

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") commit();
  });
}

function renderMatch(card, question) {
  card.innerHTML = `
    <h3>${escapeHtml(question.prompt)}</h3>
    <p>Tap one item on the left, then its match on the right.</p>
    <div class="match-board">
      <div class="match-column" data-left></div>
      <div class="match-column" data-right></div>
    </div>
    <div class="feedback" aria-live="polite"></div>
    <div class="quiz-actions">
      <button class="button" type="button" data-restart>Restart</button>
    </div>
  `;

  const leftColumn = card.querySelector("[data-left]");
  const rightColumn = card.querySelector("[data-right]");
  let activeLeft = null;
  // Each pair gets a color slot 1..5; reused if a left is re-paired.
  const colorByLeft = {};
  let nextColorSlot = 1;

  function leftToken(label) {
    return leftColumn.querySelector(`[data-label="${CSS.escape(label)}"]`);
  }
  function rightToken(label) {
    return rightColumn.querySelector(`[data-label="${CSS.escape(label)}"]`);
  }
  function clearTokenPairing(token) {
    if (!token) return;
    token.classList.remove("matched");
    delete token.dataset.pairColor;
  }
  function resetMatchState() {
    quizState.matchPairs = {};
    activeLeft = null;
    nextColorSlot = 1;
    Object.keys(colorByLeft).forEach((k) => delete colorByLeft[k]);
    card.querySelectorAll(".match-token").forEach((node) => {
      node.classList.remove("matched", "selected");
      delete node.dataset.pairColor;
    });
  }

  const commit = wireQuizActions(
    card,
    () => question.left.every((left) => quizState.matchPairs[left] === question.pairs[left]),
    question,
    { onWrong: resetMatchState },
  );

  question.left.forEach((label) => {
    const token = createMatchToken(label);
    token.addEventListener("click", () => {
      activeLeft = label;
      leftColumn.querySelectorAll(".match-token").forEach((node) => node.classList.remove("selected"));
      token.classList.add("selected");
    });
    leftColumn.appendChild(token);
  });

  question.right.forEach((label) => {
    const token = createMatchToken(label);
    token.addEventListener("click", () => {
      if (!activeLeft) return;

      // If this LEFT was previously paired with a different right, unpair the old right.
      const prevRight = quizState.matchPairs[activeLeft];
      if (prevRight && prevRight !== label) {
        clearTokenPairing(rightToken(prevRight));
      }
      // If this RIGHT was previously paired with a different left, unpair the old left.
      const prevLeft = Object.keys(quizState.matchPairs).find(
        (k) => quizState.matchPairs[k] === label,
      );
      if (prevLeft && prevLeft !== activeLeft) {
        clearTokenPairing(leftToken(prevLeft));
        delete quizState.matchPairs[prevLeft];
        delete colorByLeft[prevLeft];
      }

      quizState.matchPairs[activeLeft] = label;

      // Reuse the color this left already had, or assign the next slot.
      let color = colorByLeft[activeLeft];
      if (!color) {
        color = String(((nextColorSlot - 1) % 5) + 1);
        colorByLeft[activeLeft] = color;
        nextColorSlot++;
      }

      token.classList.add("matched");
      token.dataset.pairColor = color;
      const left = leftToken(activeLeft);
      if (left) {
        left.classList.add("matched");
        left.dataset.pairColor = color;
        left.classList.remove("selected");
      }

      activeLeft = null;
      if (Object.keys(quizState.matchPairs).length === question.left.length) {
        commit();
      }
    });
    rightColumn.appendChild(token);
  });
}

function createMatchToken(label) {
  const token = document.createElement("button");
  token.type = "button";
  token.className = "match-token";
  token.textContent = label;
  token.dataset.label = label;
  return token;
}

function renderBreakdown(card, question) {
  card.innerHTML = `
    <h3>${escapeHtml(question.prompt)}</h3>
    <div class="breakdown-grid"></div>
    <div class="feedback" aria-live="polite"></div>
    <div class="quiz-actions">
      <button class="button" type="button" data-restart>Restart</button>
    </div>
  `;

  const commit = wireQuizActions(
    card,
    () => question.parts.every((part, index) => {
      const select = card.querySelector(`[data-part-index="${index}"]`);
      return select.value === part.answer;
    }),
    question,
  );

  const grid = card.querySelector(".breakdown-grid");
  question.parts.forEach((part, index) => {
    const row = document.createElement("div");
    row.className = "breakdown-line";
    const label = document.createElement("span");
    label.textContent = part.label;
    const select = document.createElement("select");
    select.dataset.partIndex = String(index);
    select.innerHTML = `<option value="">Choose meaning</option>`;
    part.choices.forEach((choice) => {
      const option = document.createElement("option");
      option.value = choice;
      option.textContent = choice === "cross" ? "cross-street field" :
        choice === "house" ? "house number" : "street name";
      select.appendChild(option);
    });
    select.addEventListener("change", () => {
      // Auto-commit once every dropdown has a value chosen
      const allSelected = question.parts.every((_, i) =>
        card.querySelector(`[data-part-index="${i}"]`).value !== "",
      );
      if (allSelected) commit();
    });
    row.appendChild(label);
    row.appendChild(select);
    grid.appendChild(row);
  });
}

function wireQuizActions(card, isCorrect, question, { onWrong } = {}) {
  const feedback = card.querySelector(".feedback");
  card.querySelector("[data-restart]")?.addEventListener("click", restartQuiz);

  let attemptedWrong = false;
  let advancing = false;

  function commit() {
    if (advancing) return;

    const correct = isCorrect();
    if (!correct) {
      attemptedWrong = true;
      const fallback = question.explain
        ? `Not quite. ${question.explain}`
        : "Not quite — try again.";
      const msg =
        question.wrongMessages && question.wrongMessages.length
          ? question.wrongMessages[
              Math.floor(Math.random() * question.wrongMessages.length)
            ]
          : fallback;
      feedback.textContent = msg;
      feedback.className = "feedback bad";
      onWrong?.();
      return;
    }

    if (!attemptedWrong) {
      quizState.score += 1;
      $("#quiz-score").textContent = `${quizState.score} ${
        quizState.score === 1 ? "point" : "points"
      }`;
    }
    feedback.textContent = question.explain || "Correct.";
    feedback.className = "feedback good";
    playTrainSlap({ big: question.type === "letters" });

    advancing = true;
    const delay = question.type === "letters" ? 2300 : 1500;
    setTimeout(() => {
      quizState.index += 1;
      if (quizState.index >= quiz.length) renderResults();
      else renderQuiz();
    }, delay);
  }

  return commit;
}

function renderResults() {
  $("#quiz-count").textContent = "Complete";
  $("#quiz-score").textContent = `${quizState.score} / ${quiz.length}`;
  const title = quizState.score === quiz.length
    ? "Queens Address Legend"
    : quizState.score / quiz.length >= 0.5
      ? "Grid Reader"
      : "Needs Another Walk Around the Block";
  $("#quiz-card").innerHTML = `
    <h3>${title}</h3>
    <p>You scored <strong>${quizState.score} out of ${quiz.length}</strong>.</p>
    <p>Tour move: split the Queens hyphen first, then read the street type.</p>
    <button class="button" type="button" data-restart>Play again</button>
  `;
  $("#quiz-card [data-restart]").addEventListener("click", restartQuiz);
}

function restartQuiz() {
  quizState.index = 0;
  quizState.score = 0;
  renderQuiz();
}

setupLabs();
renderQuiz();
