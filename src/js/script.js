// Data Quiz
const quizData = [
  {
    question: "Apa ibu kota Indonesia?",
    type: "multiple",
    options: ["Jakarta", "Bandung", "Surabaya", "Medan"],
    answer: "Jakarta",
    points: 10,
  },
  {
    question: "2 + 2 = ?",
    type: "fill",
    answer: "4",
    points: 5,
  },
  {
    question: "Siapa penemu lampu pijar?",
    type: "multiple",
    options: [
      "Thomas Edison",
      "Albert Einstein",
      "Isaac Newton",
      "Nikola Tesla",
    ],
    answer: "Thomas Edison",
    points: 10,
  },
  {
    question: "Apa singkatan dari HTML?",
    type: "fill",
    answer: "HyperText Markup Language",
    points: 5,
  },
  {
    question: "Berapakah luas Indonesia?",
    type: "fill",
    answer: "1.904.569 km²",
    points: 10,
  },
  {
    question: "Manakah yang merupakan bahasa pemrograman?",
    type: "multiple",
    options: ["HTML", "CSS", "JavaScript", "HTTP"],
    answer: "JavaScript",
    points: 10,
  },
  {
    question: "Apa singkatan dari CSS?",
    type: "fill",
    answer: "Cascading Style Sheets",
    points: 5,
  },
  {
    question: "Manakah yang bukan merupakan framework JavaScript?",
    type: "multiple",
    options: ["React", "Angular", "Laravel", "Vue"],
    answer: "Laravel",
    points: 10,
  },
  {
    question: "Berapakah nilai maksimal yang bisa didapatkan dalam quiz ini?",
    type: "fill",
    answer: "150",
    points: 10,
  },
  {
    question: "Apa fungsi dari Git dalam pengembangan perangkat lunak?",
    type: "fill",
    answer: "Version Control",
    points: 10,
  },
];

// State Quiz: Menyimpan status setiap pertanyaan
let quizState = quizData.map(() => ({
  answered: false,
  answer: "",
  timeLeft: 30,
  locked: false,
}));

let currentQuestion = 0;
let score = 0;
let timer = null;

// Element References
const homePage = document.getElementById("home-page");
const startButton = document.getElementById("start-button");
const landingPage = document.getElementById("landing-page");
const toDashboardButton = document.getElementById("to-dashboard-button");
const dashboard = document.getElementById("dashboard");
const form = document.getElementById("form");
const quizPage = document.getElementById("quiz-page");
const questionContainer = document.getElementById("question-container");
const optionsContainer = document.getElementById("options-container");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const timerElement = document.getElementById("timer");
const progressElement = document.getElementById("progress");
const statusElement = document.getElementById("status");
const resultPage = document.getElementById("result-page");
const resultName = document.getElementById("result-name");
const resultNim = document.getElementById("result-nim");
const resultScore = document.getElementById("result-score");
const extraInfo = document.getElementById("extra-info");
const reviewTableBody = document.getElementById("review-table-body");
const restartButton = document.getElementById("restart-button");

// Data Pemain
let player = {
  name: "",
  nim: "",
};

// Event Listeners
startButton.addEventListener("click", () => {
  homePage.classList.add("hidden");
  landingPage.classList.remove("hidden");
});

toDashboardButton.addEventListener("click", () => {
  landingPage.classList.add("hidden");
  dashboard.classList.remove("hidden");
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  player.name = document.getElementById("name").value.trim();
  player.nim = document.getElementById("nim").value.trim();
  if (player.name && player.nim) {
    dashboard.classList.add("hidden");
    quizPage.classList.remove("hidden");
    loadQuestion();
    startTimer();
    updateProgress();
    updateStatus();
  } else {
    alert("Harap masukkan semua data.");
  }
});

prevButton.addEventListener("click", () => {
  saveAnswer();
  if (currentQuestion > 0) {
    const prevQuestionState = quizState[currentQuestion - 1];
    if (!prevQuestionState.locked) {
      currentQuestion--;
      loadQuestion();
      resetTimer();
      updateProgress();
    }
  }
});

nextButton.addEventListener("click", () => {
  saveAnswer();
  if (currentQuestion < quizData.length - 1) {
    currentQuestion++;
    loadQuestion();
    resetTimer();
    updateProgress();
  } else {
    endQuiz();
  }
});

restartButton.addEventListener("click", () => {
  // Reset state
  currentQuestion = 0;
  score = 0;
  quizState = quizData.map(() => ({
    answered: false,
    answer: "",
    timeLeft: 30,
    locked: false,
  }));
  clearInterval(timer);
  quizPage.classList.add("hidden");
  resultPage.classList.add("hidden");
  reviewTableBody.innerHTML = "";
  homePage.classList.remove("hidden");
});

