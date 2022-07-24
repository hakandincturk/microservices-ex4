'use strict';

module.exports = {
	async up (queryInterface, Sequelize) {
		await queryInterface.bulkInsert('RolesAndPermissions', [
			{
				role_id: 1,
				permission_id: 1,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				role_id: 1,
				permission_id: 2,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				role_id: 2,
				permission_id: 3,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				role_id: 2,
				permission_id: 4,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				role_id: 3,
				permission_id: 2,
				createdAt: new Date(),
				updatedAt: new Date()
			},
      
			{
				role_id: 3,
				permission_id: 3,
				createdAt: new Date(),
				updatedAt: new Date()
			}
		], {});
	},

	async down (queryInterface, Sequelize) {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
	}
};
