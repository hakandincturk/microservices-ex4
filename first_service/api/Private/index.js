import express from 'express';

import InitController from './Controllers/InitController';

import checkAuth from './middlewares/checkAuth';

import { createChannel, subscribeMessage, subscribeMessageWithoutController } from '../src/utils/index';

import {
	CREATE_NEW_USER_BINDING_KEY,
	CREATE_NEW_USER_QUEUE_NAME,
	FS_SERVICE_BINDING_KEY,
	FS_SERVICE_QUEUE_NAME
} from '../src/config/envKeys';

const app = express();

app.use(checkAuth);

const start = async () => {
	const channel = await createChannel();
	// subscribeMessage(channel, AuthController, AUTH_BINDING_KEY, AUTH_QUEUE_NAME);
	subscribeMessage(channel, InitController, CREATE_NEW_USER_BINDING_KEY, CREATE_NEW_USER_QUEUE_NAME);
	subscribeMessageWithoutController(channel, FS_SERVICE_BINDING_KEY, FS_SERVICE_QUEUE_NAME);
};

start();

module.exports = app;