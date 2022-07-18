'use strict';

const md5 = require('md5');

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

		await queryInterface.bulkInsert('Users', [ {
			id: 1,
			username: 'usr-fs',
			name: 'userName1',
			email: 'usr-fs@g.co',
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			id: 3,
			username: 'usr-fs-ss',
			name: 'userName1',
			email: 'usr-fs-ss@g.co',
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
		await queryInterface.bulkDelete('Users', null, {});
	}
};
