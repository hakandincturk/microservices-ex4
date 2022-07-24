/* eslint-disable no-case-declarations */
import AService from '../Controllers/AController';
import { StatusCodes } from 'http-status-codes';
import consola from 'consola';

import CheckPermission from '../Middlewares/checkPermission';

class InitRoute{

	static async subscribeEvents(ch, msg){
		try {
			
			const { data } = JSON.parse(msg.content.toString());
			const token = data.token;
			const reqMethod = data.reqMethod;
			const reqUrl = data.url.split('/');
			let url = '';

			// * url '/a/add' şeklinde geliyor başında ki 'init' kısmını kaldırır
			for (let i = 2;i < reqUrl.length;i++) {
				url += '/' + reqUrl[i];
			}

			switch (url) {
			case '/first-route':
				switch (reqMethod){
				case 'POST':
					const result = await CheckPermission.checkPermission(token, 'permission-one');
					if (!result.type){
						ch.sendToQueue(
							msg.properties.replyTo,
							Buffer.from(JSON.stringify({
								status: StatusCodes.UNAUTHORIZED,
								result: 'access denied'
							})),
							{
								correlationId: msg.properties.correlationId
							}
						);
						ch.ack(msg);
					}
					else {
						AService.createInitMethod(ch, msg, data.data);
					}
					break;
				case 'GET':
					const checkPerm = await CheckPermission.checkPermission(token, 'permission-one');

					if (!checkPerm.type){
						ch.sendToQueue(
							msg.properties.replyTo,
							Buffer.from(JSON.stringify({
								status: StatusCodes.UNAUTHORIZED,
								result: checkPerm
							})),
							{
								correlationId: msg.properties.correlationId
							}
						);
						ch.ack(msg);
					}
					else {
						AService.getInitMethod(ch, msg);				
					}
					break;
				}
				break;
			default:
				break;
			}
	
		}
		catch (_) {
			consola.error('[FS] -> [InitRoute] -> ', _.message);
		}
	}

}

export default InitRoute;