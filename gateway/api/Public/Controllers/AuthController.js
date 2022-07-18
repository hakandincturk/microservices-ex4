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

import { AUTH_QUEUE_NAME, CREATE_NEW_USER_BINDING_KEY } from '../../src/config/envKeys';

import { sendMessageToQueue, createChannel, publishMessage } from '../../src/utils/index';

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

			const message = req.body;

			const resData = await sendMessageToQueue('REGISTER', message, AUTH_QUEUE_NAME);
			
			const data = JSON.parse(resData);
			if (!data.type) return res.status(403).json(data);
			else {
				const channel = await createChannel();
				await publishMessage(channel, CREATE_NEW_USER_BINDING_KEY, JSON.stringify({
					services: [
						'fs_service:user',
						'ss_service:admin'
					],
					data
				}));
				channel.close();

				return res.status(200).json(data);
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

			const resData = await sendMessageToQueue('LOGIN', message, AUTH_QUEUE_NAME);

			const data = JSON.parse(resData);

			if (!data.type) return res.status(403).json(data);
			else return res.status(200).json(data);
			
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