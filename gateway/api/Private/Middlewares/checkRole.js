import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../../src/config/envKeys';

import { AUTH_QUEUE_NAME } from '../../src/config/envKeys';
import { sendMessageToQueue } from '../../src/utils/index';

class CheckRole{

	static checkRole (uType, uName){
		return async (req, res, next) => {
			try {
				
				const token = req.headers.authorization.split(' ')[1];
				const tokenData = await jwt.verify(token, JWT_SECRET);

				const result = await sendMessageToQueue(
					'CHECK_ROLE',
					{
						user: tokenData,
						uType,
						uName
					},
					AUTH_QUEUE_NAME
				);

				console.log('checkRole.js -> ', result);

				if (!result) return res.status(401).json({type: false, message: 'access denied'});
				else if (result.UTypes.length === 0) 
					return res.status(401).json({type: false, message: 'access denied'});
				else next();
			}
			catch (error) {
				return res.json({type: false, message: error.message});
			}
		};
	}

}

export default CheckRole;