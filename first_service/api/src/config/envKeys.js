require('dotenv').config();

module.exports = { 
	DB_HOST: process.env.DB_HOST,
	DB_USERNAME: process.env.DB_USERNAME,
	DB_PASSWORD: process.env.DB_PASSWORD,
	JWT_SECRET: process.env.APP_JWT_SECRET,
	MESSAGE_BROKER_URL: process.env.MESSAGE_BROKER_URL,
	AUTH_BINDING_KEY: process.env.AUTH_BINDING_KEY,
	EXCHANGE_NAME: process.env.EXCHANGE_NAME,
	AUTH_QUEUE_NAME: process.env.AUTH_QUEUE_NAME,
	AUTH_BINDING_REPLY_KEY: process.env.AUTH_BINDING_REPLY_KEY,
	EXCHANGE_REPLY_NAME: process.env.EXCHANGE_REPLY_NAME,
	AUTH_QUEUE_REPLY_NAME: process.env.AUTH_QUEUE_REPLY_NAME,
	//FS
	FS_SERVICE_BINDING_KEY: process.env.FS_SERVICE_BINDING_KEY,
	FS_SERVICE_QUEUE_NAME: process.env.FS_SERVICE_QUEUE_NAME,
	//FS
	CREATE_NEW_USER_BINDING_KEY: process.env.CREATE_NEW_USER_BINDING_KEY,
	CREATE_NEW_USER_QUEUE_NAME: process.env.CREATE_NEW_USER_QUEUE_NAME
};
