const express = require('express');
const router = express.Router();

router.get('/status', (req, res) => {
  res.json({ status: 'ok' });
});

router.post('/item', (req, res) => {
  const { nome } = req.body;
  res.json({ recebido: nome });
});

module.exports = router;