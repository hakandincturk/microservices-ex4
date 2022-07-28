import AuthController from '../Controllers/AuthController';
import { StatusCodes } from 'http-status-codes';

import consola from 'consola';
import RabbitMq from '../../src/utils/RabbitMq';

class AuthRoute{

	static async subscribeEvents( ch, msg){
		try {
			const { data } = JSON.parse(msg.content.toString());

			const reqMethod = data.reqMethod;
			const reqUrl = data.url.split('/');
			let url = '';

			// * url '/auth/login' şeklinde geliyor başında ki 'init' kısmını kaldırır
			for (let i = 1;i < reqUrl.length;i++) {
				url += '/' + reqUrl[i];
			}

			switch (url) {
			case '/login':
				switch (reqMethod){
				case 'POST':
					AuthController.login(ch, msg, data.data);
					break;
				}
				break;
			case '/':
				switch (reqMethod){
				case 'POST':
				
					AuthController.register(ch, msg, data.data);
					break;
				default:
					RabbitMq.sendMessageReply(ch, msg,
						{
							status: StatusCodes.UNAUTHORIZED,
							result: {
								type: false,
								message: `cannot use ${reqMethod} method in this route`
							}
						});
					break;
				}
				break;
			case '/check-role':
				switch (reqMethod){
				case 'POST':
					AuthController.checkRole(ch, msg, data.data);
					break;
				}
				break;
			case '/health':
				AuthController.health(ch, msg, data.data);
				break;
			default:
				break;
			}
		}
		catch (_) {
			consola.error('[AUTH] -> [AuthRoute] -> ', _.message);
		}
	}

}

export default AuthRoute;

