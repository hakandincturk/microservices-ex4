import express from 'express';

import authRoutes from './Routes/AuthRoute';
import { createChannel, subsMessage } from '../src/utils/index';
import AuthController from './Controllers/AuthController';

import { AUTH_QUEUE_NAME } from '../src/config/envKeys';

const app = express();

const start = async ( )=> {
	const channel = await createChannel();
	// subscribeMessage(channel, AuthController, AUTH_BINDING_KEY, AUTH_QUEUE_NAME);
	subsMessage(AuthController, AUTH_QUEUE_NAME);

};

start();
app.use('/', authRoutes);

module.exports = app;