const fs = require("fs");
const path = require("path");

const EVENTS_FILE_PATH = path.join(__dirname, "..", "events.json");

function ensureEventsFileExists() {
  if (!fs.existsSync(EVENTS_FILE_PATH)) {
    fs.writeFileSync(EVENTS_FILE_PATH, "[]", "utf8");
  }
}

function readEvents() {
  ensureEventsFileExists();

  try {
    const raw = fs.readFileSync(EVENTS_FILE_PATH, "utf8");
    if (!raw || !raw.trim()) {
      fs.writeFileSync(EVENTS_FILE_PATH, "[]", "utf8");
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      fs.writeFileSync(EVENTS_FILE_PATH, "[]", "utf8");
      return [];
    }

    return parsed;
  } catch (err) {
    fs.writeFileSync(EVENTS_FILE_PATH, "[]", "utf8");
    return [];
  }
}

function writeEvents(events) {
  ensureEventsFileExists();
  const safe = Array.isArray(events) ? events : [];
  fs.writeFileSync(EVENTS_FILE_PATH, JSON.stringify(safe, null, 2), "utf8");
}

module.exports = {
  readEvents,
  writeEvents,
  EVENTS_FILE_PATH,
};

