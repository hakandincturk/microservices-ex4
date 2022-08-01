import db from '../../src/models';
import consola from 'consola';

class AService{

	static async createAMethod(data){
		try {

			console.log(data);

			const result = await db.ATables.create({
				phone: data.phone,
				city: data.city,
				age: data.age
			});

			if (!result)
				return {type: false, message: 'record not created'};
			else 
				return {type: true, message: 'succesfull', data: result};

		}
		catch (_) {
			consola.error({message: `AServıce.js -> createAMethod -> ${_.message}`, badge: true});
			// return {type: false, message: _.message};
		}
	}

	static async getAMethod(){
		try {
			const result = await db.ATables.findAll();

			if (!result)
				return {type: false, message: 'records not found'};
			else 
				return {type: true, message: 'succesfull', data: result};

		}
		catch (_) {
			consola.error({message: `AServıce.js -> getAMethod -> ${_.message}`, badge: true});
			// return {type: false, message: _.message};
		}
	}

	static async getAMethodParams(params){
		try {

			const result = await db.ATables.findOne({where: {
				id: params.id
			}});

			if (!result)
				return {type: false, message: 'record not found'};
			else 
				return {type: true, message: 'succesfull', data: result};

		}
		catch (_) {
			consola.error({message: `AServıce.js -> getAMethod -> ${_.message}`, badge: true});
			// return {type: false, message: _.message};
		}
	}

	static async deleteRecord(params){

		const result = await db.ATables.destroy({where: {
			id: params.id
		}});

		if (result > 0){
			return {type: true, message: 'succesfull'};			
		}
		else {
			return {type: false, message: 'record not deleted'}; 
		} 

	}

	static async updateRecord(data, params){
		const result = await db.ATables.update({
			phone: data.phone,
			city: data.city,
			age: data.age
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
		return ({type: true, message: 'A service working successfuly'});		
	}

}

export default AService;