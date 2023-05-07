const axios = require('axios');

class RestUtil {
  static async post(url, data, config) {
    try {
      return axios.post(url, data, config);
    } catch (e) {
      console.error('exception occurred while POST', e);
      throw e;
    }
  }

  static async put(url, data, config) {
    try {
      return axios.put(url, data, config);
    } catch (e) {
      console.error('exception occurred while PUT', e);
      throw e;
    }
  }

  static async get(url, config) {
    try {
      console.log(url);
      const response = await axios.get(url, config);
      console.log(response.data);
      return response;
    } catch (e) {
      console.error('exception occurred while GET', e);
      throw e;
    }
  }
}

module.exports = { RestUtil };
