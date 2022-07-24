'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class RolesAndPermissions extends Model {

		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	
	}
	RolesAndPermissions.init({
		role_id: DataTypes.INTEGER,
		permission_id: DataTypes.INTEGER
	}, {
		sequelize,
		modelName: 'RolesAndPermissions'
	});
	return RolesAndPermissions;
};