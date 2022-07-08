'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class UserTypes extends Model {

		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			UserTypes.belongsToMany(models.Users, {
				through: 'UserTypes',
				foreignKey: 'user_id',
				otherKey: 'utype'
			});
		}
	
	}
	UserTypes.init({
		user_id: DataTypes.INTEGER,
		utype: DataTypes.INTEGER
	}, {
		sequelize,
		modelName: 'UserTypes'
	});
	return UserTypes;
};