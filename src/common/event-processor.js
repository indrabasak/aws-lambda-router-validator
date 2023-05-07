const _ = require('lodash');
const { RouteConfig } = require('./route-config');
const logger = require('./lambda-logger');
const { RestUtil } = require('./rest-util');

class EventProcessor {
  constructor(basePath, ymlConfig) {
    this.routeConfig = new RouteConfig(basePath, ymlConfig);
  }

  // eslint-disable-next-line class-methods-use-this
  async route(request, response) {
    console.log('33333333333');
    const {
      method,
      pathParameters: { proxy },
      query: params,
      headers,
      body: data
    } = request;

    console.log('44444444444');

    logger.info(`method: ${method}`);
    logger.info(`proxy: ${proxy}`);
    logger.info(`query: ${params}`);
    logger.info(`headers: ${JSON.stringify(headers)}`);
    logger.info(`body: ${JSON.stringify(data)}`);

    console.log('55555555');
    const validationObj = {
      route: null,
      request: {
        method,
        proxy,
        params,
        headers,
        data
      }
    };
    const route = this.routeConfig.findMatchingRoute(proxy);
    if (route) {
      validationObj.route = route;
      const rawResponse = await RestUtil.request(
        route.uri,
        method,
        proxy,
        params,
        EventProcessor.filterHeaders(headers),
        data
      );
      console.log(`^^^^^^^^^ raw response: ${rawResponse}`);

      const rspHeaders = rawResponse.headers;
      const cleanedHeaders = {};
      if (rspHeaders) {
        // add headers
        Object.entries(rspHeaders).forEach(([key, value]) => {
          cleanedHeaders[key] = value;
        });
      }
      console.log(rspHeaders);
      validationObj.response = {
        successful: true,
        status: rawResponse.status,
        headers: cleanedHeaders,
        data: rawResponse.data
      };

      EventProcessor.mapResponse(response, rawResponse);

      console.log('6666666666 - 1');
    } else {
      response.status(409);
      console.log('6666666666 - 2');
      response.json({ message: `Route not found for path ${proxy}` });
    }

    return validationObj;
  }

  static filterHeaders(headers) {
    const newHeaders = { ...headers };
    delete newHeaders.host;

    return newHeaders;
  }

  static mapResponse(response, rawResponse) {
    console.log('^^^^^^^^^ map response');
    const { status, headers, data } = rawResponse;

    if (status) {
      response.status(status);
    }

    if (headers) {
      Object.entries(headers).forEach(([key, value]) => {
        response.header(key, value);
      });
    }

    if (data) {
      if (_.isString(data)) {
        response.send(data);
      } else if (_.isElement(rawResponse)) {
        response.html(data);
      } else {
        response.json(data);
      }
    }
  }
}

module.exports = { EventProcessor };
