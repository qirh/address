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

const mapPrototypes = [
  {
    id: "sunnyside-block",
    kicker: "Example 1",
    title: "Find the address block",
    map: "sunnyside",
    prompt:
      "43-12 47th Avenue: tap the part of 47th Avenue between 43rd Street and 44th Street.",
    facts: [
      "43 is the cross-street clue.",
      "47th Avenue is the road the building sits on.",
      "So the right spot is the 47th Avenue block immediately after 43rd Street.",
    ],
    targets: [
      {
        label: "A: 47th Avenue between 43rd and 44th",
        shortLabel: "A",
        x: 48,
        y: 70,
        width: 78,
        height: 38,
        answer: true,
        success:
          "Yes. 43 points you to 43rd Street, and 47th Avenue is the road itself.",
      },
      {
        label: "B: Queens Boulevard near 43rd Street",
        shortLabel: "B",
        x: 47,
        y: 49,
        width: 70,
        height: 38,
        failure:
          "Same cross-street clue, wrong road. The address says 47th Avenue.",
      },
      {
        label: "C: 47th Avenue between 47th and 48th",
        shortLabel: "C",
        x: 74,
        y: 70,
        width: 70,
        height: 38,
        failure:
          "Right road, but too far east. The first number is 43.",
      },
    ],
  },
  {
    id: "corona-block",
    kicker: "Example 2",
    title: "Use the cross-street clue",
    map: "corona",
    prompt:
      "Louis Armstrong House Museum is 34-56 107th Street. Tap the block on 107th Street just below 34th Avenue.",
    facts: [
      "34 is the cross-street clue.",
      "56 is the house number on that block.",
      "107th Street is the street the house sits on.",
    ],
    targets: [
      {
        label: "A: 107th Street between 34th and 35th",
        shortLabel: "A",
        x: 51,
        y: 41,
        width: 58,
        height: 54,
        answer: true,
        success:
          "Correct. The 34 tells you to start at 34th Avenue; 107th Street tells you the vertical road.",
      },
      {
        label: "B: 108th Street between 34th and 35th",
        shortLabel: "B",
        x: 67,
        y: 41,
        width: 58,
        height: 54,
        failure:
          "Right avenue band, wrong street. The address says 107th Street.",
      },
      {
        label: "C: 107th Street between 35th and 37th",
        shortLabel: "C",
        x: 51,
        y: 63,
        width: 58,
        height: 54,
        failure:
          "Right street, one avenue too far south. The cross-street clue is 34.",
      },
    ],
  },
  {
    id: "landmark-tour",
    kicker: "Example 3",
    title: "Landmark address hunt",
    map: "landmarks",
    prompt:
      "Tap the landmark whose address is 22-25 Jackson Avenue.",
    facts: [
      "22-25 Jackson Avenue is MoMA PS1 in Long Island City.",
      "36-01 35 Avenue is Museum of the Moving Image in Astoria.",
      "34-56 107th Street is Louis Armstrong House Museum in Corona.",
    ],
    targets: [
      {
        label: "MoMA PS1",
        shape: "pin",
        x: 19,
        y: 44,
        answer: true,
        success:
          "Correct. MoMA PS1 is the Long Island City landmark at 22-25 Jackson Avenue.",
      },
      {
        label: "Moving Image",
        shape: "pin",
        x: 31,
        y: 26,
        failure:
          "Close, but that is Museum of the Moving Image: 36-01 35 Avenue.",
      },
      {
        label: "Louis Armstrong House",
        shape: "pin",
        x: 69,
        y: 38,
        failure:
          "That is the Corona example: 34-56 107th Street.",
      },
      {
        label: "King Manor",
        shape: "pin",
        x: 82,
        y: 76,
        failure:
          "Wrong part of Queens. King Manor is 150-03 Jamaica Avenue.",
      },
    ],
  },
];

