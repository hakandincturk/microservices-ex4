require('dotenv').config();

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { success } from 'consola';

import publicRoutes from './Public/index';
import { swaggerOptions } from './src/config/swaggerOptions';
const amqlib = require('amqplib');

import { MESSAGE_BROKER_URL } from './src/config/envKeys';

const conn = async () => {
	global.rabbitMqConn = await amqlib.connect(MESSAGE_BROKER_URL); 
};

const startServer = async () => {
	const PORT = process.env.PORT || 5000;
	const app = express();
	
	const swaggerGenerator = require('express-swagger-generator')(app);
	
	app.use(cors());
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));

	await conn();
	
	app.use('/', publicRoutes);
	
	swaggerGenerator(swaggerOptions);
	
	app.get('/health', (req, res) => {
		res.json({type: true, message: 'server is running'});
	});
	
	app.listen(PORT, () => {
		success({ message: `SERVER IS RUNNING ON ${PORT}`, badge: true });
	});
};

startServer();