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
    <div class="train-7" aria-hidden="true">
      <span class="train-cab">
        <span class="train-headlight"></span>
        <span class="train-bullet">7</span>
      </span>
      <span class="train-body">
        <span class="train-window"></span>
        <span class="train-window"></span>
        <span class="train-window"></span>
        <span class="train-window"></span>
      </span>
    </div>
    <div class="train-kablam">KABLAM</div>
  `;
  document.body.appendChild(overlay);
  setTimeout(() => overlay.remove(), big ? 2600 : 1800);
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
    type: "fillBlanks",
    prompt:
      "Louis Armstrong House Museum is at 34-56 107th Street. Fill in each blank with the matching part of the address.",
    blanks: [
      { label: "Cross street", answer: "34" },
      { label: "House number", answer: "56" },
      {
        label: "Street name",
        answer: "107th Street",
        alternates: ["107", "107th", "107 st", "107th st"],
      },
    ],
    explain:
      "Louis Armstrong's house is on 107th Street, between 34th and 35th Avenues. 34 is the cross-street field, 56 is the house number, 107th Street is the street it sits on.",
  },
  {
    type: "fillBlanks",
    prompt:
      "Citi Field is at 123-01 Roosevelt Avenue. Fill in each blank with the matching part of the address.",
    blanks: [
      { label: "Cross street", answer: "123" },
      { label: "House number", answer: "01", alternates: ["1"] },
      {
        label: "Street name",
        answer: "Roosevelt Avenue",
        alternates: ["Roosevelt", "Roosevelt Ave"],
      },
    ],
    explain:
      "Citi Field sits on Roosevelt Avenue, between 123rd and 124th Streets. 123 is the cross-street field, 01 is the house number, Roosevelt Avenue is the street.",
  },
  {
    type: "map",
    maxPoints: 2,
    prompt: "Place 43-25 43rd St on the map.",
    game: {
      address: "43-25 43rd St",
      parts: { cross: "43", house: "25", street: "43rd Street" },
      map: "sunnyside",
      targetRoad: { kind: "street", label: "43rd St" },
      correctIndex: 2,
    },
    explain: "43 means the closest cross street is 43rd Avenue. The address sits on 43rd Street, so it's the block of 43rd Street next to 43rd Avenue.",
  },
  {
    type: "map",
    maxPoints: 2,
    prompt: "Place 34-56 107th Street on the map.",
    game: {
      address: "34-56 107th Street",
      parts: { cross: "34", house: "56", street: "107th Street" },
      map: "corona",
      targetRoad: { kind: "street", label: "107th St" },
      correctIndex: 0,
    },
    explain: "34 means the closest cross street is 34th Avenue. The address sits on 107th Street, so it's the block of 107th Street between 34th and 35th.",
  },
  {
    type: "map",
    maxPoints: 2,
    prompt: "Place 44-13 Queens Blvd on the map.",
    game: {
      address: "44-13 Queens Blvd",
      parts: { cross: "44", house: "13", street: "Queens Blvd" },
      map: "sunnyside",
      targetRoad: { kind: "avenue", label: "Queens Blvd" },
      correctIndex: 1,
    },
    explain: "44 means the closest cross street is 44th Street. The address sits on Queens Boulevard, so it's the block of Queens Blvd between 44th and 45th.",
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
    prompt: "Which pair of addresses ends up around the same corner?",
    options: [
      "15-23 156th Street and 156-23 15th Avenue",
      "501 Fifth Avenue and 43-12 47th Avenue",
      "31-23 47th Avenue and 88-09 144th Street",
    ],
    answer: 0,
    explain: "Swapping the cross-street field and the street name (15-23 156th Street and 156-23 15th Avenue) lands you at the same Queens intersection.",
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

const mapDefs = {
  sunnyside: {
    viewBox: "0 0 540 340",
    streets: [
      { label: "43rd St", x: 130 },
      { label: "44th St", x: 220 },
      { label: "45th St", x: 310 },
      { label: "46th St", x: 400 },
      { label: "47th St", x: 490 },
    ],
    avenues: [
      { label: "39th Ave", y: 70 },
      { label: "Skillman Ave", y: 130 },
      { label: "43rd Ave", y: 190 },
      { label: "Queens Blvd", y: 250, major: true },
      { label: "47th Ave", y: 310 },
    ],
  },
  corona: {
    viewBox: "0 0 540 280",
    streets: [
      { label: "105th St", x: 130 },
      { label: "106th St", x: 220 },
      { label: "107th St", x: 310 },
      { label: "108th St", x: 400 },
      { label: "109th St", x: 490 },
    ],
    avenues: [
      { label: "34th Ave", y: 65 },
      { label: "35th Ave", y: 120 },
      { label: "37th Ave", y: 170 },
      { label: "38th Ave", y: 215 },
      { label: "39th Ave", y: 260 },
    ],
  },
};

const SVG_NS = "http://www.w3.org/2000/svg";

function svgEl(name, attrs, text) {
  const el = document.createElementNS(SVG_NS, name);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  if (text != null) el.textContent = text;
  return el;
}

function computeSegments(def, game) {
  const segments = [];
  const target = game.targetRoad;
  if (target.kind === "avenue") {
    const ave = def.avenues.find((a) => a.label === target.label);
    for (let i = 0; i < def.streets.length - 1; i++) {
      const a = def.streets[i];
      const b = def.streets[i + 1];
      segments.push({
        x: a.x,
        y: ave.y - 16,
        w: b.x - a.x,
        h: 32,
        between: `${a.label} and ${b.label}`,
        roadLabel: ave.label,
      });
    }
  } else {
    const st = def.streets.find((s) => s.label === target.label);
    for (let i = 0; i < def.avenues.length - 1; i++) {
      const a = def.avenues[i];
      const b = def.avenues[i + 1];
      segments.push({
        x: st.x - 16,
        y: a.y,
        w: 32,
        h: b.y - a.y,
        between: `${a.label} and ${b.label}`,
        roadLabel: st.label,
      });
    }
  }
  return segments;
}

function drawMap(svg, def, targetLabel) {
  const [, , vbW, vbH] = svg.getAttribute("viewBox").split(" ").map(Number);
  const left = 100;
  const right = vbW - 20;
  const top = 30;
  const bottom = vbH - 10;

  def.avenues.forEach((ave) => {
    const isTarget = ave.label === targetLabel;
    const cls = `map-line${ave.major ? " major" : ""}${isTarget ? " target" : ""}`;
    svg.appendChild(svgEl("line", { x1: left, x2: right, y1: ave.y, y2: ave.y, class: cls }));
    svg.appendChild(svgEl("text", {
      x: left - 6,
      y: ave.y + 4,
      class: "map-axis-label",
      "text-anchor": "end",
    }, ave.label));
  });

  def.streets.forEach((st) => {
    const isTarget = st.label === targetLabel;
    const cls = `map-line${isTarget ? " target" : ""}`;
    svg.appendChild(svgEl("line", { x1: st.x, x2: st.x, y1: top, y2: bottom, class: cls }));
    svg.appendChild(svgEl("text", {
      x: st.x,
      y: top - 8,
      class: "map-axis-label",
      "text-anchor": "middle",
    }, st.label));
  });
}

function renderMap(card, question) {
  const game = question.game;
  const def = mapDefs[game.map];

  card.innerHTML = `
    <h3>${escapeHtml(question.prompt)}</h3>
    <div class="queens-address" aria-label="Address parts">
      <span><strong>${escapeHtml(game.parts.cross)}</strong><small>cross street</small></span>
      <b>-</b>
      <span><strong>${escapeHtml(game.parts.house)}</strong><small>house number</small></span>
      <span class="street-piece"><strong>${escapeHtml(game.parts.street)}</strong><small>street name</small></span>
    </div>
    <p class="map-prompt">Tap the block where this building sits.</p>
    <div class="map-frame">
      <svg class="map-svg" viewBox="${def.viewBox}" preserveAspectRatio="xMidYMid meet"></svg>
    </div>
    <div class="feedback" aria-live="polite"></div>
    ${actionsHtml()}
  `;

  const svg = card.querySelector(".map-svg");
  const segments = computeSegments(def, game);
  let lastClickedIndex = -1;
  let answered = false;
  let commit;

  drawMap(svg, def, game.targetRoad.label);

  segments.forEach((seg, i) => {
    const rect = svgEl("rect", {
      x: seg.x,
      y: seg.y,
      width: seg.w,
      height: seg.h,
      class: "map-target",
      tabindex: "0",
      role: "button",
      "aria-label": `${seg.roadLabel} between ${seg.between}`,
      "data-index": String(i),
    });
    rect.addEventListener("click", () => {
      if (answered) return;
      lastClickedIndex = i;
      commit();
    });
    rect.addEventListener("keydown", (e) => {
      if (answered) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        lastClickedIndex = i;
        commit();
      }
    });
    svg.appendChild(rect);
  });

  commit = wireQuizActions(
    card,
    () => lastClickedIndex === game.correctIndex,
    question,
    {
      onWrong: () => {
        const rect = svg.querySelector(`.map-target[data-index="${lastClickedIndex}"]`);
        if (rect) {
          rect.classList.add("wrong");
          setTimeout(() => rect.classList.remove("wrong"), 700);
        }
        const feedback = card.querySelector(".feedback");
        if (feedback) {
          feedback.textContent = `Not that block. The first number, ${game.parts.cross}, is the cross-street clue.`;
          feedback.className = "feedback bad";
        }
      },
      onCorrect: () => {
        answered = true;
        const rects = svg.querySelectorAll(".map-target");
        rects.forEach((r, i) => {
          r.setAttribute("tabindex", "-1");
          r.classList.add("locked");
          if (i === game.correctIndex) r.classList.add("correct");
        });
        const correctRect = svg.querySelector(`.map-target[data-index="${game.correctIndex}"]`);
        if (correctRect) {
          const cx = Number(correctRect.getAttribute("x")) + Number(correctRect.getAttribute("width")) / 2;
          const cy = Number(correctRect.getAttribute("y")) + Number(correctRect.getAttribute("height")) / 2;
          const pin = svgEl("circle", { cx, cy, r: 0, class: "map-pin" });
          svg.appendChild(pin);
          requestAnimationFrame(() => pin.setAttribute("r", "10"));
          svg.appendChild(svgEl("text", {
            x: cx,
            y: cy - 18,
            class: "map-pin-label",
            "text-anchor": "middle",
          }, game.address));
        }
      },
    },
  );
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
  updateScoreDisplay();
  quizState.selected = null;
  quizState.answered = false;
  quizState.matchPairs = {};

  if (question.type === "choice") renderChoice(card, question);
  else if (question.type === "input") renderInput(card, question);
  else if (question.type === "match") renderMatch(card, question);
  else if (question.type === "breakdown") renderBreakdown(card, question);
  else if (question.type === "letters") renderLetters(card, question);
  else if (question.type === "fillBlanks") renderFillBlanks(card, question);
  else if (question.type === "map") renderMap(card, question);
}

function renderFillBlanks(card, question) {
  card.innerHTML = `
    <h3>${escapeHtml(question.prompt)}</h3>
    <div class="fill-blanks-grid"></div>
    <div class="feedback" aria-live="polite"></div>
    ${actionsHtml()}
  `;

  const grid = card.querySelector(".fill-blanks-grid");
  const inputs = [];
  let autoTimer = null;

  function matches(blank, value) {
    // Strict case-insensitive trim. The leading zero in addresses like
    // 123-01 is part of the field, so '01' should not equal '1'.
    const v = value.trim().toLowerCase();
    if (v === blank.answer.toLowerCase()) return true;
    return (blank.alternates || []).some((a) => v === a.toLowerCase());
  }

  const commit = wireQuizActions(
    card,
    () => question.blanks.every((b, i) => matches(b, inputs[i].value)),
    question,
  );

  question.blanks.forEach((blank, i) => {
    const row = document.createElement("div");
    row.className = "fill-blanks-row";
    const label = document.createElement("label");
    label.textContent = blank.label;
    label.htmlFor = `fill-blank-${i}`;
    const input = document.createElement("input");
    input.id = `fill-blank-${i}`;
    input.type = "text";
    input.autocomplete = "off";
    input.spellcheck = false;
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        clearTimeout(autoTimer);
        if (inputs.every((inp) => inp.value.trim())) commit();
      }
    });
    input.addEventListener("input", () => {
      clearTimeout(autoTimer);
      if (inputs.every((inp) => inp.value.trim())) {
        autoTimer = setTimeout(() => commit(), 1000);
      }
    });
    inputs.push(input);
    row.appendChild(label);
    row.appendChild(input);
    grid.appendChild(row);
  });

  if (inputs[0]) inputs[0].focus();
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
    ${actionsHtml()}
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
    ${actionsHtml()}
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
    ${actionsHtml()}
  `;
  const input = card.querySelector(".quiz-input");
  input.focus();

  const commit = wireQuizActions(
    card,
    () => question.answer.includes(input.value.trim().toLowerCase()),
    question,
  );

  let autoTimer = null;
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      clearTimeout(autoTimer);
      commit();
    }
  });
  input.addEventListener("input", () => {
    clearTimeout(autoTimer);
    if (input.value.trim()) {
      autoTimer = setTimeout(() => commit(), 1000);
    }
  });
}

