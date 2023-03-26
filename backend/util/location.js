const axios = require('axios');

const HttpError = require('../models/http-error');

const API_KEY = process.env.GOOGLE_API_KEY;

/**
 * Find location for an address.
 * E.g., address = '58 P. Quốc Tử Giám, Văn Miếu, Đống Đa, Hà Nội 100000, Vietnam'
 * @param {String} address 
 * @returns 
 */
async function getCoordsForAddress(address) {
  try {
    console.log('Find location for address ' + address);
    const response = await axios(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${API_KEY}`
    );
    const data = response.data;
    if (!data || data.status === 'ZERO_RESULTS') {
      throw new HttpError(
        'Could not find location for the specified address.',
        422
      );
    }
    console.log(data);
    const coordinates = data.results[0].geometry.location;
    return coordinates;
  } catch (err) {
    console.log(err);
    throw new HttpError(
      'Something went wrong with map API.',
      422
    );
  }
}

module.exports = getCoordsForAddress;
