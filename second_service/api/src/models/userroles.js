'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class UserRoles extends Model {

		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			UserRoles.belongsToMany(models.Users, {
				through: 'UserRoles',
				foreignKey: 'user_id',
				otherKey: 'role_id'
			});
		}
	
	}
	UserRoles.init({
		user_id: DataTypes.INTEGER,
		role_id: DataTypes.INTEGER
	}, {
		sequelize,
		modelName: 'UserRoles'
	});
	return UserRoles;
};