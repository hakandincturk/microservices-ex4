import express from 'express';

import SecondController from '../Controllers/SecondController';

const app = express();

app.get('/health', SecondController.health);

module.exports = app;