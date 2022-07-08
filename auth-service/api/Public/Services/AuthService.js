import db from '../../src/models';
import md5 from 'md5';
import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../../src/config/envKeys';

class AuthService{

	static async register(body){

		const t = await db.sequelize.transaction();

		try {

			const password = md5(body.password);

			const isEmailTaken = await db.Users.findOne({where: { email: body.email }});		
			if (isEmailTaken) return {
				type: false,
				message: 'Email is already taken.'
			};

			const isUsernameTaken = await db.Users.findOne({where: { username: body.username }});
			if (isUsernameTaken) return {
				type: false,
				message: 'Username is already taken'
			};

			const user = await db.Users.create({
				username: body.username,
				email: body.email,
				password,
				name: body.name,
				surname: body.surname,
				isDeleted: 0
			}, {transction: t});

			await t.commit();

			if (!user) {
				return {
					type: false,
					message: 'user not created'
				};
			}

			return {
				type: true,
				message: 'User created'
			};
		}
		catch (error) {
			await t.rollback();
			throw error;
		}
	}

	static async login(body){
		try {

			const user = await db.Users.findOne({where: {email: body.email, password: md5(body.password) }});

			if (!user) return {
				type: false,
				message: 'Email or password is wrong. Invalid login credentials'
			};

			const token = jwt.sign(
				{
					user_id: user.id,
					username: user.username,
					email: user.email
				},
				JWT_SECRET,
				{ expiresIn: 86400 }
			);
	
			return {
				type: true,
				message: 'You are now logged in.',
				token: `Bearer ${token}`
			};	
		}
		catch (error) {
			console.log(error);
			throw error;
		}
	}

}

export default AuthService;