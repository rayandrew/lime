'use strict';

const express = require('express');
const router = express.Router();
const config = require('config');
const line = require('@line/bot-sdk').Client;
const winston = require('../components/winston');

const lineClient = new line(config.get('line'));

router.post('/', (req, res, next) => {
  Promise
  .all(req.body.events.map(handleEvent))
  .then((result) => res.json(result));
});

function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  return lineClient.replyMessage(event.replyToken, {
    type: 'text',
    text: event.message.text
  });
}

module.exports = router;