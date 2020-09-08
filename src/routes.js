const express = require ('express');
const routes = express.Router();


const UserController = require('./controllers/User/UserController')
const SessionController = require('./controllers/User/SessionController')
const UpdateUserController = require('./controllers/User/UpdateUserController')
const SmkController = require('./controllers/User/SmkController')

routes.post('/users',UserController.create);
routes.get('/users',UserController.index);
routes.delete('/users',UserController.delete);

routes.post('/session',SessionController.create);

routes.get('/user_update',UpdateUserController.index);
routes.put('/user_update',UpdateUserController.update);

routes.post('/smk',SmkController.update);

module.exports = routes;