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

import { getHourAndMinutes } from '../../src/utils/index';
import { StatusCodes } from 'http-status-codes';

class AuthController{

	/** 
	 * @route POST /public/auth/
	 * @group Auth
	 * @summary Create new user
	 * @param {AuthReq.model} body.body
	 * @returns {object} 200 - Success message
	 * @returns {Error} default - Unexpected error
	 */
	static async register(ch, msg, data){
		let returnedData, isError = false;

		try {

			console.log(data);
			
			const validation = await AuthValidation.registerValidation(data);

			if (!validation.type){
				returnedData = {type: false, message: validation.message};
			}
			else {
				const result = await AuthService.register(data);

				if (result.type) {
					returnedData = {type: true, message: result.message, data: result.data};
				}
				else {
					returnedData = {type: false, status: StatusCodes.FORBIDDEN, message: result.message};
				} 
			}			
		}
		catch (error) {
			isError = true;
			consola.error({message: 'error', badge: true});
			returnedData = {type: false, status: StatusCodes.FORBIDDEN, message: error.message};
		}

		console.log('[AuthController] -> [register] -> returnedData', returnedData);
		
		ch.sendToQueue(
			msg.properties.replyTo,
			Buffer.from(JSON.stringify(returnedData)),
			{
				correlationId: msg.properties.correlationId
			},
		);
		ch.ack(msg);

		if (isError)
			console.log(
				`[ ${ getHourAndMinutes() } ] Message sent with error: ${JSON.stringify(returnedData)}`,
			);
		else
			console.log(
				`[ ${ getHourAndMinutes() } ] Message sent: ${returnedData}`, 
			);
	}

	/**
	 * @route POST /public/auth/login
	 * @group Auth
	 * @summary Login
	 * @param { AuthReqLogin.model } body.body
	 * @returns {object} 200 - Success message
	 * @returns {Error} default - Unexpected error
	 */
	static async login(ch, msg, data){
		let returnedData, isError = false;

		try {
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
		}
		catch (error) {
			isError = true;
			consola.error({message: 'error', badge: true});
			returnedData = {type: false, message: error.message};
		}

		ch.sendToQueue(
			msg.properties.replyTo,
			Buffer.from(JSON.stringify(returnedData)),
			{
				correlationId: msg.properties.correlationId
			},
		);
		ch.ack(msg);

		if (isError)
			console.log(
				`[ ${ getHourAndMinutes() } ] Message sent with error: ${JSON.stringify(returnedData)}`,
			);
		else
			console.log(
				`[ ${ getHourAndMinutes() } ] Message sent: ${returnedData}`, 
			);
	}

	static async checkPermission(ch, msg, data){
		let returnedData, isError = false;

		try {
			const result = await AuthService.checkPermission(data);

			if (result.type) {
				returnedData = {type: true, message: result.message, data: result.data};
			}
			else {
				returnedData = {type: false, message: result.message};
			} 
		}
		catch (error) {
			isError = true;
			consola.error({message: 'error', badge: true});
			returnedData = {type: false, message: error.message};
			
		}
		ch.sendToQueue(
			msg.properties.replyTo,
			Buffer.from(JSON.stringify(returnedData)),
			{
				correlationId: msg.properties.correlationId
			},
		);
		ch.ack(msg);

		if (isError)
			console.log(
				`[ ${ getHourAndMinutes() } ] Message sent with error: ${JSON.stringify(returnedData)}`,
			);
		else
			console.log(
				`[ ${ getHourAndMinutes() } ] Message sent: ${returnedData}`, 
			);
	
	}

	static async checkRole(ch, msg, data){
		let returnedData, isError = false;

		try {
			const result = await AuthService.checkRole(data);

			if (result.type) {
				returnedData = {type: true};
			}
			else {
				returnedData = {type: false, message: result.message};
			} 
		}
		catch (error) {
			isError = true;
			consola.error({message: 'error', badge: true});
			returnedData = {type: false, message: error.message};
			
		}

		ch.sendToQueue(
			msg.properties.replyTo,
			Buffer.from(JSON.stringify(returnedData)),
			{
				correlationId: msg.properties.correlationId
			},
		);
		ch.ack(msg);

		if (isError)
			console.log(
				`[ ${ getHourAndMinutes() } ] Message sent with error: ${JSON.stringify(returnedData)}`,
			);
		else
			console.log(
				`[ ${ getHourAndMinutes() } ] Message sent: ${returnedData}`, 
			);
	
	}

	static async health( req, res ){
		res.json({type: true, message: 'AuthRoute working successfuly'});
	}

	static async SubscribeEvents(ch, msg){
		const parsedPayload = JSON.parse(msg.content.toString());

		const { event, data } =  parsedPayload;
		switch (event){
		case 'LOGIN':
			this.login(ch, msg, data);
			break;
			
		case 'REGISTER': 
			this.register(ch, msg, data);
			break;
			
		case 'CHECK_ROLE': 
			this.checkRole(ch, msg, data);
			break;

		default:
			break;
		}

	}

}

export default AuthController;