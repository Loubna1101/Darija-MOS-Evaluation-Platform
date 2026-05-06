const screen = document.getElementById("screen");
const progressWrapper = document.getElementById("progressWrapper");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const progressCount = document.getElementById("progressCount");

const ITEMS_PER_PARTICIPANT = 15;

let participant = {
  listenerId: generateId(),
  age: "",
  gender: "",
  darijaLevel: "",
  headphones: "",
  comments: ""
};

let currentItemIndex = 0;
let results = [];
let randomizedItems = [];

function generateId() {
  return "listener_" + Math.random().toString(36).slice(2, 10);
}

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function prepareExperiment() {
  randomizedItems = shuffleArray(evaluationItems)
    .slice(0, ITEMS_PER_PARTICIPANT)
    .map(item => ({
      ...item,
      audios: shuffleArray(item.audios)
    }));
}

function showProgress() {
  progressWrapper.classList.remove("hidden");
}

function hideProgress() {
  progressWrapper.classList.add("hidden");
}

function updateProgress() {
  const total = randomizedItems.length;
  const current = currentItemIndex;
  const percent = total === 0 ? 0 : (current / total) * 100;

  progressText.textContent = "Evaluation progress";
  progressCount.textContent = `${current}/${total}`;
  progressFill.style.width = `${percent}%`;
}

function renderWelcome() {
  hideProgress();

  screen.innerHTML = `
    <div class="card">
      <h2 class="section-title">Welcome</h2>
      <p class="subtext">
        Thank you for participating in this listening experiment for Darija Text-to-Speech systems.
        You will evaluate several audio samples for the same sentence.
      </p>

      <div class="instructions-box">
        <h3>Instructions</h3>
        <ul>
          <li>Please complete the test in a quiet place.</li>
          <li>Headphones are recommended.</li>
          <li>You will evaluate ${Math.min(ITEMS_PER_PARTICIPANT, evaluationItems.length)} randomly selected sentences.</li>
          <li>For each sample, rate 3 criteria from 1 to 5.</li>
          <li>The samples are anonymized. You will not see model names.</li>
        </ul>
      </div>

      <div class="instructions-box">
        <h3>Rating Criteria</h3>
        <p><strong>Naturalness:</strong> How human does the speech sound? Give a high score if it sounds natural and not robotic.</p>
        <p><strong>Clarity:</strong> How easy is the speech to understand? Give a high score if the words are clear and easy to follow.</p>
        <p><strong>Moroccan Accent:</strong> How Moroccan does the speech sound? Give a high score if the accent sounds like a real Moroccan speaker.</p>
      </div>

      <div class="scale-grid">
        <div class="scale-item"><strong>1</strong><br>Bad</div>
        <div class="scale-item"><strong>2</strong><br>Poor</div>
        <div class="scale-item"><strong>3</strong><br>Fair</div>
        <div class="scale-item"><strong>4</strong><br>Good</div>
        <div class="scale-item"><strong>5</strong><br>Excellent</div>
      </div>

      <div class="button-row">
        <button id="startBtn">Start</button>
      </div>

      <p class="footer-note">
        Prototype version: currently using mock audio placeholders.
      </p>
    </div>
  `;

  document.getElementById("startBtn").addEventListener("click", renderParticipantForm);
}

