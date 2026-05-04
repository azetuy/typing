let levels = [
  {
    name: "Starter",
    rank: "Apprentice",
    note: "まずは短い単語から。",
    xpToNext: 5,
    words: [
      ["apple", "りんご"],
      ["book", "本"],
      ["water", "水"],
      ["happy", "幸せな"],
      ["music", "音楽"],
      ["green", "緑の"],
      ["chair", "いす"],
      ["smile", "ほほえむ"],
    ],
  },
  {
    name: "Daily",
    rank: "Traveler",
    note: "毎日の会話で使う単語。",
    xpToNext: 12,
    words: [
      ["morning", "朝"],
      ["family", "家族"],
      ["picture", "写真、絵"],
      ["kitchen", "台所"],
      ["weather", "天気"],
      ["station", "駅"],
      ["favorite", "お気に入りの"],
      ["message", "伝言、メッセージ"],
    ],
  },
  {
    name: "School",
    rank: "Scholar",
    note: "少し長い学習単語へ。",
    xpToNext: 22,
    words: [
      ["history", "歴史"],
      ["science", "科学"],
      ["library", "図書館"],
      ["practice", "練習する"],
      ["question", "質問"],
      ["language", "言語"],
      ["exercise", "運動、練習"],
      ["knowledge", "知識"],
    ],
  },
  {
    name: "Challenge",
    rank: "Explorer",
    note: "スペルの集中力が試される。",
    xpToNext: 36,
    words: [
      ["adventure", "冒険"],
      ["discover", "発見する"],
      ["improve", "改善する"],
      ["creative", "創造的な"],
      ["confident", "自信のある"],
      ["important", "重要な"],
      ["decision", "決定"],
      ["possible", "可能な"],
    ],
  },
  {
    name: "Master",
    rank: "Word Master",
    note: "英検や読解でも出会う単語。",
    xpToNext: 52,
    words: [
      ["environment", "環境"],
      ["opportunity", "機会"],
      ["responsible", "責任がある"],
      ["communicate", "伝える"],
      ["experience", "経験"],
      ["independent", "独立した"],
      ["achievement", "達成"],
      ["concentrate", "集中する"],
    ],
  },
];

const targetWordCounts = {
  "英検5級": 600,
  "英検4級": 1100,
  "英検3級": 1650,
  "英検準2級": 3600,
  "英検2級": 2000,
  "英検1級": 2000,
};

const levelOrder = {
  "英検5級": 1,
  "英検4級": 2,
  "英検3級": 3,
  "英検準2級": 4,
  "英検2級": 5,
  "英検1級": 6,
};

const state = {
  currentLevel: 0,
  selectedLevel: 0,
  dataSource: "default-eiken-v1",
  currentWord: null,
  typedIndex: 0,
  typedText: "",
  wordIndex: 0,
  xp: 0,
  score: 0,
  combo: 0,
  bestCombo: 0,
  total: 0,
  correct: 0,
  keyTotal: 0,
  keyCorrect: 0,
  roundStartedAt: 0,
  runStartedAt: 0,
  timerId: null,
  soundOn: true,
  meaningHiddenDuringTyping: false,
  meaningRevealedForSpeech: false,
  playerName: "Player",
  runId: String(Date.now()),
  particles: [],
};

let savedProgress = null;
try {
  savedProgress = JSON.parse(localStorage.getItem("wordClimberProgress") || "null");
} catch {
  try {
    localStorage.removeItem("wordClimberProgress");
  } catch {
    // 保存が使えない環境でも、ゲーム本体はそのまま動かします。
  }
}

