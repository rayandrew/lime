'use strict';

const express = require('express');
const router = express.Router();
const LineModel = require('../models/line').lineModel;
const winston = require('../components/winston');

router.get('/:page?', (req, res, next) => {
  let options = {
    select: '-_id',
    lean: true,
    page: req.params.page ? parseInt(req.params.page, 10) : 1, 
    leanWithId: false,
    limit: 10
  };

  LineModel.paginate({}, options, (err, users) => {
    if (err) {
      winston.error(err);
      next(err);
    }

    res.status(200).send(users);
  });
});

module.exports = router;