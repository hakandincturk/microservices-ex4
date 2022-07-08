import db from '../../src/models';
import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../../src/config/envKeys';

class CheckRole{

	static checkRole (uType, uName){
		return async (req, res, next) => {
			try {
				
				const token = req.headers.authorization.split(' ')[1];
				const tokenData = await jwt.verify(token, JWT_SECRET);

				const userData = await db.Users.findOne({
					where: {id: tokenData.user_id},
					attributes: [ 'id' ]
				});

				const result = await db.Users.findOne({
					where: {id: userData.id},
					attributes: [ 'username' ],
					include: {
						model: db.UTypes,
						attributes: [ 'id', 'name' ],
						where: {type: uType, name: uName},
						through: { attributes: [] }
					}
				});

				if (!result) return res.status(401).json({type: false, message: 'access denied'});
				else if (result.UTypes.length === 0) 
					return  res.status(401).json({type: false, message: 'access denied'});
				else next();
			}
			catch (error) {
				res.json({type: false, message: error.message});
			}
		};
	}

}

export default CheckRole;