const elements = {
  soundButton: document.querySelector("#soundButton"),
  levelLabel: document.querySelector("#levelLabel"),
  xpLabel: document.querySelector("#xpLabel"),
  scoreLabel: document.querySelector("#scoreLabel"),
  comboLabel: document.querySelector("#comboLabel"),
  accuracyLabel: document.querySelector("#accuracyLabel"),
  levelProgress: document.querySelector("#levelProgress"),
  nextLevelLabel: document.querySelector("#nextLevelLabel"),
  difficultyBadge: document.querySelector("#difficultyBadge"),
  wordCountBadge: document.querySelector("#wordCountBadge"),
  meaningToggleButton: document.querySelector("#meaningToggleButton"),
  meaningLabel: document.querySelector("#meaningLabel"),
  wordDisplay: document.querySelector("#wordDisplay"),
  hintLabel: document.querySelector("#hintLabel"),
  typingForm: document.querySelector("#typingForm"),
  typingInput: document.querySelector("#typingInput"),
  startButton: document.querySelector("#startButton"),
  endButton: document.querySelector("#endButton"),
  endDialog: document.querySelector("#endDialog"),
  endForm: document.querySelector("#endForm"),
  endSummary: document.querySelector("#endSummary"),
  playerNameInput: document.querySelector("#playerNameInput"),
  cancelEndButton: document.querySelector("#cancelEndButton"),
  levelSelect: document.querySelector("#levelSelect"),
  csvInput: document.querySelector("#csvInput"),
  csvNameLabel: document.querySelector("#csvNameLabel"),
  feedbackLabel: document.querySelector("#feedbackLabel"),
  timerLabel: document.querySelector("#timerLabel"),
  missionProgress: document.querySelector("#missionProgress"),
  comboProgress: document.querySelector("#comboProgress"),
  rankIcon: document.querySelector("#rankIcon"),
  rankLabel: document.querySelector("#rankLabel"),
  rankNote: document.querySelector("#rankNote"),
  rankingList: document.querySelector("#rankingList"),
  levelList: document.querySelector("#levelList"),
  canvas: document.querySelector("#celebrationCanvas"),
};

const canvasContext = elements.canvas.getContext("2d");

function buildLevelList() {
  elements.levelList.innerHTML = "";
  levels.forEach((level, index) => {
    const item = document.createElement("li");
    const label = document.createElement("strong");
    const length = document.createElement("span");
    const target = targetWordCounts[level.name];
    label.textContent = `${index + 1}. ${level.name}`;
    const lengths = level.words.map((entry) => entry.word.length);
    length.textContent = target
      ? `${level.words.length} / 目安${target}語`
      : `${Math.min(...lengths)}-${Math.max(...lengths)} letters`;
    item.append(label, length);
    item.addEventListener("click", () => selectLevel(index));
    elements.levelList.appendChild(item);
  });
}

function buildLevelSelect() {
  elements.levelSelect.innerHTML = "";
  levels.forEach((level, index) => {
    const option = document.createElement("option");
    const target = targetWordCounts[level.name];
    option.value = String(index);
    option.textContent = target
      ? `${index + 1}. ${level.name} (${level.words.length}/${target}語)`
      : `${index + 1}. ${level.name} (${level.words.length}語)`;
    elements.levelSelect.appendChild(option);
  });
  elements.levelSelect.value = String(state.selectedLevel);
}

function getRankingKey() {
  const level = levels[state.selectedLevel];
  return `wordClimberRanking:${state.dataSource}:${level.name}`;
}

function getRankName(score) {
  if (score >= 12000) return ["S", "Legend"];
  if (score >= 8000) return ["A", "Ace"];
  if (score >= 5000) return ["B", "Expert"];
  if (score >= 2500) return ["C", "Challenger"];
  if (score >= 1000) return ["D", "Rookie"];
  return ["E", "Starter"];
}

function loadRanking() {
  try {
    return JSON.parse(localStorage.getItem(getRankingKey()) || "[]");
  } catch {
    return [];
  }
}

function saveRanking(ranking) {
  try {
    localStorage.setItem(getRankingKey(), JSON.stringify(ranking.slice(0, 10)));
  } catch {
    elements.feedbackLabel.textContent = "ランキング保存が使えませんが、スコア計算は続けられます。";
  }
}

