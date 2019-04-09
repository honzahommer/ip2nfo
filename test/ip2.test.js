const { expect } = require('chai');
const ip2 = require('../lib/ip2.js');

describe('ip2nfo/ip2', () => {
  it('lookup 1.1.1.1', done => {
    ip2.lookup('1.1.1.1').then(res => {
      expect(res.hostname).to.be.equal('one.one.one.one');
      done();
    }).catch(err => {
      return done(err);
    });
  });

  it('lookup 10.10.10.10', done => {
    ip2.lookup('10.10.10.10').then(res => {
      expect(res.latitude).to.be.equal(0);
      expect(res.longitude).to.be.equal(0);
      done();
    }).catch(err => {
      return done(err);
    });
  });

  it('lookup ::1', done => {
    ip2.lookup('::1').then(res => {
      expect(res.ip).to.be.undefined;
      done();
    }).catch(err => {
      return done(err);
    });
  });
});
