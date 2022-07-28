const amqlib = require('amqplib');
import EventEmitter from 'events';
import { v4 as uuidv4 } from 'uuid';
import consola from 'consola';

import { MESSAGE_BROKER_URL, FS_EXCHANGE_NAME } from '../config/envKeys';

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

module.exports.subscribeMessageWithRoute = async (channel, BINDING_KEY, routeFile) => {

	try {
		channel.assertQueue(BINDING_KEY).then(function (ok) {
			channel.bindQueue(ok.queue, FS_EXCHANGE_NAME, BINDING_KEY);

			consola.info(`{listening} [utils.js] -> [subscribeMessageWithRoute] ${BINDING_KEY}`);

			return channel.consume(
				BINDING_KEY,
				function (msg) {
					console.log(
						`[ ${ getHourAndMinuteLocal() } ] [${BINDING_KEY}] Message received: ${JSON.stringify(
							JSON.parse(msg.content.toString('utf8')),
						)}`,
					);

				 console.log(msg.properties);
					routeFile.default.subscribeEvents( channel, msg );
				});

		}).catch(e => console.error(e.message));
	}
	catch (error) {
		throw error;
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
		
		consola.info({
			message: 
				`[ ${ getHourAndMinuteLocal() } ] MESSAGE SENT for ${BINDING_KEY} with ${correlationId.split('-')[4]}`,
			badge: true
		});

		channel.responseEmitter.once(correlationId, resolve);
		channel.sendToQueue(
			BINDING_KEY,
			Buffer.from(message),
			{
				correlationId,
				replyTo: 'amq.rabbitmq.reply-to'
			});

		consola.info({
			message: `[ ${ getHourAndMinuteLocal() } ] returned message received with ${correlationId.split('-')[4]} `,
			badge: true
		});
	});

	return returnedMessage;
};

module.exports.sendMessageToQueue = async (channel, message, BINDING_KEY) => {
	// const channel = await createClient(MESSAGE_BROKER_URL);
	// const channel = global.rabbitMqConn;

	const returnedData = await sendRPCMessage(
		channel,
		JSON.stringify({ data: message }),
		BINDING_KEY
	);
	
	return returnedData;
};