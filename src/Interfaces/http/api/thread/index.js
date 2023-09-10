const routes = require('./routes');
const ThreadHandler = require('./handler');

module.exports = {
  name: 'thread',
  version: '1.0.0',
  register: async (server, { container }) => {
    const threadHandler = new ThreadHandler(container);
    server.route(routes(threadHandler));
  },
};
