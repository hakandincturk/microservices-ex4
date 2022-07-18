const amqlib = require('amqplib');
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
module.exports.publishMessage = async (channel, binding_key, message) => {
	try {
		await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message), {persistent: true});
		console.log('Message has been sent ' + message);
	}
	catch (error) {
		console.log(`error, ${error.message}`);
	}
};

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
