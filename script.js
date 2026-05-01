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

const avenueRules = {
  "1st Avenue": [{ min: 0, max: Infinity, divisor: 20, offset: 3 }],
  "2nd Avenue": [{ min: 0, max: Infinity, divisor: 20, offset: 3 }],
  "3rd Avenue": [{ min: 0, max: Infinity, divisor: 20, offset: 10 }],
  "5th Avenue": [
    { min: 63, max: 108, divisor: 20, offset: 11 },
    { min: 109, max: 199, divisor: 20, offset: 13 },
    { min: 200, max: 399, divisor: 20, offset: 16 },
    { min: 400, max: 599, divisor: 20, offset: 18 },
    { min: 600, max: 774, divisor: 20, offset: 20 },
    { min: 775, max: 1286, divisor: 10, offset: -18 },
    { min: 1287, max: 1499, divisor: 20, offset: 45 },
    { min: 1500, max: Infinity, divisor: 20, offset: 24 },
  ],
  "6th Avenue": [{ min: 0, max: Infinity, divisor: 20, offset: -12 }],
  "7th Avenue": [
    { min: 0, max: 1800, divisor: 20, offset: 12 },
    { min: 1801, max: Infinity, divisor: 20, offset: 20 },
  ],
  "8th Avenue": [{ min: 0, max: Infinity, divisor: 20, offset: 9 }],
  "Lexington Avenue": [{ min: 0, max: Infinity, divisor: 20, offset: 22 }],
  "Madison Avenue": [{ min: 0, max: Infinity, divisor: 20, offset: 27 }],
  "Park Avenue": [{ min: 0, max: Infinity, divisor: 20, offset: 34 }],
};

