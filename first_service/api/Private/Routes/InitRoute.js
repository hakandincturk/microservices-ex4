class InitRoute{

	static async subscribeEvents(ch, msg){
		const { data } = JSON.parse(msg.content.toString());

		switch (data.url) {
		case value:
        
			break;
    
		default:
			break;
		}

		console.log('InitController.js, ', data);
	}

}

export default InitRoute;