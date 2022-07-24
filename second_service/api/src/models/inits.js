'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Inits extends Model {

		/**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
		static associate(models) {
			// define association here
		}
	
	}
	Inits.init({
		name: DataTypes.STRING,
		email: DataTypes.STRING,
		content: DataTypes.STRING
	}, {
		sequelize,
		modelName: 'Inits'
	});
	return Inits;
};