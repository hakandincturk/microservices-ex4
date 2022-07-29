import db from '../../src/models';
import consola from 'consola';

class SecondService{

	static async createSecondMethod(data){
		try {

			const result = await db.Seconds.create({
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
			consola.error({message: `InitServıce.js -> createInitMethod -> ${_.message}`, badge: true});
			// return {type: false, message: _.message};
		}
	}

	static async getSecondMethod(){
		try {
			const result = await db.Seconds.findAll();

			if (!result)
				return {type: false, message: 'records not found'};
			else 
				return {type: true, message: 'succesfull', data: result};

		}
		catch (_) {
			consola.error({message: `InitServıce.js -> getInitMethod -> ${_.message}`, badge: true});
			// return {type: false, message: _.message};
		}
	}

	static async getSecondMethodParams(params){
		try {

			const result = await db.Seconds.findOne({where: {
				id: params.id
			}});

			if (!result)
				return {type: false, message: 'record not found'};
			else 
				return {type: true, message: 'succesfull', data: result};

		}
		catch (_) {
			consola.error({message: `InitServıce.js -> getInitMethod -> ${_.message}`, badge: true});
			// return {type: false, message: _.message};
		}
	}

	static async deleteRecord(params){

		const result = await db.Seconds.destroy({where: {
			id: params.id
		}});

		if (result > 0){
			return {type: false, message: 'record not deleted'}; 
		}
		else {
			return {type: true, message: 'succesfull'};			
		} 

	}

	static async updateRecord(data, params){
		const result = await db.Inits.update({
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
		return ({type: true, message: 'init service working successfuly'});		
	}

}

export default SecondService;