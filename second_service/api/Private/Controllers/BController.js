import BService from '../Services/BService';
import { StatusCodes } from 'http-status-codes';
import consola from 'consola';

import { getHourAndMinutes } from '../../src/utils/index';
import RabbitMq from '../../src/utils/RabbitMq';

class BController{

	static async createBMethod(ch, msg, data){
		try {
			const result = await BService.createBMethod(data);

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
			consola.error({message: `BController.js -> ${_.message}`, badge: true});
		}
	}

	static async getBMethod(ch, msg){
		try {
			const result = await BService.getBMethod();

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
			consola.error({message: `BController.js -> ${_.message}`, badge: true});
		}
	}

	static async getBMethodParams(ch, msg, params){
		try {
			const result = await BService.getBMethodParams(params);

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
			consola.error({message: `BController.js -> ${_.message}`, badge: true});
		}
	}

	static async deleteBMethod(ch, msg, params){
		try {
			const result = await BService.deleteRecord(params);

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
			consola.error(`[second_service] -> [BController] error (1) -> ${_.message}`);

			RabbitMq.sendMessageReply(ch, msg, {
				status: StatusCodes.BAD_REQUEST,
				result: {
					message: 'error (1)'
				}
			});
		}
	}

	static async updateBMethod(ch, msg, data, params){
		try {
			const result = await BService.updateRecord(data, params);
			
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
			consola.error(`[first_service] -> [BController] error (1) -> ${_.message}`);

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

export default BController;