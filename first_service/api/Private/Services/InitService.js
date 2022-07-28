import db from '../../src/models';
import consola from 'consola';

class InitService{

	static async createInitMethod(data){
		try {

			console.log(data);

			const result = await db.Inits.create({
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
			consola.error({message: `InitServıce.js -> createInitMethod -> ${_.message}`, badge: true});
			// return {type: false, message: _.message};
		}
	}

	static async getInitMethod(){
		try {
			const result = await db.Inits.findAll();

			if (!result)
				return {type: false, message: 'record not created'};
			else 
				return {type: true, message: 'succesfull', data: result};

		}
		catch (_) {
			consola.error({message: `InitServıce.js -> getInitMethod -> ${_.message}`, badge: true});
			// return {type: false, message: _.message};
		}
	}

	static async getInitMethodParams(params){
		try {

			const result = await db.Inits.findAll({where: {
				id: params.id
			}});

			if (!result)
				return {type: false, message: 'record not created'};
			else 
				return {type: true, message: 'succesfull', data: result};

		}
		catch (_) {
			consola.error({message: `InitServıce.js -> getInitMethod -> ${_.message}`, badge: true});
			// return {type: false, message: _.message};
		}
	}

	static async deleteRecord(params){

		const result = await db.Inits.destroy({where: {
			id: params.id
		}});

		console.log('deleteRecord -> ', result);

		if (result > 0)
			return {type: false, message: 'record not deleted'};
		else 
			return {type: true, message: 'succesfull'};

	}

	static async first(){
		return ({type: true, message: 'init service working successfuly'});		
	}

}

export default InitService;