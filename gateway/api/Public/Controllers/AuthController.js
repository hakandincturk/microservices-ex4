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

import { sendMessageToQueue} from '../../src/utils/index';

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
			const reqUrl = req.originalUrl.slice(1, req.originalUrl.length).split('/');
			const reqMethod = req.method;

			let newUrl = '/';

			for (let i = 1;i < reqUrl.length;i++) {
				newUrl += reqUrl[i] + '/';				
			}

			newUrl = newUrl.slice(0, newUrl.length-1);
			const bindingAndQueueKey =  `AUTH_SERVICE.${reqUrl[0].toUpperCase()}`;

			const resData = await sendMessageToQueue(
				global.authChannel,
				{
					url: newUrl,
					reqMethod,
					data: message
				},
				bindingAndQueueKey
			);
			
			const parsedResData = JSON.parse(resData);

			console.log('[gateway] -> [AuthController] -> [register] -> parsedData', parsedResData);
			
			if (!parsedResData.type) return res.status(parsedResData.status).json(parsedResData);
			else {
				return res.status(200).json(parsedResData);
			}
		}
		catch (error) {
			return res.json({type: false, message: error.message});
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
			const reqUrl = req.originalUrl.slice(1, req.originalUrl.length).split('/');
			const reqMethod = req.method;

			let newUrl = '/';

			for (let i = 1;i < reqUrl.length;i++) {
				newUrl += reqUrl[i] + '/';				
			}

			newUrl = newUrl.slice(0, newUrl.length-1);

			const bindingAndQueueKey =  `AUTH_SERVICE.${reqUrl[0].toUpperCase()}`;
			
			const resData = await sendMessageToQueue(
				global.authChannel,
				{
					url: newUrl,
					reqMethod,
					data: message
				},
				bindingAndQueueKey
			);
			
			const parsedResData = JSON.parse(resData);

			if (!parsedResData.type) return res.status(403).json(parsedResData);
			else return res.status(200).json(parsedResData);
			
		}
		catch (error) {
			return res.json({type: false, message: 'error0, ' + error.message});
		}
	}

	static async health( req, res ){
		res.json({type: true, message: 'AuthRoute working successfuly'});
	}

}

export default AuthController;