function recordRanking(score, seconds) {
  if (score <= 0) return 0;

  const level = levels[state.selectedLevel];
  const ranking = loadRanking();
  const entry = {
    score,
    level: level.name,
    words: state.correct,
    accuracy: state.keyTotal === 0 ? 100 : Math.round((state.keyCorrect / state.keyTotal) * 100),
    bestCombo: state.bestCombo,
    seconds: Number(seconds.toFixed(1)),
    playerName: (state.playerName || "Player").slice(0, 20),
    date: new Date().toLocaleDateString("ja-JP"),
  };
  ranking.push(entry);
  entry.runId = state.runId;
  const nextRanking = ranking.filter((item) => item.runId !== state.runId);
  nextRanking.push(entry);
  nextRanking.sort((a, b) => b.score - a.score || b.bestCombo - a.bestCombo || a.seconds - b.seconds);
  const rank = nextRanking.indexOf(entry) + 1;
  saveRanking(nextRanking);
  renderRanking();
  return rank <= 10 ? rank : 0;
}

function renderRanking() {
  elements.rankingList.textContent = "";
  const ranking = loadRanking();

  if (ranking.length === 0) {
    const item = document.createElement("li");
    item.textContent = "まだ記録がありません";
    elements.rankingList.appendChild(item);
    return;
  }

  ranking.slice(0, 5).forEach((entry, index) => {
    const item = document.createElement("li");
    const score = document.createElement("strong");
    const meta = document.createElement("span");
    const name = entry.playerName || "Player";
    score.textContent = `${index + 1}. ${name} / ${entry.score.toLocaleString()} pt`;
    meta.textContent = `${entry.words}語 / ${entry.accuracy}% / ${entry.bestCombo} combo`;
    item.append(score, meta);
    elements.rankingList.appendChild(item);
  });
}

function pickWord() {
  const level = levels[state.selectedLevel];
  const filtered = level.words.filter((entry) => entry.word !== state.currentWord?.word);
  const available = filtered.length > 0 ? filtered : level.words;
  state.currentWord = available[Math.floor(Math.random() * available.length)];
  state.typedIndex = 0;
  state.typedText = "";
  state.wordIndex += 1;
}

function renderWordDisplay() {
  if (!state.currentWord) {
    elements.wordDisplay.textContent = "READY";
    return;
  }

  elements.wordDisplay.textContent = "";
  [...state.currentWord.word].forEach((letter, index) => {
    const span = document.createElement("span");
    span.className =
      index < state.typedIndex ? "letter is-typed" : index === state.typedIndex ? "letter is-current" : "letter";
    span.textContent = letter;
    elements.wordDisplay.appendChild(span);
  });
}

function getMeaningText() {
  if (!state.currentWord) return "準備ができたらスタート";
  return state.currentWord.category
    ? `${state.currentWord.meaning} / ${state.currentWord.category}`
    : state.currentWord.meaning;
}

function updateMeaningDisplay() {
  const shouldHide = state.meaningHiddenDuringTyping && state.currentWord && !state.meaningRevealedForSpeech;
  elements.meaningLabel.textContent = getMeaningText();
  elements.meaningLabel.classList.toggle("is-hidden", Boolean(shouldHide));
  elements.meaningToggleButton.classList.toggle("is-on", state.meaningHiddenDuringTyping);
  elements.meaningToggleButton.setAttribute("aria-pressed", String(state.meaningHiddenDuringTyping));
  elements.meaningToggleButton.textContent = state.meaningHiddenDuringTyping ? "意味を表示" : "意味を隠す";
}

