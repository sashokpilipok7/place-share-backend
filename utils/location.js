const API_KEY = "my_first_api_key";

function getCoordsForAddress() {
  return new Promise((resovle) => {
    setTimeout(() => {
      resovle({
        lat: 48.686041877319035,
        lng: 26.571066315655322,
      });
    }, 2000);
  });
}

module.exports = getCoordsForAddress;
