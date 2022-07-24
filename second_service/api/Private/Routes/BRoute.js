import express from 'express';

import BController from '../Controllers/BController';

const app = express();

app.get('/health', BController.health);

module.exports = app;