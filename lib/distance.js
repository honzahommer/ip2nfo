const RADIUS = 6371;
const toRad = n => n * Math.PI / 180;

module.exports = function distance ([ fromLat, fromLng ], [ toLat, toLng ]) {
  const dLat = toRad(toLat - fromLat);
  const dLng = toRad(toLng - fromLng);

  const fLat = toRad(fromLat);
  const tLat = toRad(toLat);

  const a = Math.pow(Math.sin(dLat / 2), 2) + (Math.pow(Math.sin(dLng / 2), 2) * Math.cos(fLat) * Math.cos(tLat));
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return RADIUS * c;
};
