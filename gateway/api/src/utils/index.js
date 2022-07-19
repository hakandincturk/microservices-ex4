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

//message broker

//create channel
module.exports.createChannel = async () => {
	try {
		const connection = await amqlib.connect(MESSAGE_BROKER_URL);
		const channel = await connection.createChannel();
		await channel.assertExchange(EXCHANGE_NAME, 'direct', false);
		console.log('AMQP CREATED CHANNEL');
		return channel;
	}
	catch (error) {
		console.log(`error, ${error.message}`);
	}
};

//publish message
module.exports.publishMessage = async (channel, binding_key, message) => {
	try {
		console.log('publish message worked, ', message);
		await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));
		console.log('Message has been sent ' + message);
	}
	catch (error) {
		console.log(`publish message error, ${error.message}`);
	}
};

module.exports.subscribeMessage = async (channel, service, binding_key, queueName) => {
	try {
		const appQueue = await channel.assertQueue(queueName);
					
		channel.bindQueue(appQueue.queue, EXCHANGE_NAME, binding_key);
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

const createClient = rabbitmqconn =>
	amqlib
		.connect(rabbitmqconn)
		.then(conn => conn.createChannel())
		.then(channel => {
			channel.responseEmitter = new EventEmitter();
			channel.responseEmitter.setMaxListeners(0);
			console.log('createClient clg');
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
			return channel;
		});

const sendRPCMessage = async (channel, message, rpcQueue) => {
	// eslint-disable-next-line no-undef
	const returnedMessage = await new Promise((resolve) => {
		const correlationId = uuidv4();
		channel.responseEmitter.once(correlationId, resolve);
		channel.sendToQueue(rpcQueue, Buffer.from(message), {
			correlationId,
			replyTo: 'amq.rabbitmq.reply-to'
		});
	});
	return returnedMessage;
};

module.exports.sendMessageToQueue = async (event, message, QUEUE_NAME) => {
	const channel = await createClient(MESSAGE_BROKER_URL);
	
	consola.info({
		message: `[ ${ getHourAndMinuteLocal() } ] MESSAGE SENT for ${QUEUE_NAME}`,
		badge: true
	});

	const returnedData = await sendRPCMessage(channel, JSON.stringify({event, data: message}), QUEUE_NAME);

	consola.info({
		message: `[ ${ getHourAndMinuteLocal() } ] returned message received `,
		badge: true
	});

	channel.close();
	return returnedData;
};