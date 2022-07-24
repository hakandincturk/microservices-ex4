'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Users extends Model {

		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			Users.belongsToMany(models.Roles, {
				through: models.UserRoles,
				foreignKey: 'user_id',
				otherKey: 'role_id'
			});
		}
	
	}
	Users.init({
		username: DataTypes.STRING,
		name: DataTypes.STRING,
		email: DataTypes.STRING,
		name: DataTypes.STRING,
		isDeleted: DataTypes.BOOLEAN
	}, {
		sequelize,
		modelName: 'Users'
	});
	return Users;
};