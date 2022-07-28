import express from 'express';
import FsController from '../Controllers/FsController';

import InitController from '../Controllers/InitController';

import CheckRole from '../Middlewares/checkRole';

const app = express();

app.use(CheckRole.checkRole(1, 'fs'));

app.use('/', FsController.redirect);

app.get('/fs', InitController.health);

app.get('/health', InitController.health);

module.exports = app;