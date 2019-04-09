const config = require('config');
const createError = require('http-errors');
const debug = require('debug')(`${config.pkg.name}:app`);
const express = require('express');
const favicon = require('request-favicon');
const helmet = require('helmet');
const ip2 = require('./ip2');
const robots = require('request-robots');
const { isV4Format, isPrivate } = require('ip');

const app = express();

if (config.util.getEnv('NODE_ENV') === 'production') {
  app.enable('trust proxy');
}

app.use(helmet());
app.use(favicon());
app.use(robots());

app.param('ip', (req, res, next, ip) => {
  if (isV4Format(ip) === false) {
    return next(createError(417, 'Please provide a valid IPv4 address'));
  } else if (isPrivate(ip) === true) {
    res.json({ ip, bogon: true });
  } else {
    next();
  }
});

app.get('/:ip?', (req, res, next) => {
  const { params, query } = req;
  const { ip = req.ip } = params;
  const jsonp = query[app.get('jsonp callback name')];

  ip2.lookup(ip).then(results => {
    res[jsonp ? 'jsonp' : 'json'](results);
  }).catch(error => {
    next(error);
  });
});

app.use((req, res, next) => next(createError(404)));

app.use((err, req, res, next) => {
  const { status = 500 } = err;

  res.status(status);
  res.json(err);
});

if (!module.parent) {
  const listener = app.listen(config.port, () => {
    debug(config.pkg.name + ' listening on port ' + listener.address().port);
  });
}

module.exports = app;
