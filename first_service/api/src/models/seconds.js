'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Seconds extends Model {

		/**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
		static associate(models) {
			// define association here
		}
	
	}
	Seconds.init({
		phone: DataTypes.STRING,
		city: DataTypes.STRING,
		age: DataTypes.INTEGER
	}, {
		sequelize,
		modelName: 'Seconds'
	});
	return Seconds;
};