const apiHandler = require('./api-handler');

// eslint-disable-next-line no-unused-vars
module.exports = (app, opts) => {
  app.any('/*', async (request, response) => {
    console.log('1111111');
    await apiHandler.process(request, response);
  });
};
