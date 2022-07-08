'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class UTypes extends Model {

		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			UTypes.belongsToMany(models.Users, {
				through: models.UserTypes,
				foreignKey: 'utype',
				otherKey: 'user_id'
			});
		}
	
	}
	UTypes.init({
		name: DataTypes.STRING,
		type: DataTypes.INTEGER	
	}, {
		sequelize,
		modelName: 'UTypes'
	});
	return UTypes;
};