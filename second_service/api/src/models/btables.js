'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class BTables extends Model {

		/**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
		static associate(models) {
			// define association here
		}
	
	}
	BTables.init({
		name: DataTypes.STRING,
		email: DataTypes.STRING,
		content: DataTypes.STRING
	}, {
		sequelize,
		modelName: 'BTables'
	});
	return BTables;
};