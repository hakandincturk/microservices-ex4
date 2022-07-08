import express from 'express';

import InitController from '../Controllers/InitController';
import CheckRole from '../Middlewares/checkRole';

const app = express();

app.use(CheckRole.checkRole(2, 'ss'));

app.get('/ss', InitController.health);

app.get('/health', InitController.health);

module.exports = app;