'use strict';
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('RolesAndPermissions', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			role_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'Roles',
					key: 'id'
				}
			},
			permission_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'Permissions',
					key: 'id'
				}
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
		await queryInterface.dropTable('RolesAndPermissions');
	}
};