function renderParticipantForm() {
  hideProgress();

  screen.innerHTML = `
    <div class="card">
      <h2 class="section-title">Participant Information</h2>
      <p class="subtext">This information is optional unless your study requires it.</p>

      <label for="age">Age</label>
      <input id="age" type="number" min="1" max="120" placeholder="Enter your age" />

      <label for="gender">Gender</label>
      <select id="gender">
        <option value="">Select</option>
        <option value="female">Female</option>
        <option value="male">Male</option>
        <option value="other">Other</option>
        <option value="prefer_not_say">Prefer not to say</option>
      </select>

      <label for="darijaLevel">How familiar are you with Darija?</label>
      <select id="darijaLevel">
        <option value="">Select</option>
        <option value="native">Native speaker</option>
        <option value="advanced">Advanced</option>
        <option value="intermediate">Intermediate</option>
        <option value="basic">Basic</option>
        <option value="none">Not familiar</option>
      </select>

      <label for="headphones">Are you using headphones?</label>
      <select id="headphones">
        <option value="">Select</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>

      <label for="comments">Optional comment before starting</label>
      <textarea id="comments" placeholder="Any note you want to add"></textarea>

      <div id="formError" class="notice error hidden"></div>

      <div class="button-row">
        <button class="secondary" id="backBtn">Back</button>
        <button id="continueBtn">Continue</button>
      </div>
    </div>
  `;

  document.getElementById("backBtn").addEventListener("click", renderWelcome);

  document.getElementById("continueBtn").addEventListener("click", () => {
    participant.age = document.getElementById("age").value.trim();
    participant.gender = document.getElementById("gender").value;
    participant.darijaLevel = document.getElementById("darijaLevel").value;
    participant.headphones = document.getElementById("headphones").value;
    participant.comments = document.getElementById("comments").value.trim();

    const errorBox = document.getElementById("formError");

    if (!participant.darijaLevel) {
      errorBox.textContent = "Please select your familiarity with Darija.";
      errorBox.classList.remove("hidden");
      return;
    }

    errorBox.classList.add("hidden");
    currentItemIndex = 0;
    prepareExperiment();
    renderEvaluationItem();
  });
}

function renderMockOrRealPlayer(audio, idx) {
  if (audio.file && audio.file.trim() !== "") {
    return `
      <audio controls preload="none">
        <source src="${audio.file}" type="audio/wav">
        Your browser does not support audio playback.
      </audio>
    `;
  }

  return `
    <div class="mock-player">
      <strong>Mock Audio ${idx + 1}</strong><br>
      Audio file not added yet. This placeholder will later be replaced with a real player.
    </div>
  `;
}

function renderRatingOptions(groupName) {
  return `
    <div class="rating-row">
      ${[1, 2, 3, 4, 5].map(score => `
        <div class="rating-option">
          <input type="radio" id="${groupName}_${score}" name="${groupName}" value="${score}">
          <label for="${groupName}_${score}">${score}</label>
        </div>
      `).join("")}
    </div>
  `;
}

function renderEvaluationItem() {
  showProgress();
  updateProgress();

  const item = randomizedItems[currentItemIndex];

  const audioBlocks = item.audios.map((audio, idx) => `
    <div class="audio-block">
      <h3 class="audio-title">Sample ${idx + 1}</h3>
      ${renderMockOrRealPlayer(audio, idx)}

      <div class="criteria-grid">
        <div class="criterion-card">
          <div class="criterion-title">Naturalness</div>
          <div class="criterion-help">How human does the speech sound?</div>
          ${renderRatingOptions(`naturalness_${idx}`)}
        </div>

        <div class="criterion-card">
          <div class="criterion-title">Clarity</div>
          <div class="criterion-help">How easy is the speech to understand?</div>
          ${renderRatingOptions(`clarity_${idx}`)}
        </div>

        <div class="criterion-card">
          <div class="criterion-title">Moroccan Accent</div>
          <div class="criterion-help">How Moroccan does the speech sound?</div>
          ${renderRatingOptions(`accent_${idx}`)}
        </div>
      </div>

      <div class="rating-help">
        1 = Bad, 2 = Poor, 3 = Fair, 4 = Good, 5 = Excellent
      </div>
    </div>
  `).join("");

  screen.innerHTML = `
    <div class="card">
      <div class="eval-header">
        <h2 class="section-title">Sentence ${currentItemIndex + 1}</h2>
        <p class="subtext">
          Listen to all samples for the following sentence and rate each one on the 3 criteria.
        </p>
      </div>

      <div class="eval-text">${item.text}</div>

      ${audioBlocks}

      <div id="evalError" class="notice error hidden"></div>

      <div class="button-row">
        <button class="secondary" id="quitBtn">Save & Quit</button>
        <button id="nextBtn">${currentItemIndex === randomizedItems.length - 1 ? "Finish" : "Next"}</button>
      </div>
    </div>
  `;

  document.getElementById("quitBtn").addEventListener("click", saveProgressAndQuit);
  document.getElementById("nextBtn").addEventListener("click", handleNextItem);
}

