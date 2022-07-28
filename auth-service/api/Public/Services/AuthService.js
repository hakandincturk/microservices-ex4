import db from '../../src/models';
import md5 from 'md5';
import jwt from 'jsonwebtoken';

import consola from 'consola';

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
			}, {transaction: t});

			if (!user) {
				await t.rollback();
				return {
					type: false,
					message: 'user not created (1)'
				};
			}

			const userType = await db.UTypes.findOne({
				where: {
					name: body.userType
				},
				attributes: [ 'id' ]
			});

			if (!userType){
				await t.rollback();
				return {
					type: false,
					message: 'User not created (3)'
				};
			}
			else {
				const role = await db.Roles.findOne({
					where: {
						name: body.userRole,
						utype: userType.id
					},
					attributes: [ 'id' ]
				});
	
				if (!role){
					await t.rollback();
					return {
						type: false,
						message: 'User not created (2), this type hasnt this role'
					};
				}
				else {
					await db.UserTypes.create({
						user_id: user.id,
						utype: userType.id
					}, {transaction: t});
		
					await db.UserRoles.create({
						user_id: user.id,
						role_id: role.id,
						utype: userType.id
					}, {transaction: t});

					await t.commit();
		
					return {
						type: true,
						message: 'User created',
						data: {
							id: user.id,
							name: user.name,
							email: user.email,
							isDeleted: user.isDeleted
						}
					};
				}	
			}
		}
		catch (_) {
			await t.rollback();
			consola.error(`[authService] -> [register] error0 -> ${_}`);
			return {
				type: false,
				message: `${_}`
			};
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

	static async checkRole(data){
		try {

			const result = await db.Users.findOne({
				where: {id: data.user_id},
				attributes: [ ],
				include: {
					model: db.Roles,
					attributes: [ 'id', 'name' ],
					include: {
						model: db.Permissions,
						where: { name: data.permName, utype: data.uType }, //TODO: is utype neccessary? 
						through: {attributes: []}
					}
				}
			
			});

			if (!result) return ({type: false, message: 'access denied'});
			else if (result.Roles.length === 0) 
				return ({type: false, message: 'access denied'});
			else return ({type: true, message: 'go on'});
		}
		catch (error) {
			consola.error('[AuthService] -> [checkRole] -> [error] ', error.message);

			throw error;
		}
	}

}

export default AuthService;