import express from 'express';
import fs from 'fs';

import checkAuth from './middlewares/checkAuth';

import {
	AUTH_EXCHANGE_NAME, FS_EXCHANGE_NAME,
	AUTH_LOGIN_BINDING_KEY, AUTH_LOGIN_QUEUE_NAME,
	AUTH_REGISTER_BINDING_KEY, AUTH_REGISTER_QUEUE_NAME,
	AUTH_CHECK_ROLE_BINDING_KEY, AUTH_CHECK_ROLE_QUEUE_NAME,
	FS_CREATE_NEW_USER_BINDING_KEY, FS_CREATE_NEW_USER_QUEUE_NAME,
	FS_INIT_BINDING_KEY, FS_INIT_QUEUE_NAME
} from '../src/config/envKeys';

import { createClientWithExchange, bindQueueAndExchange } from '../src/utils/index';

const app = express();

// app.use(checkAuth);

const src = async () => {
	
	const bindQueueAndExchanges = async () => {

		const authChannel = await createClientWithExchange(AUTH_EXCHANGE_NAME);
		const fsChannel = await createClientWithExchange(FS_EXCHANGE_NAME);

		global.authChannel = authChannel;
		global.fsChannel = fsChannel;

		console.log('');
	
		await bindQueueAndExchange(
			fsChannel,
			FS_EXCHANGE_NAME,
			FS_CREATE_NEW_USER_BINDING_KEY,
			FS_CREATE_NEW_USER_QUEUE_NAME
		);
	};

	bindQueueAndExchanges();

	fs.readdir('./api/Private/Routes', (err, files) => {
		if (err) throw err;
  
		for (let file of files) {
			const routeName = file.slice(0, file.length - 8);
			const routeNameLower = routeName.toLowerCase();

			let routeFile = require(`./Routes/${routeName}Route`);
			app.use(`/${routeNameLower}`, routeFile);
		}
	});
};

src();

module.exports = app;