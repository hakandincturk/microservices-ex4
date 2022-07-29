import InitService from '../Services/InitService';
import { StatusCodes } from 'http-status-codes';
import consola from 'consola';

import { getHourAndMinutes } from '../../src/utils/index';
import RabbitMq from '../../src/utils/RabbitMq';

class InitController{

	static async createInitMethod(ch, msg, data){
		try {
			const result = await InitService.createInitMethod(data);

			RabbitMq.sendMessageReply(ch, msg, {
				status: result.type ? StatusCodes.OK : StatusCodes.BAD_REQUEST,
				result
			});

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

			RabbitMq.sendMessageReply(ch, msg, {
				status: result.type ? StatusCodes.OK : StatusCodes.BAD_REQUEST,
				result
			});

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

	static async getInitMethodParams(ch, msg, params){
		try {
			const result = await InitService.getInitMethodParams(params);

			RabbitMq.sendMessageReply(ch, msg, {
				status: result.type ? StatusCodes.OK : StatusCodes.BAD_REQUEST,
				result
			});

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

	static async deleteInitMethod(ch, msg, params){
		try {
			const result = await InitService.deleteRecord(params);

			RabbitMq.sendMessageReply(ch, msg, {
				status: result.type ? StatusCodes.OK : StatusCodes.BAD_REQUEST,
				result
			});

			console.log(
				`[ ${ getHourAndMinutes() } ] Message sent: ${{
					status: result.type ? StatusCodes.OK : StatusCodes.BAD_REQUEST,
					result
				}}`, 
			);
		}
		catch (_) {
			consola.error(`[first_service] -> [InitController] error (1) -> ${_.message}`);

			RabbitMq.sendMessageReply(ch, msg, {
				status: StatusCodes.BAD_REQUEST,
				result: {
					message: 'error (1)'
				}
			});
		}
	}

	static async updateInitMethod(ch, msg, data, params){
		try {
			const result = await InitService.updateRecord(data, params);
			
			RabbitMq.sendMessageReply(ch, msg, {
				status: result.type ? StatusCodes.OK : StatusCodes.BAD_REQUEST,
				result
			});

			console.log(
				`[ ${ getHourAndMinutes() } ] Message sent: ${{
					status: result.type ? StatusCodes.OK : StatusCodes.BAD_REQUEST,
					result
				}}`, 
			);
		}
		catch (_) {
			consola.error(`[first_service] -> [InitController] error (1) -> ${_.message}`);

			RabbitMq.sendMessageReply(ch, msg, {
				status: StatusCodes.BAD_REQUEST,
				result: {
					message: 'error (1)'
				}
			});
		}
	}

	static async health(req, res){
		return res.json({type: true, message: 'init controller working'});
	}

}

export default InitController;