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

import { v4 as uuidv4 } from 'uuid';

import AuthService from '../Services/AuthService';
import AuthValidation from '../Validation/AuthValidation';
import consola from 'consola';

import { AUTH_QUEUE_NAME } from '../../src/config/envKeys';

import { sendMessageToQueue } from '../../src/utils/index';

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

			const message = req.body;

			const resData = await sendMessageToQueue(message, AUTH_QUEUE_NAME);

			return res.json(JSON.parse(resData));

			/*
			 * const channel = req.channel;
			 * const uuid = uuidv4();
			 */

			// consola.info('gateway->AuthController.js->uuid, ', uuid);
			
			// const data = req.body;

			// publishMessage(channel, AUTH_BINDING_KEY, JSON.stringify({event: 'LOGIN', data, uuid: uuid}));

			/*
			 * const result = 
			 * await subscribeReplyMessage(channel, AUTH_BINDING_REPLY_KEY, AUTH_QUEUE_REPLY_NAME, uuid);
			 * let returnedData;
			 * const appQueue = await channel.assertQueue(AUTH_QUEUE_REPLY_NAME);
			 * let isMatch = false, a;
			 * channel.bindQueue(appQueue.queue, EXCHANGE_NAME, AUTH_BINDING_REPLY_KEY);
			 *  channel.consume(appQueue.queue, async (consumeData) => {
			 * 	console.log(`${AUTH_BINDING_REPLY_KEY} recieved data`);
			 * 	/ console.log(data.content.toString());
			 * 	if (!isMatch) {
			 * 		const parsedData = JSON.parse(consumeData.content.toString());
			 */

			/*
			 * 		/ eslint-disable-next-line eqeqeq
			 * 		if (parsedData.uuid == uuid){
			 * 			isMatch = true;
			 * 			consola.success(`data match, ${uuid}, `, parsedData);
			 * 			/ a = await returnResponseTrue(req, res, parsedData.result);
			 * 			channel.ack(consumeData);
			 * 			consola.debug('acked msg, ', consumeData.content.toString());
			 * 			returnedData = parsedData.result; 
			 * 		}
			 * 		else {
			 * 			consola.error(`data doesnt match, ${uuid}, `, parsedData.uuid);
			 * 		}
			 * 	}
			 * 	process.exit();
			 * });
			 * consola.info('gateway->authcontroller.js ', uuid, returnedData);
			 * if (a) return res.json(a);
			 * if ( isMatch === false ) return res.status(403).json({type: false, message: 'error1'});
			 */
		}

		catch (error) {
			return res.json({type: false, message: 'error0, ' + error.message});
		}
	}

	static async health( req, res ){
		res.json({type: true, message: 'AuthRoute working successfuly'});
	}

}

module.exports = AuthController;