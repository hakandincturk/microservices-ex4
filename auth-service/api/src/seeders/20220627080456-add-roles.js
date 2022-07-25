'use strict';

module.exports = {
	async up (queryInterface, Sequelize) {
		await queryInterface.bulkInsert('Roles', [ 
			{
				name: 'fs-role-one',
				utype: 1,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				name: 'fs-role-two',
				utype: 1,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				name: 'fs-role-three',
				utype: 1,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				name: 'ss-role-one',
				utype: 2,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				name: 'ss-role-two',
				utype: 2,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				name: 'ss-role-three',
				utype: 2,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				name: 'ts-role-one',
				utype: 3,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				name: 'ts-role-two',
				utype: 3,
				createdAt: new Date(),
				updatedAt: new Date()
			}
      
		], {});
	},

	async down (queryInterface, Sequelize) {
		await queryInterface.bulkDelete('Roles', null, {});
	}
};
