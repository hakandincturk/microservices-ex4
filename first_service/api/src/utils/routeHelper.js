module.exports.methodHelper = (reqMethod, controller, ch, msg, data) => {
	switch (reqMethod){
	case 'POST':
		controller.postMethod(ch, msg, data);
		break;
	case 'GET':
		controller.getMethod(ch, msg);
		break;
	}
};