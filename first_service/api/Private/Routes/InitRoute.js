/* eslint-disable no-case-declarations */
import InitContoller from '../Controllers/InitController';
import { StatusCodes } from 'http-status-codes';

import CheckPermission from '../Middlewares/checkPermission';

class InitRoute{

	static async subscribeEvents(ch, msg){
		const { data } = JSON.parse(msg.content.toString());
		
		const token = data.token;
		const reqMethod = data.reqMethod;
		const reqUrl = data.url.split('/');
		let url = '';

		// * url '/init/add' şeklinde geliyor başında ki 'init' kısmını kaldırır
		for (let i = 2;i < reqUrl.length;i++) {
			url += '/' + reqUrl[i];
		}

		switch (url) {
		case '/add':
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
					InitContoller.createInitMethod(ch, msg, data.data);
				}
				break;
			case 'GET':
				const checkPerm = await CheckPermission.checkPermission(token, 'permission-two');

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
					InitContoller.getInitMethod(ch, msg);				
				}
				break;
			}
			break;
		default:
			break;
		}
	}

}

export default InitRoute;