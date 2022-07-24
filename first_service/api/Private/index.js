import express from 'express';
import fs from 'fs';

import checkAuth from './middlewares/checkAuth';

import {
	createClientWithExchange,
	subscribeMessageWithRoute
} from '../src/utils/index';

import {
	AUTH_EXCHANGE_NAME,
	FS_EXCHANGE_NAME,
	SS_EXCHANGE_NAME
} from '../src/config/envKeys';

const app = express();

app.use(checkAuth);

const createChannels = async () => {

	const authChannel = await createClientWithExchange(AUTH_EXCHANGE_NAME);
	const fsChannel = await createClientWithExchange(FS_EXCHANGE_NAME);
	const ssChannel = await createClientWithExchange(SS_EXCHANGE_NAME);

	global.authChannel = authChannel;
	global.fsChannel = fsChannel;
	global.ssChannel = ssChannel;

	console.log('');

};

const start = async () => {
	await createChannels();
	
	fs.readdir('./api/Private/Routes', (err, files) => {
		if (err) throw err;
  
		for (let file of files) {
			const routeName = file.slice(0, file.length - 8);
			let routeFile = require(`./Routes/${routeName}Route`);

			const bindingKey =  `FS_SERVICE.${routeName.toUpperCase()}`;

			subscribeMessageWithRoute(
				global.fsChannel,
				bindingKey,
				routeFile,
			);

		}
	});
};

start();

module.exports = app;