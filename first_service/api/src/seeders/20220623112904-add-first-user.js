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
			username: 'usr',
			name: 'userName',
			surname: 'userSurname',
			email: 'usr@g.co',
			password: md5('123456'),
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