function handleNextItem() {
  const item = randomizedItems[currentItemIndex];
  const errorBox = document.getElementById("evalError");
  const itemRatings = [];

  for (let i = 0; i < item.audios.length; i++) {
    const naturalness = document.querySelector(`input[name="naturalness_${i}"]:checked`);
    const clarity = document.querySelector(`input[name="clarity_${i}"]:checked`);
    const accent = document.querySelector(`input[name="accent_${i}"]:checked`);

    if (!naturalness || !clarity || !accent) {
      errorBox.textContent = "Please rate all samples on all 3 criteria before continuing.";
      errorBox.classList.remove("hidden");
      return;
    }

    itemRatings.push({
      participantId: participant.listenerId,
      itemId: item.id,
      text: item.text,
      shownSampleIndex: i + 1,
      modelId: item.audios[i].modelId,
      file: item.audios[i].file,
      naturalness: Number(naturalness.value),
      clarity: Number(clarity.value),
      moroccanAccent: Number(accent.value),
      timestamp: new Date().toISOString()
    });
  }

  errorBox.classList.add("hidden");
  results.push(...itemRatings);
  currentItemIndex++;

  if (currentItemIndex < randomizedItems.length) {
    renderEvaluationItem();
  } else {
    renderThankYou();
  }
}

function saveProgressAndQuit() {
  const payload = {
    participant,
    currentItemIndex,
    totalItems: randomizedItems.length,
    results,
    savedAt: new Date().toISOString()
  };

  localStorage.setItem("mos_progress", JSON.stringify(payload));

  screen.innerHTML = `
    <div class="card">
      <h2 class="section-title">Progress Saved</h2>
      <p class="subtext">
        Your current progress has been saved in this browser.
      </p>

      <div class="button-row">
        <button id="downloadProgressBtn">Download Progress JSON</button>
        <button class="secondary" id="restartBtn">Return to Home</button>
      </div>
    </div>
  `;

  hideProgress();

  document.getElementById("downloadProgressBtn").addEventListener("click", () => {
    downloadJSON(payload, `${participant.listenerId}_progress.json`);
  });

  document.getElementById("restartBtn").addEventListener("click", renderWelcome);
}

function renderThankYou() {
  const payload = {
    participant,
    totalItems: randomizedItems.length,
    results,
    submittedAt: new Date().toISOString()
  };

  localStorage.setItem("mos_final_submission", JSON.stringify(payload));
  hideProgress();

  screen.innerHTML = `
    <div class="card">
      <h2 class="section-title">Thank You</h2>
      <p class="subtext">
        Your ratings have been recorded locally in this prototype version.
      </p>

      <div class="notice success">
        Total samples rated: <strong>${results.length}</strong>
      </div>

      <div class="button-row">
        <button id="downloadBtn">Download Results JSON</button>
        <button class="secondary" id="restartBtn">Start New Session</button>
      </div>

      <p class="footer-note">
        Later, this button will be replaced by automatic submission to a database.
      </p>
    </div>
  `;

  document.getElementById("downloadBtn").addEventListener("click", () => {
    downloadJSON(payload, `${participant.listenerId}_results.json`);
  });

  document.getElementById("restartBtn").addEventListener("click", resetExperiment);
}

function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function resetExperiment() {
  participant = {
    listenerId: generateId(),
    age: "",
    gender: "",
    darijaLevel: "",
    headphones: "",
    comments: ""
  };

  currentItemIndex = 0;
  results = [];
  randomizedItems = [];
  renderWelcome();
}

renderWelcome();