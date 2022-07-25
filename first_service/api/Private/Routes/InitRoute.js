/* eslint-disable no-case-declarations */
import InitContoller from '../Controllers/InitController';
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

			// * url '/init/add' şeklinde geliyor başında ki 'init' kısmını kaldırır
			for (let i = 2;i < reqUrl.length;i++) {
				url += '/' + reqUrl[i];
			}

			switch (url) {
			case '/add':
				switch (reqMethod){
				case 'POST':
					const result = await CheckPermission.checkPermission(token, 'fs-permission-one');

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
					const permissionControl = await CheckPermission.checkPermission(token, 'fs-permission-one');

					console.log(`[InitRoute] -> ${url} -> checkPerm`, permissionControl);

					if (!permissionControl.type){
						ch.sendToQueue(
							msg.properties.replyTo,
							Buffer.from(JSON.stringify({
								status: StatusCodes.UNAUTHORIZED,
								result: permissionControl
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
			case '/show':
				switch (reqMethod){
				case 'POST':
					const result = await CheckPermission.checkPermission(token, 'fs-permission-three');

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
					const permissionControl = await CheckPermission.checkPermission(token, 'fs-permission-three');

					console.log(`[InitRoute] -> ${url} -> checkPerm`, permissionControl);

					if (!permissionControl.type){
						ch.sendToQueue(
							msg.properties.replyTo,
							Buffer.from(JSON.stringify({
								status: StatusCodes.UNAUTHORIZED,
								result: permissionControl
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
		catch (_) {
			consola.error('[FS] -> [InitRoute] -> ', _.message);
		}
	}

}

export default InitRoute;