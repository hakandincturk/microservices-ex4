import express from 'express';

import authRoutes from './Routes/AuthRoute';

const app = express();

app.use('/', authRoutes);

module.exports = app;