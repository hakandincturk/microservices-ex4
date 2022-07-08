require('dotenv').config();

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { success } from 'consola';

import publicRoutes from './Public/index';
import privateRoutes from './Private/index';
import { swaggerOptions } from './src/config/swaggerOptions';

import constChannel from './src/middlewares/constChannel';
import { createClient } from './src/utils/index';

const startServer = async () => {
	const PORT = process.env.PORT || 5000;
	const app = express();

	const swaggerGenerator = require('express-swagger-generator')(app);

	app.use(cors());
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));

	/*
	 * const channel = await createClient();
	 * app.use(constChannel(channel)); 
	 */

	app.use('/', publicRoutes);
	app.use('/', privateRoutes);

	swaggerGenerator(swaggerOptions);

	app.get('/health', (req, res) => {
		res.json({type: true, message: 'server is running'});
	});

	app.listen(PORT, () => {
		success({ message: `SERVER IS RUNNING ON ${PORT}`, badge: true });
	});
};

startServer();