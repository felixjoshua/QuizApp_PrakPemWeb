<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Aplikasi Quiz</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">

  <!-- Home/Landing Page -->
  <div id="home-page" class="flex flex-col items-center justify-center h-screen">
    <h1 class="text-4xl font-bold mb-6">Selamat Datang di Aplikasi Quiz</h1>
    <button id="start-button" class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Mulai Quiz</button>
  </div>

  <!-- Form Data Pemain -->
  <div id="player-form" class="hidden flex flex-col items-center justify-center h-screen">
    <h2 class="text-2xl font-semibold mb-4">Masukkan Data Pemain</h2>
    <form id="form" class="bg-white p-6 rounded-lg shadow-md">
      <div class="mb-4">
        <label class="block text-gray-700">Nama:</label>
        <input type="text" id="name" class="mt-1 p-2 border rounded w-64" required>
      </div>
      <div class="mb-4">
        <label class="block text-gray-700">NIM:</label>
        <input type="text" id="nim" class="mt-1 p-2 border rounded w-64" required>
      </div>
      <button type="submit" class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600">Mulai Quiz</button>
    </form>
  </div>

  <!-- Halaman Quiz -->
  <div id="quiz-page" class="hidden flex flex-col items-center justify-center min-h-screen p-4">
    <div class="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
      <div class="flex justify-between mb-4">
        <div id="timer" class="text-lg font-semibold">30s</div>
        <div id="progress" class="text-lg font-semibold">Soal 1 / 10</div>
      </div>
      <div id="question-container" class="mb-4">
        <!-- Pertanyaan akan dimasukkan di sini -->
      </div>
      <div id="options-container" class="mb-4">
        <!-- Opsi jawaban akan dimasukkan di sini -->
      </div>
      <div class="flex justify-between">
        <button id="prev-button" class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">Sebelumnya</button>
        <button id="next-button" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Berikutnya</button>
      </div>
      <div class="mt-4">
        <span id="status" class="text-sm text-gray-600">Soal sudah dikerjakan: 0 / 10</span>
      </div>
    </div>
  </div>

  <!-- Halaman Hasil -->
  <div id="result-page" class="hidden flex flex-col items-center justify-center h-screen">
    <h2 class="text-3xl font-semibold mb-6">Hasil Quiz</h2>
    <div class="bg-white p-6 rounded-lg shadow-md w-80">
      <p><strong>Nama:</strong> <span id="result-name"></span></p>
      <p><strong>NIM:</strong> <span id="result-nim"></span></p>
      <p><strong>Nilai Total:</strong> <span id="result-score"></span></p>
      <p><strong>Nilai Rata-rata (Asprak):</strong> <span id="result-average"></span></p>
      <p id="extra-info" class="mt-2 text-sm text-gray-700 hidden">Anda dapat menyimpan poin lebih dari 100 untuk memperbaiki nilai di modul lain.</p>
    </div>
    <button id="restart-button" class="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Ulangi Quiz</button>
  </div>

  <!-- JavaScript -->
  <script>
    // Data Quiz
    const quizData = [
      {
        question: "Apa ibu kota Indonesia?",
        type: "multiple",
        options: ["Jakarta", "Bandung", "Surabaya", "Medan"],
        answer: "Jakarta",
        points: 10
      },
      {
        question: "2 + 2 = ?",
        type: "fill",
        answer: "4",
        points: 5
      },
      {
        question: "Siapa penemu lampu pijar?",
        type: "multiple",
        options: ["Thomas Edison", "Albert Einstein", "Isaac Newton", "Nikola Tesla"],
        answer: "Thomas Edison",
        points: 10
      },
      {
        question: "Apa singkatan dari HTML?",
        type: "fill",
        answer: "HyperText Markup Language",
        points: 5
      },
      {
        question: "Berapakah luas Indonesia?",
        type: "fill",
        answer: "1.904.569 km²",
        points: 10
      },
      {
        question: "Manakah yang merupakan bahasa pemrograman?",
        type: "multiple",
        options: ["HTML", "CSS", "JavaScript", "HTTP"],
        answer: "JavaScript",
        points: 10
      },
      {
        question: "Apa singkatan dari CSS?",
        type: "fill",
        answer: "Cascading Style Sheets",
        points: 5
      },
      {
        question: "Manakah yang bukan merupakan framework JavaScript?",
        type: "multiple",
        options: ["React", "Angular", "Laravel", "Vue"],
        answer: "Laravel",
        points: 10
      },
      {
        question: "Berapakah nilai maksimal yang bisa didapatkan dalam quiz ini?",
        type: "fill",
        answer: "150",
        points: 10
      },
      {
        question: "Apa fungsi dari Git dalam pengembangan perangkat lunak?",
        type: "fill",
        answer: "Version Control",
        points: 10
      }
    ];

    // State Quiz
    let currentQuestion = 0;
    let score = 0;
    let timer;
    let timeLeft = 30;
    let answers = [];

    // Element References
    const homePage = document.getElementById('home-page');
    const startButton = document.getElementById('start-button');
    const playerForm = document.getElementById('player-form');
    const form = document.getElementById('form');
    const quizPage = document.getElementById('quiz-page');
    const questionContainer = document.getElementById('question-container');
    const optionsContainer = document.getElementById('options-container');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const timerElement = document.getElementById('timer');
    const progressElement = document.getElementById('progress');
    const statusElement = document.getElementById('status');
    const resultPage = document.getElementById('result-page');
    const resultName = document.getElementById('result-name');
    const resultNim = document.getElementById('result-nim');
    const resultScore = document.getElementById('result-score');
    const resultAverage = document.getElementById('result-average');
    const extraInfo = document.getElementById('extra-info');
    const restartButton = document.getElementById('restart-button');

    // Data Pemain
    let player = {
      name: '',
      nim: ''
    };

    // Event Listeners
    startButton.addEventListener('click', () => {
      homePage.classList.add('hidden');
      playerForm.classList.remove('hidden');
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      player.name = document.getElementById('name').value.trim();
      player.nim = document.getElementById('nim').value.trim();
      if (player.name && player.nim) {
        playerForm.classList.add('hidden');
        quizPage.classList.remove('hidden');
        loadQuestion();
        startTimer();
        updateProgress();
        updateStatus();
      } else {
        alert("Harap masukkan semua data.");
      }
    });

    prevButton.addEventListener('click', () => {
      saveAnswer();
      if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
        resetTimer();
        updateProgress();
      }
    });

    nextButton.addEventListener('click', () => {
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

    restartButton.addEventListener('click', () => {
      // Reset state
      currentQuestion = 0;
      score = 0;
      answers = [];
      quizPage.classList.add('hidden');
      resultPage.classList.add('hidden');
      homePage.classList.remove('hidden');
    });

    // Functions
    function loadQuestion() {
      const data = quizData[currentQuestion];
      questionContainer.innerHTML = `<h3 class="text-xl font-semibold mb-2">Soal ${currentQuestion + 1}: ${data.question}</h3>`;
      optionsContainer.innerHTML = '';

      if (data.type === 'multiple') {
        data.options.forEach(option => {
          const optionElement = document.createElement('div');
          optionElement.classList.add('mb-2');
          optionElement.innerHTML = `
            <label class="flex items-center">
              <input type="radio" name="option" value="${option}" class="mr-2">
              ${option}
            </label>
          `;
          optionsContainer.appendChild(optionElement);
        });
      } else if (data.type === 'fill') {
        optionsContainer.innerHTML = `<input type="text" id="fill-answer" class="mt-1 p-2 border rounded w-full" placeholder="Jawaban Anda">`;
      }

      // Load previous answer if exists
      if (answers[currentQuestion] !== undefined) {
        if (data.type === 'multiple') {
          const radios = document.getElementsByName('option');
          radios.forEach(radio => {
            if (radio.value === answers[currentQuestion]) {
              radio.checked = true;
            }
          });
        } else if (data.type === 'fill') {
          document.getElementById('fill-answer').value = answers[currentQuestion];
        }
      }
    }

    function saveAnswer() {
      const data = quizData[currentQuestion];
      let answer;
      if (data.type === 'multiple') {
        const selected = document.querySelector('input[name="option"]:checked');
        answer = selected ? selected.value : '';
      } else if (data.type === 'fill') {
        answer = document.getElementById('fill-answer').value.trim();
      }
      answers[currentQuestion] = answer;
      updateStatus();
    }

    function startTimer() {
      timeLeft = 30;
      timerElement.textContent = `${timeLeft}s`;
      timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `${timeLeft}s`;
        if (timeLeft <= 0) {
          clearInterval(timer);
          saveAnswer();
          if (currentQuestion < quizData.length - 1) {
            currentQuestion++;
            loadQuestion();
            resetTimer();
            updateProgress();
          } else {
            endQuiz();
          }
        }
      }, 1000);
    }

    function resetTimer() {
      clearInterval(timer);
      startTimer();
    }

    function updateProgress() {
      progressElement.textContent = `Soal ${currentQuestion + 1} / ${quizData.length}`;
    }

    function updateStatus() {
      const completed = answers.filter(ans => ans !== undefined && ans !== '').length;
      statusElement.textContent = `Soal sudah dikerjakan: ${completed} / ${quizData.length}`;
    }

    function endQuiz() {
      clearInterval(timer);
      saveAnswer();
      calculateScore();
      quizPage.classList.add('hidden');
      resultPage.classList.remove('hidden');
    }

    function calculateScore() {
      score = 0;
      quizData.forEach((item, index) => {
        if (answers[index]) {
          if (item.type === 'multiple') {
            if (answers[index] === item.answer) {
              score += item.points;
            }
          } else if (item.type === 'fill') {
            if (answers[index].toLowerCase() === item.answer.toLowerCase()) {
              score += item.points;
            }
          }
        }
      });

      // Simulasi Rata-rata Nilai dari 3 Asprak
      const asprakScores = generateAsprakScores(score);
      const averageScore = (asprakScores.reduce((a, b) => a + b, 0) / asprakScores.length).toFixed(2);

      // Menampilkan Hasil
      resultName.textContent = player.name;
      resultNim.textContent = player.nim;
      resultScore.textContent = score;

      // Menentukan apakah poin melebihi 100
      if (score > 100) {
        extraInfo.classList.remove('hidden');
      }

      resultAverage.textContent = averageScore;
    }

    function generateAsprakScores(totalScore) {
      // Menghasilkan tiga skor acak dari asprak yang berkisar antara totalScore -5 hingga totalScore +5
      // Pastikan skor tetap dalam rentang 0 hingga 150
      let scores = [];
      for (let i = 0; i < 3; i++) {
        let variation = Math.floor(Math.random() * 11) - 5; // -5 to +5
        let asprakScore = totalScore + variation;
        asprakScore = Math.max(0, Math.min(asprakScore, 150));
        scores.push(asprakScore);
      }
      return scores;
    }
  </script>
</body>
</html>