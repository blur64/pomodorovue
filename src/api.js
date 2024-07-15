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