function saveProgress() {
  try {
    localStorage.setItem(
      "wordClimberProgress",
      JSON.stringify({
        currentLevel: state.currentLevel,
        selectedLevel: state.selectedLevel,
        dataSource: state.dataSource,
        xp: state.xp,
        score: state.score,
        combo: state.combo,
        bestCombo: state.bestCombo,
        total: state.total,
        correct: state.correct,
        keyTotal: state.keyTotal,
        keyCorrect: state.keyCorrect,
        meaningHiddenDuringTyping: state.meaningHiddenDuringTyping,
      }),
    );
  } catch {
    elements.feedbackLabel.textContent = "進行の保存が使えませんが、ゲームは続けられます。";
  }
}

function resetRunState(levelIndex = state.selectedLevel) {
  state.selectedLevel = Math.min(levels.length - 1, Math.max(0, levelIndex));
  state.currentLevel = state.selectedLevel;
  state.currentWord = null;
  state.meaningRevealedForSpeech = false;
  state.typedIndex = 0;
  state.typedText = "";
  state.wordIndex = 0;
  state.xp = 0;
  state.score = 0;
  state.combo = 0;
  state.bestCombo = 0;
  state.total = 0;
  state.correct = 0;
  state.keyTotal = 0;
  state.keyCorrect = 0;
  state.runStartedAt = 0;
  state.runId = String(Date.now());
  clearInterval(state.timerId);
  elements.timerLabel.textContent = "00.0s";
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  elements.typingInput.value = "";
  elements.typingInput.disabled = true;
  elements.startButton.textContent = "Start";
  elements.endButton.disabled = true;
  elements.meaningLabel.textContent = "準備ができたらスタート";
  elements.meaningLabel.classList.remove("is-hidden");
  elements.difficultyBadge.textContent = levels[state.selectedLevel].name;
  elements.wordCountBadge.textContent = "0 / 10";
  updateMeaningDisplay();
  renderWordDisplay();
}

function selectLevel(levelIndex) {
  resetRunState(levelIndex);
  buildLevelSelect();
  render();
  saveProgress();
  elements.feedbackLabel.textContent = `${levels[state.selectedLevel].name} だけを出題します。Startで始められます。`;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      cell += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(cell.trim());
      cell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      cell = "";
      continue;
    }

    cell += char;
  }

  row.push(cell.trim());
  if (row.some(Boolean)) rows.push(row);
  return rows;
}

function buildLevelsFromCsv(text) {
  const rows = parseCsv(text.replace(/^\uFEFF/, ""));
  if (rows.length === 0) throw new Error("CSVに単語がありません。");

  const header = rows[0].map((cell) => cell.toLowerCase());
  const hasHeader = header.includes("word") && header.includes("meaning");
  const hasLevelColumn = hasHeader ? header.includes("level") : rows[0].length >= 3;
  const wordIndex = hasHeader ? header.indexOf("word") : hasLevelColumn ? 1 : 0;
  const meaningIndex = hasHeader ? header.indexOf("meaning") : hasLevelColumn ? 2 : 1;
  const categoryIndex = hasHeader ? header.indexOf("category") : -1;
  const levelIndex = hasHeader ? header.indexOf("level") : 0;
  const dataRows = hasHeader ? rows.slice(1) : rows;
  const groups = new Map();

  dataRows.forEach((row) => {
    const word = (row[wordIndex] || "").trim();
    const meaning = (row[meaningIndex] || "").trim();
    const category = categoryIndex >= 0 ? (row[categoryIndex] || "").trim() : "";
    const rawLevel = hasLevelColumn ? (row[levelIndex] || "1").trim() || "1" : "1";
    if (!word || !meaning) return;
    if (!/^[a-zA-Z][a-zA-Z'-]*$/.test(word)) return;
    if (!groups.has(rawLevel)) groups.set(rawLevel, []);
    groups.get(rawLevel).push({
      word,
      meaning,
      category,
      acceptedInputs: [word.toLowerCase()],
      primaryInput: word.toLowerCase(),
    });
  });

  if (groups.size === 0) throw new Error("word と meaning が入った行が見つかりません。");

  const xpSteps = [5, 12, 22, 36, 52, 72, 96, 124];
  return [...groups.entries()].sort(([a], [b]) => (levelOrder[a] || 99) - (levelOrder[b] || 99)).map(([name, words], index) => ({
    name: /^\d+$/.test(name) ? `Level ${name}` : name,
    rank: index === 0 ? "Custom" : `Custom ${index + 1}`,
    note: "CSVから読み込んだ単語リスト。",
    xpToNext: xpSteps[index] || xpSteps[xpSteps.length - 1] + (index - xpSteps.length + 1) * 32,
    words,
  }));
}

function loadCsvFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      levels = buildLevelsFromCsv(String(reader.result || ""));
      state.dataSource = `csv:${file.name}`;
      resetRunState(0);
      buildLevelList();
      buildLevelSelect();
      render();
      elements.csvNameLabel.textContent = file.name;
      elements.feedbackLabel.textContent = `${file.name} を読み込みました。Startで始められます。`;
      try {
        localStorage.removeItem("wordClimberProgress");
      } catch {
        // 保存が使えない環境でも、読み込みは続けます。
      }
    } catch (error) {
      elements.feedbackLabel.textContent = error.message;
    }
  };
  reader.readAsText(file, "UTF-8");
}

