import SecondService from '../Services/SecondService';
import { StatusCodes } from 'http-status-codes';
import consola from 'consola';

import { getHourAndMinutes } from '../../src/utils/index';
import RabbitMq from '../../src/utils/RabbitMq';

class SecondController{

	static async createSecondMethod(ch, msg, data){
		try {
			const result = await SecondService.createSecondMethod(data);

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
			consola.error({message: `SecondController.js -> ${_.message}`, badge: true});
		}
	}

	static async getSecondMethod(ch, msg){
		try {
			const result = await SecondService.getSecondMethod();

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
			consola.error({message: `SecondController.js -> ${_.message}`, badge: true});
		}
	}

	static async getSecondMethodParams(ch, msg, params){
		try {
			const result = await SecondService.getSecondMethodParams(params);

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
			consola.error({message: `SecondController.js -> ${_.message}`, badge: true});
		}
	}

	static async deleteSecondMethod(ch, msg, params){
		try {
			const result = await SecondService.deleteRecord(params);

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
			consola.error(`[first_service] -> [SecondController] error (1) -> ${_.message}`);

			RabbitMq.sendMessageReply(ch, msg, {
				status: StatusCodes.BAD_REQUEST,
				result: {
					message: 'error (1)'
				}
			});
		}
	}

	static async updateSecondMethod(ch, msg, data, params){
		try {
			const result = await SecondService.updateRecord(data, params);
			
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
			consola.error(`[first_service] -> [SecondController] error (1) -> ${_.message}`);

			RabbitMq.sendMessageReply(ch, msg, {
				status: StatusCodes.BAD_REQUEST,
				result: {
					message: 'error (1)'
				}
			});
		}
	}

	static async health(req, res){
		return res.json({type: true, message: 'Second controller working'});
	}

}

export default SecondController;