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
    prompt: "In most of Manhattan above 8th Street, what divides East streets from West streets?",
    options: ["Broadway", "Fifth Avenue", "Central Park West", "Park Avenue"],
    answer: 1,
    explain: "Fifth Avenue is the main east-west divider for numbered street addresses.",
  },
  {
    type: "choice",
    prompt: "In a Queens address like 31-19 37th Street, what does 31 usually help you find?",
    options: [
      "The ZIP code",
      "The subway line",
      "A nearby cross street or grid line",
      "The apartment number",
    ],
    answer: 2,
    explain: "The prefix before the hyphen is the cross-street clue.",
  },
  {
    type: "breakdown",
    prompt: "Break down this Queens address: 43-12 47th Avenue",
    parts: [
      { label: "43", answer: "cross", choices: ["cross", "house", "street"] },
      { label: "12", answer: "house", choices: ["cross", "house", "street"] },
      { label: "47th Avenue", answer: "street", choices: ["cross", "house", "street"] },
    ],
    explain: "43 is the cross-street clue, 12 is the building number on the block, and 47th Avenue is the street.",
  },
  {
    type: "choice",
    prompt: "Which is the best quick read of 22-28 36th Street in Queens?",
    options: [
      "A range from 22 to 28",
      "One hyphenated house number",
      "A ZIP code plus a house number",
      "An apartment number",
    ],
    answer: 1,
    explain: "In Queens, the hyphen is usually part of a single house number.",
  },
  {
    type: "match",
    prompt: "Match the address part to what it does.",
    left: ["Prefix before hyphen", "Suffix after hyphen", "Street name"],
    right: ["Building position on the block", "The road the building is on", "Nearby cross-street clue"],
    pairs: {
      "Prefix before hyphen": "Nearby cross-street clue",
      "Suffix after hyphen": "Building position on the block",
      "Street name": "The road the building is on",
    },
    explain: "Queens addresses carry location clues in all three pieces.",
  },
  {
    type: "choice",
    prompt: "Using the Manhattan avenue estimate, 501 Fifth Avenue lands around which area?",
    options: ["14th Street", "42nd to 43rd Street", "72nd Street", "125th Street"],
    answer: 1,
    explain: "501 divided by 20 plus the Fifth Avenue offset gives about 43, close to the real 42nd Street area.",
  },
  {
    type: "input",
    prompt: "Type the borough that is famous for hyphenated house numbers.",
    answer: ["queens"],
    explain: "Queens is the borough where hyphenated house numbers are the norm.",
  },
  {
    type: "choice",
    prompt: "A tourist sees 52-03 Center Boulevard. What street is the building actually on?",
    options: ["52nd Avenue", "3rd Street", "Center Boulevard", "Boulevard 52"],
    answer: 2,
    explain: "The street name after the house number is the road the building is on.",
  },
];

const quizState = {
  index: 0,
  score: 0,
  selected: null,
  answered: false,
  matchPairs: {},
};

function decodeQueensAddress(raw) {
  const cleaned = raw.trim().replace(/\s+/g, " ");
  const match = cleaned.match(/^(\d{1,3})-(\d{1,3})\s+(.+)$/i);
  if (!match) {
    return {
      ok: false,
      html: "Try a hyphenated Queens-style address, like <strong>31-19 37th Street</strong>.",
    };
  }

  const [, prefix, suffix, street] = match;
  const safeStreet = escapeHtml(street);
  const likelyCrossType = inferQueensCrossType(street);
  return {
    ok: true,
    html: `
      <strong>${prefix}</strong> is the cross-street clue, likely pointing toward the ${prefix}${ordinal(prefix)} ${likelyCrossType}.
      <br /><strong>${suffix}</strong> is the building's number on that block.
      <br /><strong>${safeStreet}</strong> is the street the building is actually on.
    `,
  };
}

function inferQueensCrossType(street) {
  const lower = street.toLowerCase();
  if (lower.includes("street") || lower.includes("place") || lower.includes("lane")) {
    return "Avenue/Road/Drive grid line";
  }
  if (lower.includes("avenue") || lower.includes("road") || lower.includes("drive")) {
    return "Street/Place grid line";
  }
  return "nearby numbered grid line";
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

function estimateManhattanCrossStreet(buildingNumber, avenue) {
  const number = Number(buildingNumber);
  const rules = avenueRules[avenue];
  if (!Number.isFinite(number) || number <= 0 || !rules) {
    return "Enter a positive building number and choose an avenue.";
  }

  const rule = rules.find((item) => number >= item.min && number <= item.max) || rules[0];
  const estimate = Math.round(number / rule.divisor + rule.offset);
  return `
    <strong>${buildingNumber} ${avenue}</strong> estimates to about
    <strong>${estimate}${ordinal(estimate)} Street</strong>.
    <br />Formula used: ${buildingNumber} / ${rule.divisor} ${rule.offset >= 0 ? "+" : "-"} ${Math.abs(rule.offset)}.
    <br />Treat this as a quick wayfinding estimate, not a legal address lookup.
  `;
}

function setupDecoders() {
  const queensInput = $("#queens-address");
  const queensResult = $("#queens-result");
  const decodeQueens = () => {
    queensResult.innerHTML = decodeQueensAddress(queensInput.value).html;
  };
  $("#decode-queens").addEventListener("click", decodeQueens);
  queensInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") decodeQueens();
  });

  const numberInput = $("#manhattan-number");
  const avenueInput = $("#manhattan-avenue");
  const manhattanResult = $("#manhattan-result");
  const decodeManhattan = () => {
    manhattanResult.innerHTML = estimateManhattanCrossStreet(numberInput.value, avenueInput.value);
  };
  $("#decode-manhattan").addEventListener("click", decodeManhattan);
  numberInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") decodeManhattan();
  });

  decodeQueens();
  decodeManhattan();
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
      <button class="button secondary" type="button" data-restart>Restart</button>
      <button class="button primary" type="button" data-next disabled>Next</button>
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
      <button class="button secondary" type="button" data-restart>Restart</button>
      <button class="button primary" type="button" data-next>Check</button>
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
    <p>Tap one item on the left, then its meaning on the right.</p>
    <div class="match-board">
      <div class="match-column" data-left></div>
      <div class="match-column" data-right></div>
    </div>
    <div class="feedback" aria-live="polite"></div>
    <div class="quiz-actions">
      <button class="button secondary" type="button" data-restart>Restart</button>
      <button class="button primary" type="button" data-next disabled>Next</button>
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
      <button class="button secondary" type="button" data-restart>Restart</button>
      <button class="button primary" type="button" data-next>Check</button>
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
      option.textContent = choice === "cross" ? "cross-street clue" :
        choice === "house" ? "building number" : "street name";
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
    ? "Queens Grid Guide"
    : quizState.score >= 5
      ? "Street-Sign Ready"
      : "Needs One More Walk Around the Block";
  $("#quiz-card").innerHTML = `
    <h3>${title}</h3>
    <p>You scored <strong>${quizState.score} out of ${quiz.length}</strong>.</p>
    <p>Tour tip: when you see a Queens hyphen, split it first. When you see a Manhattan street address, ask where Fifth Avenue is.</p>
    <button class="button primary" type="button" data-restart>Play again</button>
  `;
  $("#quiz-card [data-restart]").addEventListener("click", restartQuiz);
}

function restartQuiz() {
  quizState.index = 0;
  quizState.score = 0;
  renderQuiz();
}

setupDecoders();
renderQuiz();
