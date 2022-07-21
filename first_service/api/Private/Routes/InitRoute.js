import InitContoller from '../Controllers/InitController';

class InitRoute{

	static async subscribeEvents(ch, msg){
		const { data } = JSON.parse(msg.content.toString());
		
		// const token = data.token;
		const reqMethod = data.reqMethod;
		const reqUrl = data.url.split('/');
		let url = '';

		// * url '/init/add' şeklinde geliyor başında ki 'init' kısmını kaldırır
		for (let i = 2;i < reqUrl.length;i++) {
			url += '/' + reqUrl[i];
		}

		switch (url) {
		case '/add':
			switch (reqMethod){
			case 'POST':
				InitContoller.createInitMethod(ch, msg, data.data);
				break;
			case 'GET':
				InitContoller.getInitMethod(ch, msg);
				break;
			}
			break;
		default:
			break;
		}
	}

}

export default InitRoute;