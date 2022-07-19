import InitService from '../Services/InitService';
import { StatusCodes } from 'http-status-codes';
class InitController{

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