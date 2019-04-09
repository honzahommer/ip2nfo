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
        expect(isV4Format(res.body.ip)).to.be.true;
        done();
      });
  });

  it('GET /hostname', done => {
    request(app)
      .get('/hostname')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).to.be.equal('');
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

  it('GET /::1', done => {
    request(app)
      .get('/::1')
      .set('Accept', 'application/json')
      .expect(417)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).to.not.be.undefined;
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
});
