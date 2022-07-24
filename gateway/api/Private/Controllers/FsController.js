import { sendMessageToQueue } from '../../src/utils/index';
import { FS_SERVICE_QUEUE_NAME } from '../../src/config/envKeys';

class FsController{
	
	static async redirect(req, res){
		try {

			const token = req.headers.authorization;
			const reqUrl = req.originalUrl.slice(1, req.originalUrl.length).split('/');
			const reqMethod = req.method;

			let newUrl = '/';

			for (let i = 2;i < reqUrl.length;i++) {
				newUrl += reqUrl[i] + '/';				
			}

			newUrl = newUrl.slice(0, newUrl.length-1);
			const bindingAndQueueKey =  `FS_SERVICE.${newUrl.split('/')[1].toUpperCase()}`;

			const resData = await sendMessageToQueue(
				global.fsChannel,
				{
					token,
					url: newUrl,
					reqMethod,
					data: req.body
				},
				bindingAndQueueKey
			);

			const parsedResData = JSON.parse(resData);
			
			return res.status(parsedResData.status).json(parsedResData.result);
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