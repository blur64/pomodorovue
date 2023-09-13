// It will be better if uniqueness of timers defined by 
// location in array by indexes. First index always has
// pomodoro, second - short break, third - long break. 
const initialTimersSettings = [
  { id: 0, name: "Pomodoro", timeInMinutes: 25 },
  { id: 1, name: "Short Break", timeInMinutes: 5 },
  { id: 2, name: "Long Break", timeInMinutes: 10 },
];

const soundSettings = {
  path: require("./assets/clockAlarm.mp3"),
  volume: 0.5,
};

const initialAutoStartingSettings = {
  autoStart: false,
  longBreakInterval: 2,
};

function getTimersSettings() {
  return (
    JSON.parse(localStorage.getItem("timersSettings")) || initialTimersSettings
  );
}

function saveTimersSettings(newSettings) {
  localStorage.setItem("timersSettings", JSON.stringify(newSettings));
}

function getSoundSettings() {
  return soundSettings;
}

function getAutoStartingSettings() {
  return initialAutoStartingSettings;
}

export {
  saveTimersSettings, getTimersSettings,
  getSoundSettings, getAutoStartingSettings
};
