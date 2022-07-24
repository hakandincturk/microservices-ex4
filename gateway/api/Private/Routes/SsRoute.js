import express from 'express';

import SsController from '../Controllers/SsController';
import CheckRole from '../Middlewares/checkRole';

const app = express();

// app.use(CheckRole.checkRole(2, 'ss'));

app.use('/', SsController.redirect);

app.get('/ss', SsController.health);

app.get('/health', SsController.health);

module.exports = app;