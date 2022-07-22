import db from '../../src/models';
import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../../src/config/envKeys';

class CheckPermission{

	static async checkPermission (token, permName){
		try {
			const pureToken = token.split(' ')[1];
			const tokenData = await jwt.verify(pureToken, JWT_SECRET);
			console.log('CheckPermission.js -> ', tokenData.user_id);
	
			const result = await db.Users.findOne({
				where: {id: tokenData.user_id},
				attributes: [ 'username' ],
				include: {
					model: db.Roles,
					attributes: [ 'id', 'name' ],
					through: { attributes: [] },
					include: {
						model: db.Permissions,
						where: { name: permName },
						through: { attributes: [] }
					}
				} 
			});

			console.log('checkPerm.js -> ', result);
			if (result.Roles.length === 0) return {type: false, message: 'access denied'};
			else return {type: true};
		}
		catch (error) {
			return { type: false, message: error.message };
		}

	}

}

export default CheckPermission;