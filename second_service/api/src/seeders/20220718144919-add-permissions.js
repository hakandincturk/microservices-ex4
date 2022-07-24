'use strict';

module.exports = {
	async up (queryInterface, Sequelize) {
		await queryInterface.bulkInsert('Permissions', [ {
			name: 'permission-one',
			createdAt: new Date(),
			updatedAt: new Date()
		}, 
		{
			name: 'permission-two',
			createdAt: new Date(),
			updatedAt: new Date()
		}, 
		{
			name: 'permission-three',
			createdAt: new Date(),
			updatedAt: new Date()
		}, 
		{
			name: 'permission-four',
			createdAt: new Date(),
			updatedAt: new Date()
		}
		
		], {});
	},

	async down (queryInterface, Sequelize) {
		await queryInterface.bulkDelete('Permissions', null, {});
	}
};