function loadDefaultCsv() {
  if (!window.DEFAULT_WORDS_CSV) return;

  try {
    levels = buildLevelsFromCsv(window.DEFAULT_WORDS_CSV);
    state.dataSource = "default-eiken-v1";
    state.selectedLevel = 0;
    state.currentLevel = 0;
    elements.csvNameLabel.textContent = "eiken_words.csv コア練習リストを標準使用中";
  } catch {
    elements.csvNameLabel.textContent = "標準リストを使用中";
  }
}

function applySavedProgress() {
  if (!savedProgress) return;
  if (savedProgress.dataSource !== state.dataSource) return;

  state.selectedLevel = Math.min(levels.length - 1, savedProgress.selectedLevel ?? savedProgress.currentLevel ?? 0);
  state.currentLevel = state.selectedLevel;
  state.xp = savedProgress.xp || 0;
  state.score = savedProgress.score || 0;
  state.combo = savedProgress.combo || 0;
  state.bestCombo = savedProgress.bestCombo || 0;
  state.total = savedProgress.total || 0;
  state.correct = savedProgress.correct || 0;
  state.keyTotal = savedProgress.keyTotal || 0;
  state.keyCorrect = savedProgress.keyCorrect || 0;
  state.meaningHiddenDuringTyping = Boolean(savedProgress.meaningHiddenDuringTyping);
}

function speakCurrentWord() {
  if (!state.soundOn || !("speechSynthesis" in window) || !state.currentWord) return;

  window.speechSynthesis.cancel();
  const english = new SpeechSynthesisUtterance(state.currentWord.word);
  english.lang = "en-US";
  english.rate = 0.82;
  english.pitch = 1;

  window.speechSynthesis.speak(english);
}

function speakMeaningThenContinue(wordEntry, onComplete) {
  state.meaningRevealedForSpeech = true;
  updateMeaningDisplay();

  if (!state.soundOn || !("speechSynthesis" in window) || !wordEntry?.meaning) {
    setTimeout(() => {
      state.meaningRevealedForSpeech = false;
      onComplete();
    }, 1400);
    return;
  }

  window.speechSynthesis.cancel();
  const speechText = wordEntry.meaning;
  const japanese = new SpeechSynthesisUtterance(speechText);
  japanese.lang = "ja-JP";
  japanese.rate = 0.9;
  japanese.pitch = 1;

  let completed = false;
  const continueOnce = () => {
    if (completed) return;
    completed = true;
    state.meaningRevealedForSpeech = false;
    onComplete();
  };

  japanese.onend = continueOnce;
  japanese.onerror = continueOnce;
  window.speechSynthesis.speak(japanese);
  setTimeout(continueOnce, Math.min(9000, Math.max(2500, speechText.length * 360 + 800)));
}

