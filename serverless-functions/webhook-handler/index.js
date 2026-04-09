require('dotenv').config();

const express = require('express');
const cors = require('cors');

const validateTwilioRequest = require('./middleware/validateTwilioRequest');
const errorHandler = require('./middleware/errorHandler');
const handleTaskRouterEvents = require('./controllers/taskRouterEventsHandler');
const getLatestTaskHandler = require('./controllers/getLatestTaskHandler');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get('/', getLatestTaskHandler);
app.post('/taskrouter/events', validateTwilioRequest, handleTaskRouterEvents);

// Error handling middleware (must be last)
app.use(errorHandler);

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => {
  console.log(`Webhook handler listening on port ${port}`);
});
