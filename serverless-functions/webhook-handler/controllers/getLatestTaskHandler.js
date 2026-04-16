const { readEvents } = require('../utils/eventsStore');

/**
 * Get the latest task from the in-memory events store
 */
const getLatestTaskHandler = (req, res, next) => {
  try {
    const events = readEvents();

    if (events.length === 0) {
      return res.status(200).json([]);
    }

    // Get the latest task (last one in the array) and return as array
    const latestTask = events[events.length - 1];

    return res.status(200).json([latestTask]);
  } catch (error) {
    const err = new Error(error.message || 'Failed to retrieve task');
    err.status = 500;
    next(err);
  }
};

module.exports = getLatestTaskHandler;
