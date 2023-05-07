const fs = require('fs');
const { RouteConfig } = require('../../src/common/route-config');

describe('Test suite for router configuration', () => {
  it('will test for valid router configuration', async () => {
    const ymlConfig = fs.readFileSync('test-config/good-routes.yml', 'utf8');
    const routeConfig = new RouteConfig('/api/v1/contract', ymlConfig);

    const routeOne = routeConfig.findMatchingRoute(
      '/api/v1/contract/sage/v1/events?limit=100&offset=0&filter[status]=TARGET_DELIVERY_FAILURE,SAGE_DELIVERY_FAILURE&filter[datetime]=2022-07-12T14:59:21.000Z..2022-07-12T15:03:21.000Z'
    );
    expect(routeOne).not.toBeNull();

    const routeTwo = routeConfig.findMatchingRoute(
      '/api/v1/contract/sage/v1/events'
    );
    expect(routeTwo).not.toBeNull();

    const routeThree = routeConfig.findMatchingRoute(
      '/api/v1/contract/sagenew/v1/events'
    );
    expect(routeThree).toBeNull();
  });
});
