let interval;
let minutes = 0;
let seconds = 0;
let isRunning = false;

const timeDisplay = document.getElementById('time');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');
const restartButton = document.getElementById('restartButton');
const minutesInput = document.getElementById('minutesInput');
const secondsInput = document.getElementById('secondsInput');

startButton.disabled = true;
resetButton.disabled = true;
restartButton.disabled = true;


function updateTime() {
  chrome.runtime.sendMessage({ action: 'updatePomodoro', minutes, seconds });
  timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
}

function startTimer() {
  startButton.disabled = true;

  minutes = Number(minutesInput.value);
  seconds = Number(secondsInput.value);

  resetButton.disabled = false
  restartButton.disabled = false

  if (!isRunning) {
    interval = setInterval(() => {
      if (minutes === 0 && seconds === 0) {
        clearInterval(interval);
        isRunning = false;
        alert('Time is up! Take a break.');
        startButton.disabled = false;
      } else {
        if (seconds === 0) {
          minutes--;
          seconds = 59;
        } else {
          seconds--;
        }
        updateTime();
      }
    }, 1000);
    isRunning = true;
    updateTime();
    chrome.runtime.sendMessage({ action: 'startPomodoro', minutes, seconds });
  }
}

function resetTimer() {
  clearInterval(interval);
  minutes = 0;
  seconds = 0;
  minutesInput.value = 0;
  secondsInput.value = 0;
  updateTime();
  isRunning = false;
  resetButton.disabled = true;
  restartButton.disabled = true;
  startButton.disabled = false;
  chrome.runtime.sendMessage({ action: 'resetPomodoro'});
}


startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);
restartButton.addEventListener('click', startTimer);

minutesInput.addEventListener('input', (e) => {
  const inputValue = e.target.value

  if (inputValue) {
    startButton.disabled = false
  }
})

secondsInput.addEventListener('input', (e) => {
  const inputValue = e.target.value

  if (inputValue) {
    startButton.disabled = false
  }
})


updateTime();