// Functions
function loadQuestion() {
  const data = quizData[currentQuestion];
  const state = quizState[currentQuestion];
  questionContainer.innerHTML = `<h3 class="text-xl font-semibold mb-2">Soal ${
    currentQuestion + 1
  }: ${data.question}</h3>`;
  optionsContainer.innerHTML = "";

  if (data.type === "multiple") {
    data.options.forEach((option) => {
      const optionElement = document.createElement("div");
      optionElement.classList.add("mb-2");
      optionElement.innerHTML = `
      <label class="flex items-center">
        <input type="radio" name="option" value="${option}" class="mr-2">
        ${option}
      </label>
    `;
      optionsContainer.appendChild(optionElement);
    });
  } else if (data.type === "fill") {
    optionsContainer.innerHTML = `<input type="text" id="fill-answer" class="mt-1 p-2 border rounded w-full" placeholder="Jawaban Anda">`;
  }

  // Load previous answer if exists
  if (quizState[currentQuestion].answer !== "") {
    if (data.type === "multiple") {
      const radios = document.getElementsByName("option");
      radios.forEach((radio) => {
        if (radio.value === quizState[currentQuestion].answer) {
          radio.checked = true;
        }
      });
    } else if (data.type === "fill") {
      document.getElementById("fill-answer").value =
        quizState[currentQuestion].answer;
    }
  }

  // Update timer display
  timerElement.textContent = `${quizState[currentQuestion].timeLeft}s`;

  // Disable 'prev' button if current question is locked or first question
  if (
    currentQuestion === 0 ||
    (currentQuestion > 0 && quizState[currentQuestion - 1].locked)
  ) {
    prevButton.disabled = true;
    prevButton.classList.add("opacity-50", "cursor-not-allowed");
  } else {
    const prevQuestionState = quizState[currentQuestion - 1];
    prevButton.disabled = prevQuestionState.locked;
    if (prevQuestionState.locked) {
      prevButton.classList.add("opacity-50", "cursor-not-allowed");
    } else {
      prevButton.classList.remove("opacity-50", "cursor-not-allowed");
    }
  }

  // Disable 'next' button if current question is locked
  if (quizState[currentQuestion].locked) {
    nextButton.disabled = true;
    nextButton.classList.add("opacity-50", "cursor-not-allowed");
  } else {
    nextButton.disabled = false;
    nextButton.classList.remove("opacity-50", "cursor-not-allowed");
  }
}

function saveAnswer() {
  const data = quizData[currentQuestion];
  const state = quizState[currentQuestion];
  let answer = "";

  if (data.type === "multiple") {
    const selected = document.querySelector('input[name="option"]:checked');
    answer = selected ? selected.value : "";
  } else if (data.type === "fill") {
    const fillAnswer = document.getElementById("fill-answer").value.trim();
    answer = fillAnswer;
  }

  if (answer !== "") {
    state.answered = true;
    state.answer = answer;
  } else {
    state.answered = false;
    state.answer = "";
  }

  updateStatus();
}

function startTimer() {
  clearInterval(timer);
  const state = quizState[currentQuestion];
  if (state.locked) return; // Tidak perlu memulai timer jika sudah terkunci

  timer = setInterval(() => {
    if (state.timeLeft > 0) {
      state.timeLeft--;
      timerElement.textContent = `${state.timeLeft}s`;

      if (state.timeLeft === 0) {
        clearInterval(timer);
        state.locked = true;
        // Auto-navigate to next question jika masih ada
        if (currentQuestion < quizData.length - 1) {
          currentQuestion++;
          loadQuestion();
          startTimer();
          updateProgress();
        } else {
          endQuiz();
        }
      }
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  startTimer();
}

function updateProgress() {
  progressElement.textContent = `Soal ${currentQuestion + 1} / ${
    quizData.length
  }`;
}

function updateStatus() {
  const completed = quizState.filter((q) => q.answered).length;
  statusElement.textContent = `Soal sudah dikerjakan: ${completed} / ${quizData.length}`;
}

function endQuiz() {
  clearInterval(timer);
  saveAnswer();
  calculateScore();
  quizPage.classList.add("hidden");
  resultPage.classList.remove("hidden");
}

function calculateScore() {
  score = 0;
  reviewTableBody.innerHTML = ""; // Clear previous review if any
  quizData.forEach((item, index) => {
    const state = quizState[index];
    const userAnswer = state.answer !== "" ? state.answer : "Tidak Dijawab";
    const correctAnswer = item.answer;
    let isCorrect = false;

    if (item.type === "multiple") {
      if (userAnswer === correctAnswer) {
        score += item.points;
        isCorrect = true;
      }
    } else if (item.type === "fill") {
      if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
        score += item.points;
        isCorrect = true;
      }
    }

    // Tambahkan baris ke tabel review
    const row = document.createElement("tr");
    row.classList.add("text-center");
    row.innerHTML = `
    <td class="px-4 py-2 border">${index + 1}</td>
    <td class="px-4 py-2 border">${item.question}</td>
    <td class="px-4 py-2 border">${userAnswer}</td>
    <td class="px-4 py-2 border">${correctAnswer}</td>
    <td class="px-4 py-2 border ${
      isCorrect ? "text-green-600" : "text-red-600"
    } font-semibold">
      ${isCorrect ? "Benar" : "Salah"}
    </td>
  `;
    reviewTableBody.appendChild(row);
  });

  // Menampilkan Hasil
  resultName.textContent = player.name;
  resultNim.textContent = player.nim;
  resultScore.textContent = score;

  // // Menentukan apakah poin melebihi 100
  // if (score > 100) {
  //   extraInfo.classList.remove("hidden");
  // } else {
  //   extraInfo.classList.add("hidden");
  // }
}
