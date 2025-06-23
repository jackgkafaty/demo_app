// ...existing code...
// Middleware to filter/block PII in AI prompts
const PII_REGEXES = [
  /(\d{4}[-\s]?){3,4}/g,           // credit cards
  /\d{9,12}/g,                     // bank accounts
  /(?:[A-Z]{2,3}\d{6,10})/g,       // tax IDs
  /[A-Za-z0-9._%+-]+@/g,            // email addresses
];

function filterPII(req, res, next) {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid messages format' });
  }
  for (const msg of messages) {
    for (const regex of PII_REGEXES) {
      if (regex.test(msg.content)) {
        return res.status(400).json({ error: 'PII detected in message. Submission blocked.' });
      }
    }
  }
  next();
}

module.exports = { filterPII };
// ...existing code...
