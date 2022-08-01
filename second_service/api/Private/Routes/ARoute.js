/* eslint-disable no-case-declarations */
import AContoller from '../Controllers/AController';
import { StatusCodes } from 'http-status-codes';
import consola from 'consola';

import CheckPermission from '../Middlewares/checkPermission';

import { routeWithParams, routeWithoutParams, separateParams } from '../../src/utils/routeHelper';
import RabbitMq from '../../src/utils/RabbitMq';

class ARoute{

	static async subscribeEvents(ch, msg){
		try {
			
			const { data } = JSON.parse(msg.content.toString());
			const token = data.token;
			const reqMethod = data.reqMethod;
			const reqUrl = data.url.split('/');
			let url = '';

			// * url '/A/add' şeklinde geliyor başında ki 'A' kısmını kaldırır
			for (let i = 2;i < reqUrl.length;i++) {
				url += '/' + reqUrl[i];
			}

			switch (url) {
			case routeWithoutParams(url, '/create'):
				switch (reqMethod){
				case 'POST':
					const result = await CheckPermission.checkPermission(token, 'ss-permission-one');
					if (!result.type){
						RabbitMq.sendMessageReply(ch, msg, 
							{
								status: StatusCodes.UNAUTHORIZED,
								result: {
									type: false,
									message: 'acces denied'
								}
							});
					}
					else {
						AContoller.createAMethod(ch, msg, data.data);
					}
					break;
				default:
					RabbitMq.sendMessageReply(ch, msg, 
						{
							status: StatusCodes.BAD_REQUEST,
							result: {
								type: false,
								message: `cannot use ${reqMethod} method in this route ${url}`
							}
						});
					break;
				}
				break;
			case routeWithoutParams(url, '/get'):
				switch (reqMethod) {
				case 'GET':
					const result = await CheckPermission.checkPermission(token, 'ss-permission-one');
					if (!result.type){
						RabbitMq.sendMessageReply(ch, msg, 
							{
								status: StatusCodes.UNAUTHORIZED,
								result: {
									type: false,
									message: 'acces denied'
								}
							});
					}
					else {
						AContoller.getAMethod(ch, msg);
					}
					break;
				
				default:
					RabbitMq.sendMessageReply(ch, msg, 
						{
							status: StatusCodes.BAD_REQUEST,
							result: {
								type: false,
								message: `cannot use ${reqMethod} method in this route ${url}`
							}
						});
					break;
				}
				break;
			case routeWithParams(url, '/get'):
				switch (reqMethod) {
				case 'GET':
					const result = await CheckPermission.checkPermission(token, 'ss-permission-one');
					if (!result.type){
						RabbitMq.sendMessageReply(ch, msg, 
							{
								status: StatusCodes.UNAUTHORIZED,
								result: {
									type: false,
									message: 'acces denied'
								}
							});
					}
					else {
						const params = separateParams(url, [ 'id' ]);

						if (!params.type){
							RabbitMq.sendMessageReply(ch, msg, 
								{
									status: StatusCodes.BAD_REQUEST,
									result: {
										type: false,
										message: 'invalid params, waited {id}'
									}
								});
						}
						else {
							AContoller.getAMethodParams(ch, msg, params.params);

						}

					}

					break;
				
				default:
					RabbitMq.sendMessageReply(ch, msg, 
						{
							status: StatusCodes.BAD_REQUEST,
							result: {
								type: false,
								message: `cannot use ${reqMethod} method in this route ${url}`
							}
						});
					break;
				}
				break;
			case routeWithParams(url, '/delete'):

				switch (reqMethod) {
				case 'DELETE':
					const result = await CheckPermission.checkPermission(token, 'ss-permission-one');
					if (!result.type){
						RabbitMq.sendMessageReply(ch, msg, 
							{
								status: StatusCodes.UNAUTHORIZED,
								result: {
									type: false,
									message: 'acces denied'
								}
							});
					}
					else {
						const params = separateParams(url, [ 'id' ]);
						if (!params.type){
							RabbitMq.sendMessageReply(ch, msg, 
								{
									status: StatusCodes.BAD_REQUEST,
									result: {
										type: false,
										message: 'invalid params, waited {id}'
									}
								});
						}

						AContoller.deleteAMethod(ch, msg, params.params);
					}
					break;
				
				default:
					RabbitMq.sendMessageReply(ch, msg, 
						{
							status: StatusCodes.BAD_REQUEST,
							result: {
								type: false,
								message: `cannot use ${reqMethod} method in this route ${url}`
							}
						});
					break;
				}
				break;
			case routeWithParams(url, '/update'):
				switch (reqMethod) {
				case 'PUT':
					const result = await CheckPermission.checkPermission(token, 'ss-permission-one');
					if (!result.type){
						RabbitMq.sendMessageReply(ch, msg, 
							{
								status: StatusCodes.UNAUTHORIZED,
								result: {
									type: false,
									message: 'acces denied'
								}
							});
					}
					else {
						const params = separateParams(url, [ 'id' ]);
						if (!params.type){
							RabbitMq.sendMessageReply(ch, msg, 
								{
									status: StatusCodes.BAD_REQUEST,
									result: {
										type: false,
										message: 'invalid params, waited {id}'
									}
								});
						}
						AContoller.updateAMethod(ch, msg, data.data, params.params);
					}
					break;
				default:
					console.log('DEFAULT');
					RabbitMq.sendMessageReply(ch, msg, 
						{
							status: StatusCodes.BAD_REQUEST,
							result: {
								type: false,
								message: `cannot use ${reqMethod} method in this route ${url}`
							}
						});
					break;
				}
				break;
			default:
				console.log('DEFAULT');
				RabbitMq.sendMessageReply(ch, msg, 
					{
						status: StatusCodes.BAD_REQUEST,
						result: {
							type: false,
							message: `cannot use ${reqMethod} method in this route ${url}`
						}
					});
				break;
			}
	
		}
		catch (_) {
			consola.error('[SS] -> [ARoute] -> ', _.message);
			RabbitMq.sendMessageReply(ch, msg, 
				{
					status: StatusCodes.BAD_REQUEST,
					result: {
						type: false,
						message: 'something happened and error occured'
					}
				});
			ch.ack(msg);
		}
	}

}

export default ARoute;