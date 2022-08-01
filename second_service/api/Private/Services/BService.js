import db from '../../src/models';
import consola from 'consola';

class BService{

	static async createBMethod(data){
		try {

			console.log(data);

			const result = await db.BTables.create({
				name: data.name,
				email: data.email,
				content: data.content
			});

			if (!result)
				return {type: false, message: 'record not created'};
			else 
				return {type: true, message: 'succesfull', data: result};

		}
		catch (_) {
			consola.error({message: `BServıce.js -> createBMethod -> ${_.message}`, badge: true});
			// return {type: false, message: _.message};
		}
	}

	static async getBMethod(){
		try {
			const result = await db.BTables.findAll();

			if (!result)
				return {type: false, message: 'records not found'};
			else 
				return {type: true, message: 'succesfull', data: result};

		}
		catch (_) {
			consola.error({message: `BServıce.js -> getBMethod -> ${_.message}`, badge: true});
			// return {type: false, message: _.message};
		}
	}

	static async getBMethodParams(params){
		try {

			const result = await db.BTables.findOne({where: {
				id: params.id
			}});

			if (!result)
				return {type: false, message: 'record not found'};
			else 
				return {type: true, message: 'succesfull', data: result};

		}
		catch (_) {
			consola.error({message: `BServıce.js -> getBMethod -> ${_.message}`, badge: true});
			// return {type: false, message: _.message};
		}
	}

	static async deleteRecord(params){

		const result = await db.BTables.destroy({where: {
			id: params.id
		}});

		console.log('[BService] ->  deleteRecord ', result);

		if (result > 0){
			return {type: true, message: 'succesfull'};			

		}
		else {
			return {type: false, message: 'record not deleted'}; 
		} 

	}

	static async updateRecord(data, params){
		const result = await db.BTables.update({
			name: data.name,
			email: data.email,
			content: data.content
		}, {
			where: {
				id: params.id
			}
		});

		if (!result){
			return {type: false, message: 'record not updated'}; 
		}
		else {
			return {type: true, message: 'succesfull'};			
		} 
	}

	static async first(){
		return ({type: true, message: 'B service working successfuly'});		
	}

}

export default BService;