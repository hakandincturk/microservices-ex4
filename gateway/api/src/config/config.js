/* import {DB_HOST, DB_USERNAME, DB_PASSWORD} from './envKeys'; */
const { DB_HOST, DB_USERNAME, DB_PASSWORD } = require('./envKeys');
module.exports = {
	development: {
		username: DB_USERNAME,
		password: DB_PASSWORD,
		database: 'test_dev',
		host: DB_HOST,
		dialect: 'postgres'
	},
	test: {
		username: DB_USERNAME,
		password: DB_PASSWORD,
		database: 'test_test',
		host: DB_HOST,
		dialect: 'postgres'
	},
	production: {
		username: DB_USERNAME,
		password: DB_PASSWORD,
		database: 'test_prod',
		host: DB_HOST,
		dialect: 'postgres'
	}
};