function renderMapSvg(kind) {
  if (kind === "landmarks") {
    return `
      <svg viewBox="0 0 100 62" role="img" aria-label="Schematic Queens landmark map with Long Island City, Astoria, Corona, Flushing Meadows, and Jamaica">
        <rect class="map-water" x="0" y="0" width="100" height="62"></rect>
        <path class="map-land" d="M10 12 L46 4 L88 14 L96 34 L83 57 L35 58 L8 45 Z"></path>
        <path class="map-park" d="M58 25 L78 22 L82 42 L61 45 Z"></path>
        <path class="map-road major" d="M12 39 C28 35 42 32 58 34 S83 42 94 46"></path>
        <path class="map-subway" d="M14 37 C28 34 40 31 55 31 S73 32 87 30"></path>
        <path class="map-road" d="M22 13 L19 54"></path>
        <path class="map-road" d="M36 9 L30 54"></path>
        <path class="map-road" d="M52 8 L48 56"></path>
        <path class="map-road" d="M70 13 L66 55"></path>
        <path class="map-road" d="M13 25 C29 23 45 22 62 25 S86 32 94 35"></path>
        <path class="map-road" d="M16 49 C32 46 49 47 66 51 S82 55 90 54"></path>
        <text class="map-label" x="12" y="33">Long Island City</text>
        <text class="map-label" x="28" y="20">Astoria</text>
        <text class="map-label" x="54" y="29">Corona</text>
        <text class="map-label" x="72" y="25">Flushing</text>
        <text class="map-label" x="72" y="52">Jamaica</text>
        <text class="map-label small muted" x="59" y="39">Flushing Meadows</text>
        <text class="map-label small muted" x="45" y="52">Queens Blvd</text>
        <text class="map-label small" x="33" y="31">7 train</text>
      </svg>
    `;
  }

  if (kind === "corona") {
    return `
      <svg viewBox="0 0 100 62" role="img" aria-label="Corona Queens grid around 34th Avenue and 107th Street">
        <rect class="map-land" x="0" y="0" width="100" height="62"></rect>
        <path class="map-park" d="M6 8 L23 8 L23 53 L6 53 Z"></path>
        <path class="map-road street" d="M36 7 L36 56"></path>
        <path class="map-road street" d="M52 7 L52 56"></path>
        <path class="map-road street" d="M68 7 L68 56"></path>
        <path class="map-road avenue" d="M25 18 L91 18"></path>
        <path class="map-road avenue" d="M25 34 L91 34"></path>
        <path class="map-road avenue" d="M25 50 L91 50"></path>
        <path class="map-subway" d="M4 57 C21 53 43 51 60 51 S82 53 96 49"></path>
        <text class="map-label small muted" x="8" y="32">Flushing Meadows-Corona Park</text>
        <text class="map-label small" x="30" y="12">106th St</text>
        <text class="map-label small" x="46" y="12">107th St</text>
        <text class="map-label small" x="62" y="12">108th St</text>
        <text class="map-label small" x="75" y="17">34th Ave</text>
        <text class="map-label small" x="75" y="33">35th Ave</text>
        <text class="map-label small" x="75" y="49">37th Ave</text>
        <rect class="map-address-callout" x="40" y="20" width="25" height="10" rx="1"></rect>
        <text class="map-address-text" x="42" y="27">34-56</text>
      </svg>
    `;
  }

  return `
    <svg viewBox="0 0 100 62" role="img" aria-label="Schematic Sunnyside and Long Island City street grid">
      <rect class="map-water" x="0" y="0" width="100" height="62"></rect>
      <path class="map-land" d="M8 4 L96 4 L96 58 L9 58 L3 43 Z"></path>
      <path class="map-park" d="M15 10 L34 10 L33 20 L14 21 Z"></path>
      <path class="map-road major" d="M5 40 C20 37 36 36 53 38 S81 44 98 48"></path>
      <path class="map-subway" d="M5 52 C18 50 31 48 47 49 S74 53 96 50"></path>
      <path class="map-road street" d="M34 8 L30 56"></path>
      <path class="map-road street" d="M46 8 L43 57"></path>
      <path class="map-road street" d="M56 8 L55 57"></path>
      <path class="map-road street" d="M69 8 L69 57"></path>
      <path class="map-road street" d="M82 8 L84 57"></path>
      <path class="map-road avenue" d="M10 24 L92 24"></path>
      <path class="map-road avenue" d="M8 34 L94 34"></path>
      <path class="map-road avenue" d="M8 49 L94 49"></path>
      <rect class="map-address-callout" x="40" y="6" width="31" height="12" rx="1"></rect>
      <text class="map-address-text" x="43" y="14">43-12</text>
      <text class="map-label small" x="27" y="60">41st St</text>
      <text class="map-label small" x="39" y="60">43rd St</text>
      <text class="map-label small" x="52" y="60">44th St</text>
      <text class="map-label small" x="66" y="60">47th St</text>
      <text class="map-label small" x="11" y="23">Skillman Ave</text>
      <text class="map-label small" x="11" y="33">Queens Blvd</text>
      <text class="map-label small" x="11" y="48">47th Ave</text>
      <text class="map-label small muted" x="18" y="17">Sunnyside</text>
      <text class="map-label small" x="58" y="53">7 train</text>
    </svg>
  `;
}

