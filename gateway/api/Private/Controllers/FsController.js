import { createChannel, publishMessage } from '../../src/utils/index';

class FsController{

	constructor(){
		// eslint-disable-next-line no-unused-vars
		const channel = createChannel();
	}
	
	static async redirect(req, res){
		try {
			publishMessage(this.channel, 'FS_SERVICE', req);
			return res.status(200).json({type: false, message: 'succesfull'});
		}
		catch (error) {
			return res.status(401).json({type: false, message: error.message});
		}
	}

	static async health(req, res){
		return res.status(200).json({type: true, message: 'fs controller working'});
	}

}

export default FsController;