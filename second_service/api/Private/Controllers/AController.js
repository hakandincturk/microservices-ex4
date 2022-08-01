import AService from '../Services/AService';
import { StatusCodes } from 'http-status-codes';
import consola from 'consola';

import { getHourAndMinutes } from '../../src/utils/index';
import RabbitMq from '../../src/utils/RabbitMq';

class AController{

	static async createAMethod(ch, msg, data){
		try {
			const result = await AService.createAMethod(data);

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
			consola.error({message: `AController.js -> ${_.message}`, badge: true});
		}
	}

	static async getAMethod(ch, msg){
		try {
			const result = await AService.getAMethod();

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
			consola.error({message: `AController.js -> ${_.message}`, badge: true});
		}
	}

	static async getAMethodParams(ch, msg, params){
		try {
			const result = await AService.getAMethodParams(params);

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
			consola.error({message: `AController.js -> ${_.message}`, badge: true});
		}
	}

	static async deleteAMethod(ch, msg, params){
		try {
			const result = await AService.deleteRecord(params);

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
			consola.error(`[first_service] -> [AController] error (1) -> ${_.message}`);

			RabbitMq.sendMessageReply(ch, msg, {
				status: StatusCodes.BAD_REQUEST,
				result: {
					message: 'error (1)'
				}
			});
		}
	}

	static async updateAMethod(ch, msg, data, params){
		try {
			const result = await AService.updateRecord(data, params);
			
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
			consola.error(`[first_service] -> [AController] error (1) -> ${_.message}`);

			RabbitMq.sendMessageReply(ch, msg, {
				status: StatusCodes.BAD_REQUEST,
				result: {
					message: 'error (1)'
				}
			});
		}
	}

	static async health(req, res){
		return res.json({type: true, message: 'A controller working'});
	}

}

export default AController;