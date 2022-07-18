'use strict';
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('Users', {
			id: {
				type: Sequelize.STRING,
				uniqe: true,
				allowNull: false
			},
			email: {
				type: Sequelize.STRING,
				uniqe: true
			},
			username: {
				type: Sequelize.STRING
			},
			name: {
				type: Sequelize.STRING
			},
			isDeleted: {
				type: Sequelize.BOOLEAN,
				defaultValue: false
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			}
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('Users');
	}
};