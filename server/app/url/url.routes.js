'use strict';

const express = require('express');
const router = express.Router();
const config = require('config');
const line = require('@line/bot-sdk').Client;
const errors = require('http-errors');
const LineModel = require('../models/line').lineModel;
const UrlModel = require('../models/url').urlModel;
const winston = require('../components/winston');
const shortid = require('shortid');
const _ = require('lodash');

const lineClient = new line(config.get('line'));

const validator = (value) => {
  return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
}

router.get('/:url?', (req, res, next) => {
  if(!req.params.url) {
    return next(new errors.NotFound('Please input the short link!'))
  } else {
    LineModel.findOne({ links: { $elemMatch: { shortUrl: req.params.url } } }, { '_id': 0, 'user_id': 0 }).exec((err, url) => {
      if (err) {
        winston.error(err);
        next(err);
      }
      
      url ? res.status(200).json(url.links[0]) : next(new errors.NotFound('Link not found!')) 
    });
  }
});

router.post('/', (req, res, next) => {
  const post = _.pick(req.body, ['user_id', 'link']);

  if(!validator(post.link)) return next(new errors.NotAcceptable('URL is not acceptable! Make sure you input the valid URL'));

  const shorterUrl = new UrlModel({
    longUrl: post.link,
    shortUrl: shortid.generate()
  });

  LineModel.findOne({ user_id: post.user_id }).select('user_id links').exec((err, lineUser) => {
    if (err) {
      winston.error(err);
      next(err);
    }

    if (lineUser) {
      let link = _.find(lineUser.links, (linkByUser) => linkByUser.longUrl === post.link);
      if (_.isUndefined(link)) {
        lineUser.links.push(shorterUrl);
        lineUser.save();
        res.send(shorterUrl);
      }
      res.send(link);
    } else {
      LineModel.create({
        user_id: post.user_id,
        links: [shorterUrl]
      }, (errFromAdd) => {
        if (errFromAdd) {
          winston.error(errFromAdd);
          next(errFromAdd);
        }
        res.send(shorterUrl);
      });
    }
  });
});

module.exports = router;
