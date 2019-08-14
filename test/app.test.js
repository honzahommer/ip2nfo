const { expect } = require('chai');
const request = require('supertest');
const app = require('../lib/app.js');
const { isV4Format } = require('ip');

describe('ip2nfo/app', () => {
  it('GET /', done => {
    request(app)
      .get('/')
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(isV4Format(res.body.ip)).to.be.false;
        done();
      });
  });

  it('GET /hostname', done => {
    request(app)
      .get('/hostname')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.bogon).to.be.true;
        done();
      });
  });

  it('GET /1.1.1.1', done => {
    request(app)
      .get('/1.1.1.1')
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.hostname).to.be.equal('one.one.one.one');
        done();
      });
  });

  it('GET /1.1.1.1/hostname', done => {
    request(app)
      .get('/1.1.1.1/hostname')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).to.be.equal('one.one.one.one');
        done();
      });
  });

  it('GET /10.10.10.10', done => {
    request(app)
      .get('/10.10.10.10')
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.bogon).to.be.true;
        done();
      });
  });

  it('GET /1.1.1.1/foobar', done => {
    request(app)
      .get('/1.1.1.1/foobar')
      .set('Accept', 'application/json')
      .expect(417)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).to.not.be.undefined;
        done();
      });
  });

  it('GET /8.8.8.8/distance/9.9.9.9', done => {
    request(app)
      .get('/8.8.8.8/distance/9.9.9.9')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(Number(res.text)).to.be.approximately(55.139, 0.1);
        done();
      });
  });

  it('GET /8.8.8.8/distance', done => {
    request(app)
      .get('/8.8.8.8/distance')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).to.not.be.equal('NaN');
        done();
      });
  });

  it('GET /2606:4700:4700::1111', done => {
    request(app)
      .get('/2606:4700:4700::1111')
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.hostname).to.be.equal('one.one.one.one');
        done();
      });
  });

  it('GET /2606:4700:4700::1111/hostname', done => {
    request(app)
      .get('/2606:4700:4700::1111/hostname')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).to.be.equal('one.one.one.one');
        done();
      });
  });

  it('GET /fd17:4bfc:9c22:958c::1', done => {
    request(app)
      .get('/fd17:4bfc:9c22:958c::1')
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.bogon).to.be.true;
        done();
      });
  });

  it('GET /2606:4700:4700::1111/foobar', done => {
    request(app)
      .get('/2606:4700:4700::1111/foobar')
      .set('Accept', 'application/json')
      .expect(417)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).to.not.be.undefined;
        done();
      });
  });

  it('GET /2001:4860:4860::8888/distance/2620:fe::9', done => {
    request(app)
      .get('/2001:4860:4860::8888/distance/2620:fe::9')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(Number(res.text)).to.be.approximately(52.386, 0.1);
        done();
      });
  });

  it('GET /2001:4860:4860::8888/distance', done => {
    request(app)
      .get('/2001:4860:4860::8888/distance')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).to.not.be.equal('NaN');
        done();
      });
  });
});
