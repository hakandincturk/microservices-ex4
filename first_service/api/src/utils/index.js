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
/* module.exports.publishMessage = async (channel, binding_key, message) => {
	try {
		await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message), {persistent: true});
		console.log('Message has been sent ' + message);
	}
	catch (error) {
		console.log(`error, ${error.message}`);
	}
}; */

module.exports.subscribeMessage = async (channel, controller, binding_key, queueName) => {
	try {

		consola.info({message: `${binding_key} is listening.`, badge: true});

		const appQueue = await channel.assertQueue(queueName);
					
		channel.bindQueue(appQueue.queue, EXCHANGE_NAME, binding_key);
		channel.consume(appQueue.queue, data => {
			console.log(`${binding_key} recieved data`);

			const parsedData = JSON.parse(data.content.toString());
			console.log(parsedData.services);

			parsedData.services.forEach(element => {
				const serviceName = element.split(':')[0];
				const role = element.split(':')[1];

				if (serviceName === 'fs_service') controller.createNewUser(parsedData.data.data, role);

			});

			channel.ack(data);
		});
	}
	catch (error) {
		throw error;
	}
};

module.exports.subscribeMessageWithoutController = async (channel, binding_key, queueName) => {
	try {

		// const open = amqlib.connect(MESSAGE_BROKER_URL);

		// consola.info({message: `${binding_key} is listening.`, badge: true});
	
		// open
		// 	.then(function (conn) {
		// 		console.log(`[ ${ getHourAndMinuteLocal() } ] Server started`);
		// 		// return conn.createChannel();
		// 	})
		// 	.then(async function (ch) {
		// 		return 
		channel.assertQueue(queueName).then(function (ok) {
			return channel.consume(queueName, function (msg) {
				console.log(
					`[ ${ getHourAndMinuteLocal() } ] Message received: ${JSON.stringify(
						JSON.parse(msg.content.toString('utf8')),
					)}`,
				);

				const parsedData = JSON.parse(msg.content.toString());
									
				const controllerName = parsedData.data.url
					.slice(1, parsedData.data.url.length)
					.split('/')[0];
				const controllerNameWithUpperCase = controllerName[0].toUpperCase() + controllerName.slice(1);

				try {
					let routeFile = require(
						`../../Private/Routes/${controllerNameWithUpperCase}Route`
					).default;
					routeFile.subscribeEvents( channel, msg );
				}
				catch (_) {
					// TODO return response error
					consola.error({message: _.message, badge: true});
				}
			});
		});
		// })
		// .catch(e => console.error(e.message));
	}
	catch (error) {
		throw error;
	}
};

/* const createClient = rabbitmqconn =>
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
}; */