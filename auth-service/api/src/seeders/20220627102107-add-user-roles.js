'use strict';

module.exports = {
	async up (queryInterface, Sequelize) {
		await queryInterface.bulkInsert('UserRoles', [
			{
				user_id: 1,
				role_id: 1,
				utype: 1,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				user_id: 2,
				role_id: 4,
				utype: 2,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				user_id: 3,
				role_id: 3,
				utype: 1,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				user_id: 3,
				role_id: 4,
				utype: 2,
				createdAt: new Date(),
				updatedAt: new Date()
			}
		], {});
	},

	async down (queryInterface, Sequelize) {
		await queryInterface.bulkDelete('UserRoles', null, {});
	}
};
