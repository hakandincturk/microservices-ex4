import express from 'express';

import InitController from '../Controllers/InitController';

const app = express();

app.use('/', InitController.redirect);

app.get('/health', InitController.health);

module.exports = app;