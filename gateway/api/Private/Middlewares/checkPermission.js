import db from '../../src/models';
import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../../src/config/envKeys';

class CheckPermission{

	static checkPermission (permName){
		return async (req, res, next) => {
			try {
				
				const token = req.headers.authorization.split(' ')[1];
				const tokenData = await jwt.verify(token, JWT_SECRET);
				res.status(200).json({type: false, message: 'success', data: token});

				const userData = await db.Users.findOne({
					where: {id: tokenData.user_id},
					attributes: [ 'id' ]
				});

				const result = await db.Users.findOne({
					where: {id: userData.id},
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
				if (result.Roles.length === 0) res.status(401).json({type: false, message: 'access denied'});
				else next();
			}
			catch (error) {
				res.json({type: false, message: error.message});
			}
		};
	}

}

export default CheckPermission;