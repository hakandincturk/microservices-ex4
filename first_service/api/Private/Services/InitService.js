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

	static async createNewUser(data, role){

		// TODO kullanıcıyı fs_service'in kendi veritabanına bağla ve yetkileri buradan getir.
		console.log(data);

		// 	const t = await db.sequelize.transaction();

		// 	try {

		/*
		 * 		const user = await db.Users.create({
		 * 			username: data.username,
		 * 			email: data.email,
		 * 			isDeleted: 0
		 * 		}, {transction: t});
		 */

		// 		await t.commit();

		/*
		 * 		if (!user) {
		 * 			return {
		 * 				type: false,
		 * 				message: 'user not created'
		 * 			};
		 * 		}
		 */

	/*
	 * 		return {
	 * 			type: true,
	 * 			message: 'User created'
	 * 		};
	 * 	}
	 * 	catch (error) {
	 * 		await t.rollback();
	 * 		throw error;
	 * 	}
	 * }
	 */
	}

	static async first(){
		return ({type: true, message: 'init service working successfuly'});		
	}

}

export default InitService;