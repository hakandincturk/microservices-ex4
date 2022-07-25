'use strict';

module.exports = {
	async up (queryInterface, Sequelize) {
		/**
		 * Add seed commands here.
		 *
		 * Example:
		 * await queryInterface.bulkInsert('People', [{
		 *   name: 'John Doe',
		 *   isBetaMember: false
		 * }], {});
		 */
		await queryInterface.bulkInsert('UTypes', [ 
			{
				name: 'fs',
				type: 1,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				name: 'ss',
				type: 2,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				name: 'ts',
				type: 3,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				name: 'frs',
				type: 4,
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
		await queryInterface.bulkDelete('UTypes', null, {});

	}
};
