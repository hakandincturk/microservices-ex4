import express from 'express';
import fs from 'fs';

import InitController from './Controllers/InitController';

import checkAuth from './middlewares/checkAuth';

import { createChannel, subscribeMessage } from '../src/utils/index';

import { CREATE_NEW_USER_BINDING_KEY, CREATE_NEW_USER_QUEUE_NAME } from '../src/config/envKeys';

const app = express();
app.use(checkAuth);

const start = async () => {
	const channel = await createChannel();
	// subscribeMessage(channel, AuthController, AUTH_BINDING_KEY, AUTH_QUEUE_NAME);
	subscribeMessage(channel, InitController, CREATE_NEW_USER_BINDING_KEY, CREATE_NEW_USER_QUEUE_NAME);
};

fs.readdir('./api/Private/Routes', (err, files) => {
	if (err) throw err;
  
	for (let file of files) {
		const routeName = file.slice(0, file.length - 8);
		const routeNameLower = routeName.toLowerCase();

		let routeFile = require(`./Routes/${routeName}Route`);
		app.use(`/${routeNameLower}`, routeFile);
	}
});

start();

module.exports = app;