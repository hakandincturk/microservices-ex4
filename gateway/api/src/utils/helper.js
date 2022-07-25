import consola from 'consola';

class Helper {

	static getHourAndMinutes = () => {
		let today = new Date();
		let time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
		return time;
	};

	static async consolaInfo(msg){

		const newMsg = `[ ${ this.getHourAndMinutes() } ] ` + msg;

		consola.info({
			badge: true,
			message: newMsg
		});
	}

	static async consolaError(msg){

		const newMsg = `[ ${ this.getHourAndMinutes() } ] ` + msg;

		consola.error({
			badge: true,
			message: newMsg
		});
	}

}

export default Helper;