function setupMapPrototypes() {
  const root = $("#map-prototypes");
  if (!root) return;

  mapPrototypes.forEach((prototype) => {
    const article = document.createElement("article");
    article.className = "map-prototype";
    article.innerHTML = `
      <span class="prototype-kicker">${escapeHtml(prototype.kicker)}</span>
      <h2>${escapeHtml(prototype.title)}</h2>
      <div class="prototype-layout">
        <div>
          <p class="prototype-prompt"><strong>${escapeHtml(prototype.prompt)}</strong></p>
          <div class="queens-mini-map">${renderMapSvg(prototype.map)}</div>
          <output class="map-feedback" aria-live="polite"></output>
          <button class="button map-reset" type="button">Reset this sketch</button>
          <div class="map-legend" aria-label="Map legend">
            <span class="legend-chip street">streets / places / lanes</span>
            <span class="legend-chip avenue">avenues / roads / drives</span>
            <span class="legend-chip subway">7 train</span>
          </div>
        </div>
        <aside class="map-side-panel">
          <strong>What it teaches</strong>
          <ul>${prototype.facts.map((fact) => `<li>${escapeHtml(fact)}</li>`).join("")}</ul>
        </aside>
      </div>
    `;

    const map = article.querySelector(".queens-mini-map");
    const feedback = article.querySelector(".map-feedback");
    const reset = article.querySelector(".map-reset");
    const found = new Set();
    const correctTargetCount = prototype.targets.filter((target) => target.answer).length;

    prototype.targets.forEach((target) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "map-target";
      button.dataset.shape = target.shape || "block";
      button.setAttribute("aria-label", target.label);
      if (target.shortLabel || target.shape === "pin") {
        button.innerHTML = `<span class="target-label">${escapeHtml(target.shortLabel || target.label)}</span>`;
      }
      button.style.left = `${target.x}%`;
      button.style.top = `${target.y}%`;
      if (target.width) button.style.width = `${target.width}px`;
      if (target.height) button.style.height = `${target.height}px`;
      if (target.rotation) {
        button.style.transform = `translate(-50%, -50%) rotate(${target.rotation}deg)`;
      }

      button.addEventListener("click", () => {
        if (target.answer) {
          button.classList.add("is-correct");
          feedback.textContent = target.success || "Correct.";
          feedback.className = "map-feedback good";
          found.add(target.id || target.label);
          if (prototype.multi && found.size < correctTargetCount) {
            feedback.textContent = `${feedback.textContent} Find ${correctTargetCount - found.size} more.`;
          } else if (prototype.multi) {
            feedback.textContent = "Correct. Street and Place are the north-south family here.";
          }
        } else {
          button.classList.add("is-wrong");
          feedback.textContent = target.failure || "Not that spot. Try another part of the map.";
          feedback.className = "map-feedback bad";
          setTimeout(() => button.classList.remove("is-wrong"), 700);
        }
      });

      map.appendChild(button);
    });

    reset.addEventListener("click", () => {
      found.clear();
      feedback.textContent = "";
      feedback.className = "map-feedback";
      article.querySelectorAll(".map-target").forEach((target) => {
        target.classList.remove("is-correct", "is-wrong");
      });
    });

    root.appendChild(article);
  });
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
  else if (question.type === "fillBlanks") renderFillBlanks(card, question);
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
        if (inputs.every((inp) => inp.value.trim())) commit();
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

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") commit();
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

function wireQuizActions(card, isCorrect, question, { onWrong } = {}) {
  const feedback = card.querySelector(".feedback");
  const next = card.querySelector("[data-next]");
  card.querySelector("[data-restart]")?.addEventListener("click", restartQuiz);
  next?.addEventListener("click", () => {
    if (next.disabled) return;
    quizState.index += 1;
    if (quizState.index >= quiz.length) renderResults();
    else renderQuiz();
  });

  let attemptedWrong = false;
  let advancing = false;

  function commit() {
    if (advancing) return;

    const correct = isCorrect();
    if (!correct) {
      attemptedWrong = true;
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

    if (!attemptedWrong) {
      quizState.score += 1;
      $("#quiz-score").textContent = `${quizState.score} ${
        quizState.score === 1 ? "point" : "points"
      }`;
      playTrainSlap({ big: question.type === "letters" });
    }
    feedback.textContent = question.explain || "Correct.";
    feedback.className = "feedback good";

    advancing = true;
    if (next) next.disabled = false;
    // Deliberately not auto-focused: an Enter keydown that triggered
    // the commit would otherwise re-fire on the freshly focused Next
    // button and skip past the explanation.
  }

  return commit;
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
  $("#quiz-score").textContent = `${quizState.score} / ${quiz.length}`;

  const total = quiz.length;
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
    <p>You scored <strong>${quizState.score} out of ${quiz.length}</strong>.</p>
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
setupMapPrototypes();
renderQuiz();
