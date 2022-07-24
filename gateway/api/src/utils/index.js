const amqlib = require('amqplib');
import EventEmitter from 'events';
import { v4 as uuidv4 } from 'uuid';
import consola from 'consola';

import { MESSAGE_BROKER_URL, EXCHANGE_NAME } from '../config/envKeys';

module.exports.getHourAndMinutes = () => {
	let today = new Date();
	let time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
	return time;
};

const getHourAndMinuteLocal = () => {
	let today = new Date();
	let time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
	return time;
};

//publish message
module.exports.publishMessage = async (exchangeName, channel, BINDING_KEY, message) => {
	try {
		console.log('publish message worked, ', message);
		await channel.publish(
			exchangeName,
			BINDING_KEY,
			Buffer.from(message)
		);
		console.log('Message has been sent ' + message);
	}
	catch (error) {
		console.log(`publish message error, ${error.message}`);
	}
};

module.exports.subscribeMessage = async (channel, service, binding_key, queueName) => {
	try {
		const appQueue = await channel.assertQueue(queueName);
		// channel.bindQueue(appQueue.queue, EXCHANGE_NAME, binding_key);
		channel.consume(appQueue.queue, data => {
			console.log(`${binding_key} recieved data`);
			console.log(data.content.toString());

			/*
			 * service.SubscribeEvents(data.content.toString());
			 * channel.ack(data);
			 */
		});
	}
	catch (error) {
		throw error;
	}
};

module.exports.subscribeReplyMessage = async (channel, binding_key, queueName, uuidd) => {
	try {
		const isMatch = false;
		let returnedData = {}, i = 0;
		const appQueue = await channel.assertQueue(queueName);
					
		channel.bindQueue(appQueue.queue, EXCHANGE_NAME, binding_key);
		channel.consume(appQueue.queue, async (data) => {
			i++;
			console.log(i, `${binding_key} recieved data`);
			// console.log(data.content.toString());
			if (!isMatch) {				
				const parsedData = JSON.parse(data.content.toString());
	
				// eslint-disable-next-line eqeqeq
				if (parsedData.uuid == uuidd){
					returnedData = parsedData.result; 
					console.log('data match', uuidd);
					channel.ack(data);	
				}
			}
		});
		console.log('utils->index.js, ', returnedData);
		return returnedData;
	}
	catch (error) {
		console.log(error.message);
	}
};

module.exports.createClientWithExchange = async (exchangeName) => {

	try {
		const con = await amqlib.connect(MESSAGE_BROKER_URL);
		const channel = await con.createChannel();
		await channel.assertExchange(exchangeName, 'direct', false);
		
		channel.responseEmitter = new EventEmitter();
		channel.responseEmitter.setMaxListeners(0);
		channel.consume(
			'amq.rabbitmq.reply-to',
			msg => {
				channel.responseEmitter.emit(
					msg.properties.correlationId,
					msg.content.toString('utf8'),
				);
			},
			{ noAck: true },
		);

		consola.info(`{declared} [utils.js] -> [createClientWithExchange] ${exchangeName}`);
			
		return channel;
	}
	catch (_) {
		consola.error('[utils.js] -> [createClientWithExchange.error] ->', _.message);
		throw _;
	}
};

const sendRPCMessage = async (channel, message, BINDING_KEY) => {

	// eslint-disable-next-line no-undef
	const returnedMessage = await new Promise((resolve) => {
		const correlationId = uuidv4();
		channel.responseEmitter.once(correlationId, resolve);
		channel.sendToQueue(
			BINDING_KEY,
			Buffer.from(message),
			{
				correlationId,
				replyTo: 'amq.rabbitmq.reply-to'
			});
	});
	return returnedMessage;
};

module.exports.sendMessageToQueue = async (channel, message, BINDING_KEY) => {
	// const channel = await createClient(MESSAGE_BROKER_URL);
	// const channel = global.rabbitMqConn;
	consola.info({
		message: `[ ${ getHourAndMinuteLocal() } ] MESSAGE SENT for ${BINDING_KEY}`,
		badge: true
	});

	const returnedData = await sendRPCMessage(
		channel,
		JSON.stringify({ data: message }),
		BINDING_KEY
	);

	consola.info({
		message: `[ ${ getHourAndMinuteLocal() } ] returned message received `,
		badge: true
	});

	return returnedData;
};

module.exports.bindQueueAndExchange = async ( channel, exchangeName, bindingKey, queueName) => {
	try {
		const appQueue = await channel.assertQueue(queueName);
		channel.bindQueue(appQueue.queue, exchangeName, bindingKey);	
		consola.info('{created} [utils.js] -> [bindQueueAndExchange].queue  -> ', queueName);
	}
	catch (_) {
		consola.error('[utils.js] -> [bindQueueAndExchange].error -> ', _.message);
	}
};