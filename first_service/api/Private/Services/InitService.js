import db from '../../src/models';

class InitService{

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

}

export default InitService;