function startTimer() {
  state.roundStartedAt = performance.now();
  clearInterval(state.timerId);
  state.timerId = setInterval(() => {
    const seconds = (performance.now() - state.roundStartedAt) / 1000;
    elements.timerLabel.textContent = `${seconds.toFixed(1)}s`;
  }, 100);
}

function render() {
  state.currentLevel = state.selectedLevel;
  const level = levels[state.selectedLevel];
  const progress = Math.min(100, (state.correct / 10) * 100);
  const accuracy = state.keyTotal === 0 ? 100 : Math.round((state.keyCorrect / state.keyTotal) * 100);
  const [rankIcon, rankName] = getRankName(state.score);
  const target = targetWordCounts[level.name];
  const coverageNote = target ? `収録 ${level.words.length}語 / 目安 ${target}語` : `${level.words.length}語`;

  elements.levelLabel.textContent = String(state.selectedLevel + 1);
  elements.xpLabel.textContent = String(state.xp);
  elements.scoreLabel.textContent = state.score.toLocaleString();
  elements.comboLabel.textContent = String(state.combo);
  elements.accuracyLabel.textContent = `${accuracy}%`;
  elements.levelProgress.style.width = `${progress}%`;
  elements.nextLevelLabel.textContent = `${level.name} だけ出題中`;
  elements.difficultyBadge.textContent = level.name;
  elements.wordCountBadge.textContent = `${Math.min(state.wordIndex, 10)} / 10`;
  elements.rankIcon.textContent = rankIcon;
  elements.rankLabel.textContent = rankName;
  elements.rankNote.textContent = `${level.name} / ${state.score.toLocaleString()} pt / ${coverageNote}`;
  elements.missionProgress.style.width = `${Math.min(100, (state.correct / 10) * 100)}%`;
  elements.comboProgress.style.width = `${Math.min(100, (state.bestCombo / 5) * 100)}%`;

  elements.levelSelect.value = String(state.selectedLevel);
  [...elements.levelList.children].forEach((item, index) => {
    item.classList.toggle("is-current", index === state.selectedLevel);
  });
  updateMeaningDisplay();
  renderRanking();
}

function addXp(seconds) {
  const speedBonus = seconds < 3 ? 2 : seconds < 6 ? 1 : 0;
  const comboBonus = state.combo >= 5 ? 2 : state.combo >= 3 ? 1 : 0;
  state.xp += 1 + speedBonus + comboBonus;
}

function addScore(seconds) {
  const wordLength = state.currentWord.primaryInput.length;
  const levelBonus = 1 + state.selectedLevel * 0.18;
  const speedBonus = Math.max(1, 3.2 - seconds * 0.22);
  const comboBonus = 1 + Math.min(state.combo, 20) * 0.05;
  const accuracy = state.keyTotal === 0 ? 1 : state.keyCorrect / state.keyTotal;
  const points = Math.round(wordLength * 24 * levelBonus * speedBonus * comboBonus * accuracy);
  const safePoints = Math.max(10, points);
  state.score += safePoints;
  return safePoints;
}

function checkLevelUp() {
  return false;
}

function showWord(feedback = "落ち着いて正確に。コンボでXPが伸びます。") {
  pickWord();
  state.meaningRevealedForSpeech = false;
  if (!state.runStartedAt) state.runStartedAt = performance.now();
  elements.typingInput.value = "";
  elements.typingInput.disabled = false;
  elements.typingInput.readOnly = true;
  elements.typingInput.focus();
  updateMeaningDisplay();
  renderWordDisplay();
  elements.hintLabel.textContent = "正しいキーだけ進みます。間違えたキーは受け付けません。";
  elements.feedbackLabel.textContent = feedback;
  elements.startButton.textContent = "Skip";
  elements.endButton.disabled = false;
  startTimer();
  speakCurrentWord();
  render();
}