const quiz = [
  {
    type: "choice",
    prompt: "The old Manhattan card starts by doing what to the building number?",
    options: [
      "Drop the last digit",
      "Add the ZIP code",
      "Double the whole number",
      "Subtract Fifth Avenue",
    ],
    answer: 0,
    explain: "The shortcut drops the last digit, halves the remainder, then adds the avenue key.",
  },
  {
    type: "choice",
    prompt: "501 Fifth Avenue lands near which crosstown street?",
    options: ["14th Street", "42nd to 43rd Street", "72nd Street", "125th Street"],
    answer: 1,
    explain: "501 on Fifth Avenue estimates to about 43rd Street, close to the real 42nd Street area.",
  },
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
    type: "choice",
    prompt: "What usually happens to the house-number field after crossing the next numbered Street or Avenue?",
    options: [
      "It resets around 01",
      "It turns into the ZIP code",
      "It skips to 999",
      "It becomes the neighborhood name",
    ],
    answer: 0,
    explain: "The house-number field usually resets when the next numbered cross street is crossed.",
  },
  {
    type: "input",
    prompt: "Type the borough famous for this hyphenated address style.",
    answer: ["queens"],
    explain: "Queens is the borough people associate with this hyphenated address format.",
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
  const estimate = Math.round(number / rule.divisor + rule.offset);
  return `
    <strong>${escapeHtml(buildingNumber)} ${escapeHtml(avenue)}</strong><br>
    Drop the last digit, divide by 2, then add the key number.
    <br><strong>Estimated cross street: ${estimate}${ordinal(estimate)} Street.</strong>
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
}

function renderChoice(card, question) {
  card.innerHTML = `
    <h3>${question.prompt}</h3>
    <div class="quiz-options"></div>
    <div class="feedback" aria-live="polite"></div>
    <div class="quiz-actions">
      <button class="button" type="button" data-restart>Restart</button>
      <button class="button" type="button" data-next disabled>Check</button>
    </div>
  `;

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
      card.querySelector("[data-next]").disabled = false;
    });
    options.appendChild(button);
  });

  wireQuizActions(card, () => quizState.selected === question.answer, question.explain);
}

function renderInput(card, question) {
  card.innerHTML = `
    <h3>${question.prompt}</h3>
    <input class="quiz-input" autocomplete="off" />
    <div class="feedback" aria-live="polite"></div>
    <div class="quiz-actions">
      <button class="button" type="button" data-restart>Restart</button>
      <button class="button" type="button" data-next>Check</button>
    </div>
  `;
  const input = card.querySelector(".quiz-input");
  input.focus();
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") card.querySelector("[data-next]").click();
  });
  wireQuizActions(
    card,
    () => question.answer.includes(input.value.trim().toLowerCase()),
    question.explain,
  );
}

function renderMatch(card, question) {
  card.innerHTML = `
    <h3>${question.prompt}</h3>
    <p>Tap one item on the left, then its match on the right.</p>
    <div class="match-board">
      <div class="match-column" data-left></div>
      <div class="match-column" data-right></div>
    </div>
    <div class="feedback" aria-live="polite"></div>
    <div class="quiz-actions">
      <button class="button" type="button" data-restart>Restart</button>
      <button class="button" type="button" data-next disabled>Check</button>
    </div>
  `;

  const leftColumn = card.querySelector("[data-left]");
  const rightColumn = card.querySelector("[data-right]");
  let activeLeft = null;

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
      quizState.matchPairs[activeLeft] = label;
      token.classList.add("matched");
      leftColumn.querySelectorAll(".match-token").forEach((node) => {
        if (node.textContent === activeLeft) node.classList.add("matched");
        node.classList.remove("selected");
      });
      activeLeft = null;
      card.querySelector("[data-next]").disabled =
        Object.keys(quizState.matchPairs).length !== question.left.length;
    });
    rightColumn.appendChild(token);
  });

  wireQuizActions(
    card,
    () => question.left.every((left) => quizState.matchPairs[left] === question.pairs[left]),
    question.explain,
  );
}

function createMatchToken(label) {
  const token = document.createElement("button");
  token.type = "button";
  token.className = "match-token";
  token.textContent = label;
  return token;
}

function renderBreakdown(card, question) {
  card.innerHTML = `
    <h3>${question.prompt}</h3>
    <div class="breakdown-grid"></div>
    <div class="feedback" aria-live="polite"></div>
    <div class="quiz-actions">
      <button class="button" type="button" data-restart>Restart</button>
      <button class="button" type="button" data-next>Check</button>
    </div>
  `;

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
    row.appendChild(label);
    row.appendChild(select);
    grid.appendChild(row);
  });

  wireQuizActions(
    card,
    () => question.parts.every((part, index) => {
      const select = card.querySelector(`[data-part-index="${index}"]`);
      return select.value === part.answer;
    }),
    question.explain,
  );
}

function wireQuizActions(card, isCorrect, explanation) {
  const feedback = card.querySelector(".feedback");
  const next = card.querySelector("[data-next]");
  card.querySelector("[data-restart]").addEventListener("click", restartQuiz);
  next.addEventListener("click", () => {
    if (!quizState.answered) {
      const correct = isCorrect();
      quizState.answered = true;
      if (correct) {
        quizState.score += 1;
        feedback.textContent = `Correct. ${explanation}`;
        feedback.className = "feedback good";
      } else {
        feedback.textContent = `Not quite. ${explanation}`;
        feedback.className = "feedback bad";
      }
      next.textContent = quizState.index === quiz.length - 1 ? "See results" : "Next";
      $("#quiz-score").textContent = `${quizState.score} ${quizState.score === 1 ? "point" : "points"}`;
      return;
    }

    quizState.index += 1;
    if (quizState.index >= quiz.length) renderResults();
    else renderQuiz();
  });
}

function renderResults() {
  $("#quiz-count").textContent = "Complete";
  $("#quiz-score").textContent = `${quizState.score} / ${quiz.length}`;
  const title = quizState.score >= 7
    ? "Queens Address Legend"
    : quizState.score >= 5
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
