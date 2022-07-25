'use strict';

module.exports = {
	async up (queryInterface, Sequelize) {
		await queryInterface.bulkInsert('Permissions', [ 
			{
				name: 'fs-permission-one',
				createdAt: new Date(),
				updatedAt: new Date(),
				utype: 1
			}, 
			{
				name: 'fs-permission-two',
				createdAt: new Date(),
				updatedAt: new Date(),
				utype: 1
			}, 
			{
				name: 'fs-permission-three',
				createdAt: new Date(),
				updatedAt: new Date(),
				utype: 1
			}, 
			{
				name: 'fs-permission-four',
				createdAt: new Date(),
				updatedAt: new Date(),
				utype: 1
			},
			{
				name: 'ss-permission-one',
				createdAt: new Date(),
				updatedAt: new Date(),
				utype: 2
			}, 
			{
				name: 'ss-permission-two',
				createdAt: new Date(),
				updatedAt: new Date(),
				utype: 2
			}, 
			{
				name: 'ss-permission-three',
				createdAt: new Date(),
				updatedAt: new Date(),
				utype: 2
			}, 
			{
				name: 'ss-permission-four',
				createdAt: new Date(),
				updatedAt: new Date(),
				utype: 2
			},
			{
				name: 'ts-permission-one',
				createdAt: new Date(),
				updatedAt: new Date(),
				utype: 3
			}, 
			{
				name: 'ts-permission-two',
				createdAt: new Date(),
				updatedAt: new Date(),
				utype: 3
			}, 
			{
				name: 'ts-permission-three',
				createdAt: new Date(),
				updatedAt: new Date(),
				utype: 3
			}, 
			{
				name: 'ts-permission-four',
				createdAt: new Date(),
				updatedAt: new Date(),
				utype: 3
			}
		
		], {});
	},

	async down (queryInterface, Sequelize) {
		await queryInterface.bulkDelete('Permissions', null, {});

	}
};
