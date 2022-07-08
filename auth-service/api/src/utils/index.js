import amqlib from 'amqplib';

import { MESSAGE_BROKER_URL, EXCHANGE_NAME } from '../config/envKeys';

module.exports.getHourAndMinutes = () => {
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
		await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message), {persistent: true, autoDelete: true});
		console.log(`Message has been sent to ${binding_key}`, message);
	}
	catch (error) {
		console.log(`error, ${error.message}`);
	}
};

module.exports.subscribeMessage = async (channel, controller, binding_key, queueName) => {
	try {
		const appQueue = await channel.assertQueue(queueName);
					
		channel.bindQueue(appQueue.queue, EXCHANGE_NAME, binding_key);
		channel.consume(appQueue.queue, data => {
			console.log(`${binding_key} recieved data`, data.content.toString());
			controller.SubscribeEvents(channel, data.content.toString());
			channel.ack(data);
		});
	}
	catch (error) {
		throw error;
	}
};

module.exports.subsMessage = async (controller, QUEUE_NAME) => {

	const open = amqlib.connect(MESSAGE_BROKER_URL);
	
	open
		.then(function (conn) {
			console.log(`[ ${new Date()} ] Server started`);
			return conn.createChannel();
		})
		.then(async function (ch) {
			return ch.assertQueue(QUEUE_NAME).then(function (ok) {
				return ch.consume(QUEUE_NAME, function (msg) {
					console.log(
						`[ ${new Date()} ] Message received: ${JSON.stringify(
							JSON.parse(msg.content.toString('utf8')),
						)}`,
					);

					// eslint-disable-next-line new-cap
					controller.SubscribeEvents(ch, msg);
					
					console.log('subscribe events completed and going acknowlodge message');
				});
			});
		})
		.catch(console.warn);

};