const ip2bin = require('@ip2.bin/db11lite');
const ip2loc = require('async-ip2location');
const { reverse } = require('dns').promises;

module.exports.lookup = async function lookup (ip) {
  const [ hostname = null ] = await reverse(ip).then(hostnames => {
    return hostnames;
  }).catch(() => {
    return [ ];
  });

  const geoip = await ip2loc(ip2bin).then(db => {
    return db.get_all(ip);
  }).then(result => {
    delete (result.ip_no);
    delete (result.status);

    return Object.entries(result).reduce((acc, [key, val]) => {
      switch (key) {
        case 'country_short':
          key = 'country_code';
          break;
        case 'country_long':
          key = 'country_name';
          break;
        case 'city':
          key = 'city_name';
          break;
        case 'region':
          key = 'region_name';
          break;
        case 'zipcode':
          key = 'zip_code';
          break;
        case 'timezone':
          key = 'time_zone';
          break;
      }

      acc[key] = val;

      return acc;
    }, { });
  }).catch(() => {
    return { ip };
  });

  return { ...geoip, hostname };
};
