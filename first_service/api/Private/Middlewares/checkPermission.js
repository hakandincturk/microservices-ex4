import db from '../../src/models';
import jwt from 'jsonwebtoken';
import consola from 'consola';

import { JWT_SECRET } from '../../src/config/envKeys';

import { sendMessageToQueue } from '../../src/utils/index';

class CheckPermission{

	static async checkPermission (token, permName){
		try {
			const pureToken = token.split(' ')[1];
			const tokenData = await jwt.verify(pureToken, JWT_SECRET);
			tokenData.uType = 1;
			tokenData.permName = permName;

			const resData = await sendMessageToQueue(
				global.authChannel,
				{
					url: '/check-role',
					reqMethod: 'POST',
					data: tokenData
				},
				'AUTH_SERVICE.AUTH'
			);

			console.log('[first-service] -> [checkPermission] -> resData', resData);

			const parsedResData = JSON.parse(resData);

			if (!parsedResData.type) return {type: false, message: 'access denied'};
			else return {type: true};
		}
		catch (error) {
			consola.error(error.message);
			return { type: false, message: 'access denied' };
		}

	}

}

export default CheckPermission;