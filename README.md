# ip2nfo

[![npm version][npm-image]][npm-url]
[![npm download][downloads-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Greenkeeper badge](https://badges.greenkeeper.io/honzahommer/ip2nfo.svg)](https://greenkeeper.io/)

> IP2 geolocation web server

## Install & Running

```bash
git clone https://github.com/honzahommer/ip2nfo.git
cd ip2nfo
npm install
npm start
```

or

```bash
npm install -g ip2nfo
ip2nfo --port 3000
```

or

```bash
const ip2nfo = require('ip2nfo');
ip2nfo.start(3000);
```

## Tests

```bash
npm test
```

## Endpoints

```bash
curl localhost:3000
curl localhost:3000/hostname
curl localhost:3000/1.1.1.1
curl localhost:3000/1.1.1.1/hostname
curl localhost:3000/8.8.8.8/distance/9.9.9.9
```

## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/ip2nfo.svg
[npm-url]: https://npmjs.org/package/ip2nfo
[travis-image]: https://img.shields.io/travis/honzahommer/ip2nfo/master.svg
[travis-url]: https://travis-ci.org/honzahommer/ip2nfo
[downloads-image]: https://img.shields.io/npm/dm/ip2nfo.svg