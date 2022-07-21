import InitService from '../Services/InitService';
import { StatusCodes } from 'http-status-codes';
import consola from 'consola';

import { getHourAndMinutes } from '../../src/utils/index';

class InitController{

	static async createInitMethod(ch, msg, data){
		try {
			const result = await InitService.createInitMethod(data);

			ch.sendToQueue(
				msg.properties.replyTo,
				Buffer.from(JSON.stringify({
					status: result.type ? StatusCodes.OK : StatusCodes.BAD_REQUEST,
					result
				})),
				{
					correlationId: msg.properties.correlationId
				}
			);
			ch.ack(msg);

			console.log(
				`[ ${ getHourAndMinutes() } ] Message sent: ${{
					status: result.type ? StatusCodes.OK : StatusCodes.BAD_REQUEST,
					result
				}}`, 
			);
		}
		catch (_) {
			consola.error({message: `InitController.js -> ${_.message}`, badge: true});
		}
	}

	static async getInitMethod(ch, msg){
		try {
			const result = await InitService.getInitMethod();

			ch.sendToQueue(
				msg.properties.replyTo,
				Buffer.from(JSON.stringify({
					status: result.type ? StatusCodes.OK : StatusCodes.BAD_REQUEST,
					result
				})),
				{
					correlationId: msg.properties.correlationId
				}
			);
			ch.ack(msg);

			console.log(
				`[ ${ getHourAndMinutes() } ] Message sent: ${{
					status: result.type ? StatusCodes.OK : StatusCodes.BAD_REQUEST,
					result
				}}`, 
			);
		}
		catch (_) {
			consola.error({message: `InitController.js -> ${_.message}`, badge: true});
		}
	}

	static async createNewUser(data, role){

		const result = InitService.createNewUser(data, role); 

	}

	static async first(req, res){
		const result = InitService.first();
		
		if (result.type)
			return res.status(StatusCodes.OK).json({type: true, message: result.message});
		else
			return res.status(StatusCodes.BAD_REQUEST).json({type: false, message: result.message});
	}

	static async health(req, res){
		return res.json({type: true, message: 'init controller working'});
	}

}

export default InitController;