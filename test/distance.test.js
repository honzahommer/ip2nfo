const { expect } = require('chai');
const distance = require('../lib/distance.js');

describe('ip2nfo/distance', () => {
  it('[45.527517, -122.718766], [45.373373, -121.693604]', () => {
    expect(distance([45.527517, -122.718766], [45.373373, -121.693604])).to.be.approximately(81.784, 0.1);
  });
});