function getRunSeconds() {
  if (!state.runStartedAt) return 0;
  return (performance.now() - state.runStartedAt) / 1000;
}

function openEndDialog() {
  if (state.score <= 0) {
    elements.feedbackLabel.textContent = "まだ登録できるスコアがありません。1問クリアしてから終了できます。";
    return;
  }

  elements.typingInput.disabled = true;
  clearInterval(state.timerId);
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();

  const accuracy = state.keyTotal === 0 ? 100 : Math.round((state.keyCorrect / state.keyTotal) * 100);
  elements.endSummary.textContent = `${levels[state.selectedLevel].name} / ${state.score.toLocaleString()} pt / ${state.correct}語 / 正確さ ${accuracy}%`;
  try {
    elements.playerNameInput.value = localStorage.getItem("wordClimberPlayerName") || "";
  } catch {
    elements.playerNameInput.value = "";
  }

  if (typeof elements.endDialog.showModal === "function") {
    elements.endDialog.showModal();
    elements.playerNameInput.focus();
    return;
  }

  const fallbackName = window.prompt("ランキングに登録する名前", elements.playerNameInput.value || "Player");
  if (fallbackName !== null) finishRun(fallbackName);
}

function finishRun(playerName) {
  const safeName = playerName.trim() || "Player";
  state.playerName = safeName;
  try {
    localStorage.setItem("wordClimberPlayerName", safeName);
  } catch {
    // 名前の保存に失敗しても、今回のランキング登録は続けます。
  }

  const rankingPosition = recordRanking(state.score, getRunSeconds());
  const message = rankingPosition
    ? `${safeName} さんの記録を登録しました。現在 ${rankingPosition}位です。`
    : `${safeName} さんの記録を登録しました。`;
  resetRunState(state.selectedLevel);
  render();
  elements.feedbackLabel.textContent = message;
}

function submitAnswer() {
  if (!state.currentWord) {
    showWord();
    return;
  }

  const answer = state.typedText.toLowerCase();
  state.total += 1;

  if (state.currentWord.acceptedInputs.includes(answer)) {
    const seconds = (performance.now() - state.roundStartedAt) / 1000;
    state.correct += 1;
    state.combo += 1;
    state.bestCombo = Math.max(state.bestCombo, state.combo);
    addXp(seconds);
    const points = addScore(seconds);
    checkLevelUp();
    saveProgress();
    const message = `Great! +${points} pt  +Combo ${state.combo}`;
    burst(18 + Math.min(24, state.combo * 3));
    const completedWord = state.currentWord;
    elements.typingInput.disabled = true;
    elements.feedbackLabel.textContent = "正解。意味を聞いてから次へ進みます。";
    render();
    speakMeaningThenContinue(completedWord, () => showWord(message));
    return;
  }

  state.combo = 0;
  saveProgress();
  elements.typingInput.classList.add("is-wrong");
  elements.feedbackLabel.textContent = `もう一度。正解は ${state.currentWord.word}`;
  setTimeout(() => elements.typingInput.classList.remove("is-wrong"), 260);
  render();
}

function rejectKey() {
  state.keyTotal += 1;
  elements.wordDisplay.classList.remove("is-shaking");
  elements.wordDisplay.offsetWidth;
  elements.wordDisplay.classList.add("is-shaking");
  elements.feedbackLabel.textContent = "そのキーでは進みません。次の文字を見て打とう。";
  render();
}

function acceptKey(nextText) {
  state.keyTotal += 1;
  state.keyCorrect += 1;
  state.typedText = nextText;
  state.typedIndex = nextText.length;
  elements.typingInput.value = state.typedText;
  renderWordDisplay();
  elements.feedbackLabel.textContent = "Good. その調子。";

  if (state.currentWord.acceptedInputs.includes(state.typedText)) {
    submitAnswer();
    return;
  }

  render();
}

