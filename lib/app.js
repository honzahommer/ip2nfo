const config = require('config');
const createError = require('http-errors');
const debug = require('debug')(`${config.pkg.name}:app`);
const express = require('express');
const favicon = require('request-favicon');
const helmet = require('helmet');
const ip2 = require('./ip2');
const distance = require('./distance');
const robots = require('request-robots');
const { isV4Format, isPrivate } = require('ip');

const app = express();

if (config.util.getEnv('NODE_ENV') === 'production') {
  app.enable('trust proxy');
}

app.use(helmet());
app.use(favicon());
app.use(robots());

app.param(['ip', 'ipFrom', 'ipTo'], (req, res, next, ip) => {
  if (isV4Format(ip) === false) {
    return next(createError(417, 'Please provide a valid IPv4 address'));
  } else if (isPrivate(ip) === true) {
    res.json({ ip: `${ip}`, bogon: true });
  } else {
    next();
  }
});

app.param('key', (req, res, next, key) => {
  if (['ip', 'country_code', 'country_name', 'region_name', 'city_name', 'zip_code', 'latitude', 'longitude', 'time_zone', 'hostname'].includes(key) === false) {
    return next(createError(417, 'Please provide a valid property name'));
  }

  next();
});

app.get('/:ipFrom([0-9.]+)/distance/:ipTo([0-9.]+)?', (req, res, next) => {
  const { params: { ipFrom, ipTo }, ip } = req;

  Promise.all([ ip2.lookup(ipFrom), ip2.lookup(ipTo || ip) ]).then(results => {
    const [ from, to ] = results;
    const result = distance([ from.latitude, from.longitude ], [ to.latitude, to.longitude ]);

    res.send(`${result}`);
  }).catch(error => {
    next(error);
  });
});

app.get('/:ip([0-9.]+)?/:key?', (req, res, next) => {
  const { params, query } = req;
  const { ip, key } = params;

  ip2.lookup(ip || req.ip).then(results => {
    if (key) {
      res.send(`${results[key] || ''}`);
    } else {
      const jsonp = query[app.get('jsonp callback name')];

      res[jsonp ? 'jsonp' : 'json'](results);
    }
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
