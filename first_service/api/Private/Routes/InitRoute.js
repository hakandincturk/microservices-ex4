/* eslint-disable no-case-declarations */
import InitContoller from '../Controllers/InitController';
import { StatusCodes } from 'http-status-codes';
import consola from 'consola';

import CheckPermission from '../Middlewares/checkPermission';

import { routeWithParams, routeWithoutParams, separateParams } from '../../src/utils/routeHelper';

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
			case routeWithoutParams(url, '/add'):
				switch (reqMethod){
				case 'POST':
					const result = await CheckPermission.checkPermission(token, 'fs-permission-one');
	
					if (!result.type){
						ch.sendToQueue(
							msg.properties.replyTo,
							Buffer.from(JSON.stringify({
								status: StatusCodes.UNAUTHORIZED,
								result: {
									type: false,
									message: 'access denied'
								}
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

				default:
					ch.sendToQueue(
						msg.properties.replyTo,
						Buffer.from(JSON.stringify({
							status: StatusCodes.UNAUTHORIZED,
							result: {
								type: false,
								message: `cannot use ${reqMethod} method in this route`
							}
						})),
						{
							correlationId: msg.properties.correlationId
						}
					);
					ch.ack(msg);
					break;
				}
				break;
			case routeWithoutParams(url, '/show'):
			case routeWithParams(url, '/take'):
				console.log('routeWithParams /take');

				const params = separateParams(url, [ 'id' ]);

				if (!params.type){
					ch.sendToQueue(
						msg.properties.replyTo,
						Buffer.from(JSON.stringify({
							status: StatusCodes.BAD_REQUEST,
							result: {
								type: false,
								message: 'params required'
							}
						})),
						{
							correlationId: msg.properties.correlationId
						}
					);
					ch.ack(msg);
				}
				else {
					switch (reqMethod){
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
							InitContoller.getInitMethodParams(ch, msg, params.params);				
						}
						break;
					}
				}
				
				break;
			case routeWithoutParams(url, '/take'):

				console.log('routeWithoutParams /take');
	
				switch (reqMethod){
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
			default:
				console.log('DEFAULT');
				ch.sendToQueue(
					msg.properties.replyTo,
					Buffer.from(JSON.stringify({
						status: StatusCodes.BAD_REQUEST,
						result: {
							type: false,
							message: 'error'
						}
					})),
					{
						correlationId: msg.properties.correlationId
					}
				);
				ch.ack(msg);
				break;
			}
	
		}
		catch (_) {
			consola.error('[FS] -> [InitRoute] -> ', _.message);
			ch.ack(msg);
		}
	}

}

export default InitRoute;