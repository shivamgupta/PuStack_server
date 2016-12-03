/*
 * Connect all of your endpoints together here.
 */
module.exports = function (app, router) {
  app.use('/api', require('./controllers/users.controllers.js')(router));
  app.use('/api', require('./controllers/courses.controllers.js')(router));
  app.use('/api', require('./controllers/lectures.controllers.js')(router));
};