function renderMatch(card, question) {
  card.innerHTML = `
    <h3>${escapeHtml(question.prompt)}</h3>
    <p>Tap an item on either side, then tap its match.</p>
    <div class="match-board">
      <div class="match-column" data-left></div>
      <div class="match-column" data-right></div>
    </div>
    <div class="feedback" aria-live="polite"></div>
    ${actionsHtml()}
  `;

  const leftColumn = card.querySelector("[data-left]");
  const rightColumn = card.querySelector("[data-right]");
  let activeSide = null;
  let activeLabel = null;
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
  function clearSelection() {
    card.querySelectorAll(".match-token.selected").forEach((node) =>
      node.classList.remove("selected"),
    );
  }
  function selectToken(side, label, token) {
    clearSelection();
    token.classList.add("selected");
    activeSide = side;
    activeLabel = label;
  }
  function resetMatchState() {
    quizState.matchPairs = {};
    activeSide = null;
    activeLabel = null;
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

  function pair(leftLabel, rightLabel) {
    // If this LEFT was previously paired with a different right, unpair the old right.
    const prevRight = quizState.matchPairs[leftLabel];
    if (prevRight && prevRight !== rightLabel) {
      clearTokenPairing(rightToken(prevRight));
    }
    // If this RIGHT was previously paired with a different left, unpair the old left.
    const prevLeft = Object.keys(quizState.matchPairs).find(
      (k) => quizState.matchPairs[k] === rightLabel,
    );
    if (prevLeft && prevLeft !== leftLabel) {
      clearTokenPairing(leftToken(prevLeft));
      delete quizState.matchPairs[prevLeft];
      delete colorByLeft[prevLeft];
    }

    quizState.matchPairs[leftLabel] = rightLabel;

    // Reuse the color this left already had, or assign the next slot.
    let color = colorByLeft[leftLabel];
    if (!color) {
      color = String(((nextColorSlot - 1) % 5) + 1);
      colorByLeft[leftLabel] = color;
      nextColorSlot++;
    }

    const lt = leftToken(leftLabel);
    const rt = rightToken(rightLabel);
    [lt, rt].forEach((node) => {
      if (!node) return;
      node.classList.add("matched");
      node.classList.remove("selected");
      node.dataset.pairColor = color;
    });

    activeSide = null;
    activeLabel = null;
    if (Object.keys(quizState.matchPairs).length === question.left.length) {
      commit();
    }
  }

  question.left.forEach((label) => {
    const token = createMatchToken(label);
    token.addEventListener("click", () => {
      if (activeSide === "right") {
        pair(label, activeLabel);
      } else {
        selectToken("left", label, token);
      }
    });
    leftColumn.appendChild(token);
  });

  question.right.forEach((label) => {
    const token = createMatchToken(label);
    token.addEventListener("click", () => {
      if (activeSide === "left") {
        pair(activeLabel, label);
      } else {
        selectToken("right", label, token);
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
    ${actionsHtml()}
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

function actionsHtml() {
  const nextLabel =
    quizState.index === quiz.length - 1 ? "See results" : "Next →";
  return `
    <div class="quiz-actions">
      <button class="button" type="button" data-restart>Restart</button>
      <button class="button" type="button" data-next disabled>${nextLabel}</button>
    </div>
  `;
}

function wireQuizActions(card, isCorrect, question, { onWrong, onCorrect } = {}) {
  const feedback = card.querySelector(".feedback");
  const next = card.querySelector("[data-next]");
  card.querySelector("[data-restart]")?.addEventListener("click", restartQuiz);
  next?.addEventListener("click", () => {
    if (next.disabled) return;
    quizState.index += 1;
    if (quizState.index >= quiz.length) renderResults();
    else renderQuiz();
  });

  let wrongCount = 0;
  let advancing = false;

  function commit() {
    if (advancing) return;

    const correct = isCorrect();
    if (!correct) {
      wrongCount += 1;
      const fallback = question.explain
        ? `Not quite. ${question.explain}`
        : "Not quite. Try again.";
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

    const maxPoints = question.maxPoints || 1;
    const earned = Math.max(0, maxPoints - wrongCount);
    if (earned > 0) {
      quizState.score += earned;
      updateScoreDisplay();
      if (wrongCount === 0) {
        playTrainSlap({ big: question.type === "letters" });
      }
    }
    feedback.textContent = question.explain || "Correct.";
    feedback.className = "feedback good";

    advancing = true;
    if (next) next.disabled = false;
    onCorrect?.();
    // Deliberately not auto-focused: an Enter keydown that triggered
    // the commit would otherwise re-fire on the freshly focused Next
    // button and skip past the explanation.
  }

  return commit;
}

function quizMaxPoints() {
  return quiz.reduce((sum, q) => sum + (q.maxPoints || 1), 0);
}

function updateScoreDisplay() {
  $("#quiz-score").textContent = `${quizState.score} / ${quizMaxPoints()}`;
}

const RANKS = [
  { min: 1.0, label: "Queens Address Legend" },
  { min: 0.75, label: "7-Train Regular" },
  { min: 0.5, label: "Grid Reader" },
  { min: 0.25, label: "Took the F Instead of the 7" },
  { min: 0, label: "Needs Another Tour" },
];

function renderResults() {
  $("#quiz-count").textContent = "Complete";

  const total = quizMaxPoints();
  $("#quiz-score").textContent = `${quizState.score} / ${total}`;

  const tiers = RANKS.map((r) => ({
    label: r.label,
    minScore: Math.ceil(r.min * total),
  }));
  tiers.forEach((tier, i) => {
    tier.maxScore = i === 0 ? total : tiers[i - 1].minScore - 1;
  });
  const achieved = tiers.find((tier) => quizState.score >= tier.minScore);

  const ladder = tiers
    .map((tier) => {
      const range = tier.minScore === tier.maxScore
        ? `${tier.minScore}/${total}`
        : `${tier.minScore}–${tier.maxScore}/${total}`;
      const cls = tier === achieved ? " rank-achieved" : "";
      return `<li class="rank-row${cls}"><span class="rank-range">${range}</span><span class="rank-label">${tier.label}</span></li>`;
    })
    .join("");

  $("#quiz-card").innerHTML = `
    <h3>${achieved.label}</h3>
    <p>You scored <strong>${quizState.score} out of ${total}</strong>.</p>
    <ul class="rank-ladder">${ladder}</ul>
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