function handleTypingKey(event) {
  if (!state.currentWord || elements.typingInput.disabled) return;

  if (event.key === "Backspace" || event.key === "Delete") {
    event.preventDefault();
    rejectKey();
    return;
  }

  if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) return;

  event.preventDefault();
  const pressed = event.key.toLowerCase();
  const nextText = `${state.typedText}${pressed}`;

  if (state.currentWord.acceptedInputs.some((candidate) => candidate.startsWith(nextText))) {
    acceptKey(nextText);
    return;
  }

  rejectKey();
}

function burst(count) {
  const rect = elements.canvas.getBoundingClientRect();
  for (let index = 0; index < count; index += 1) {
    state.particles.push({
      x: rect.width / 2 + (Math.random() - 0.5) * 120,
      y: rect.height / 2 + (Math.random() - 0.5) * 80,
      vx: (Math.random() - 0.5) * 8,
      vy: -Math.random() * 7 - 1,
      size: Math.random() * 7 + 4,
      life: 70,
      color: ["#24a176", "#1696a7", "#f2b84b", "#df5b69", "#3867d6"][Math.floor(Math.random() * 5)],
    });
  }
}

function drawParticles() {
  const rect = elements.canvas.getBoundingClientRect();
  const scale = window.devicePixelRatio || 1;
  if (elements.canvas.width !== Math.floor(rect.width * scale)) {
    elements.canvas.width = Math.floor(rect.width * scale);
    elements.canvas.height = Math.floor(rect.height * scale);
  }

  canvasContext.setTransform(scale, 0, 0, scale, 0, 0);
  canvasContext.clearRect(0, 0, rect.width, rect.height);
  state.particles = state.particles.filter((particle) => particle.life > 0);

  state.particles.forEach((particle) => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vy += 0.18;
    particle.life -= 1;
    canvasContext.globalAlpha = Math.max(0, particle.life / 70);
    canvasContext.fillStyle = particle.color;
    canvasContext.fillRect(particle.x, particle.y, particle.size, particle.size);
  });

  canvasContext.globalAlpha = 1;
  requestAnimationFrame(drawParticles);
}

elements.startButton.addEventListener("click", () => showWord());

elements.endButton.addEventListener("click", openEndDialog);

elements.cancelEndButton.addEventListener("click", () => {
  elements.endDialog.close();
  elements.typingInput.disabled = false;
  elements.typingInput.focus();
  startTimer();
});

elements.endForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const playerName = elements.playerNameInput.value;
  elements.endDialog.close();
  finishRun(playerName);
});

elements.typingForm.addEventListener("submit", (event) => {
  event.preventDefault();
});

elements.typingInput.addEventListener("keydown", handleTypingKey);
document.addEventListener("keydown", (event) => {
  if (document.activeElement !== elements.typingInput) handleTypingKey(event);
});

elements.csvInput.addEventListener("change", (event) => {
  const [file] = event.target.files;
  if (file) loadCsvFile(file);
  event.target.value = "";
});

elements.levelSelect.addEventListener("change", () => {
  selectLevel(Number(elements.levelSelect.value));
});

elements.soundButton.addEventListener("click", () => {
  state.soundOn = !state.soundOn;
  elements.soundButton.classList.toggle("is-off", !state.soundOn);
  elements.soundButton.setAttribute("aria-pressed", String(state.soundOn));
  if (state.soundOn) speakCurrentWord();
  if (!state.soundOn && "speechSynthesis" in window) window.speechSynthesis.cancel();
});

elements.meaningToggleButton.addEventListener("click", () => {
  state.meaningHiddenDuringTyping = !state.meaningHiddenDuringTyping;
  updateMeaningDisplay();
  saveProgress();
});

loadDefaultCsv();
applySavedProgress();
buildLevelList();
buildLevelSelect();
render();
drawParticles();
