/**
 * @typedef AuthReq
 * @property {string} email
 * @property {string} username
 * @property {string} name
 * @property {string} surname
 * @property {string} password
 *
 */

/** 
 * @typedef AuthReqLogin
 * @property {string} email
 * @property {string} password
 */

import AuthService from '../Services/AuthService';
import AuthValidation from '../Validation/AuthValidation';
import consola from 'consola';

import { AUTH_BINDING_REPLY_KEY, MESSAGE_BROKER_URL } from '../../src/config/envKeys';

import { publishMessage, getHourAndMinutes } from '../../src/utils/index';

class AuthController{

	/** 
	 * @route POST /public/auth/
	 * @group Auth
	 * @summary Create new user
	 * @param {AuthReq.model} body.body
	 * @returns {object} 200 - Success message
	 * @returns {Error} default - Unexpected error
	 */
	static async register(req, res){
		try {

			const validation = await AuthValidation.registerValidation(req.body);

			if (!validation.type)
				res.json({type: false, message: validation.message});
			else {
				const result = await AuthService.register(req.body);

				if (result.type) res.json({type: true, message: result.message});
				else res.json({type: false, message: result.message});
			}
		}
		catch (error) {
			res.json({type: false, message: error.message});
		}
	}

	/**
	 * @route POST /public/auth/login
	 * @group Auth
	 * @summary Login
	 * @param { AuthReqLogin.model } body.body
	 * @returns {object} 200 - Success message
	 * @returns {Error} default - Unexpected error
	 */
	static async login(req, res){
		try {

			const validation = await AuthValidation.loginValidation(req.body);

			if (!validation.type)
				res.json({type: false, message: validation.message});
			else {
				const result = await AuthService.login(req.body);

				if (result.type) res.json({type: true, message: result.message, data: {token: result.token}});
				else res.json({type: false, message: result.message});
			}

		}
		catch (error) {
			res.json({type: false, message: error.message});
		}
	}

	/**
	 * @route POST /public/auth/login
	 * @group Auth
	 * @summary Login
	 * @param { AuthReqLogin.model } body.body
	 * @returns {object} 200 - Success message
	 * @returns {Error} default - Unexpected error
	 */
	 static async loginV2(channel, data, uuid){
		try {

			const validation = await AuthValidation.loginValidation(data);

			if (!validation.type){
				publishMessage(channel,
					AUTH_BINDING_REPLY_KEY,
					JSON.stringify({
						uuid,
						result: {type: false, message: validation.message}
					}));
			}
			else {
				const result = await AuthService.login(data);

				if (result.type) {
					publishMessage(channel,
						AUTH_BINDING_REPLY_KEY,
						JSON.stringify({
							uuid,
							result: {type: true, message: result.message, data: {token: result.token}}
						})
					);
				}
				else {
					publishMessage(
						channel,
						AUTH_BINDING_REPLY_KEY,
						JSON.stringify({uuid,
							result: {type: false, message: result.message}
						})
					);
				} 
			}

		}
		catch (error) {
			publishMessage(
				channel,
				AUTH_BINDING_REPLY_KEY,
				JSON.stringify({uuid, result: {type: false, message: error.message}})
			);
		}
	}

	static async loginV3(data, uuid) {
		const open = require('amqplib').connect(MESSAGE_BROKER_URL);
		const q = 'example';

		open.then((conn) => {
			console.log(`[ ${new Date()} ] Server started`);
			return conn.createChannel();
		})
			.then((ch) => {
				return ch.assertQueue(q).then((ok) => {
					return ch.consume(q, (msg) => {
						console.log(
							`[ ${new Date()} ] Message received: ${JSON.stringify(
								JSON.parse(msg.content.toString('utf8')),
							)}`,
						);

						if (msg !== null){
							const response = {
								uuid: 'asd123'
							};

							console.log(
								`[ ${new Date()} ] Message sent: ${JSON.stringify(response)}`,
							);

							ch.sendToQueue(
								msg.properties.replyTo,
								Buffer.from(JSON.stringify(response)),
								{
									correlationId: msg.properties.correlationId
								},
							);
							ch.ack(msg);
						}
					});
				});
			})
			.catch(console.warn);
	}

	static async loginV4(ch, msg, data){
		try {
			let returnedData;
			const validation = await AuthValidation.loginValidation(data);

			if (!validation.type){
				returnedData = {type: false, message: validation.message};
	
			}
			else {
				const result = await AuthService.login(data);

				if (result.type) {
					returnedData = {type: true, message: result.message, data: {token: result.token}};
				}
				else {
					returnedData = {type: false, message: result.message};
				} 
			}
			await ch.sendToQueue(
				msg.properties.replyTo,
				Buffer.from(JSON.stringify(returnedData)),
				{
					correlationId: msg.properties.correlationId
				},
			);
			
			console.log(
				`[ ${ getHourAndMinutes() } ] Message sent: ${returnedData}`, 
			);
		}
		catch (error) {
			consola.error({message: 'error', badge: true});
			const returnedData = {type: false, message: error.message};
			
			ch.sendToQueue(
				msg.properties.replyTo,
				Buffer.from(JSON.stringify(returnedData)),
				{
					correlationId: msg.properties.correlationId
				},
			);
			
			console.log(
				`[ ${ getHourAndMinutes() } ] Message sent with error: ${JSON.stringify(returnedData)}`,
			);
		}
		ch.ack(msg);
	}

	static async health( req, res ){
		res.json({type: true, message: 'AuthRoute working successfuly'});
	}

	static async SubscribeEvents(ch, msg){
		const parsedPayload = JSON.parse(msg.content.toString());

		const { event, data } =  parsedPayload;
		switch (event){
		case 'LOGIN':
			/*
			 * this.loginV2(channel, data, uuid);
			 * this.loginV3(data, uuid);
			 */
			// eslint-disable-next-line no-case-declarations
			this.loginV4(ch, msg, data);
			break;
		default:
			break;
		}

	}

}

export default AuthController;