import { sendMessageToQueue } from '../../src/utils/index';
import { FS_SERVICE_QUEUE_NAME } from '../../src/config/envKeys';

class FsController{
	
	static async redirect(req, res){
		try {

			const reqUrl = req.originalUrl.slice(1, req.originalUrl.length).split('/');
			const reqMethod = req.method;

			let newUrl = '/';

			for (let i = 1;i < reqUrl.length;i++) {
				newUrl += reqUrl[i] + '/';				
			}

			newUrl = newUrl.slice(0, newUrl.length-1);

			const resData = await sendMessageToQueue(
				'FS_SERVICE',
				{
					url: newUrl,
					reqMethod,
					data: req.body
				},
				FS_SERVICE_QUEUE_NAME
			);
			
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