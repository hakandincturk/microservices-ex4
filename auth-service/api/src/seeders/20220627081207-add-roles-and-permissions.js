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
			},

			{
				role_id: 4,
				permission_id: 5,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				role_id: 4,
				permission_id: 6,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				role_id: 5,
				permission_id: 7,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				role_id: 5,
				permission_id: 8,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				role_id: 6,
				permission_id: 6,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				role_id: 6,
				permission_id: 7,
				createdAt: new Date(),
				updatedAt: new Date()
			},

			{
				role_id: 7,
				permission_id: 9,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				role_id: 7,
				permission_id: 10,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				role_id: 8,
				permission_id: 11,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				role_id: 8,
				permission_id: 12,
				createdAt: new Date(),
				updatedAt: new Date()
			}
		], {});
	},

	async down (queryInterface, Sequelize) {
		
	}
};
