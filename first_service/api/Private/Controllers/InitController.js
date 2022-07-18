import InitService from '../Services/InitService';

class InitController{

	static async createNewUser(data, role){

		const result = InitService.createNewUser(data, role); 

	}

	static async health(req, res){
		res.json({type: true, message: 'init controller working'});
	}

}

export default InitController;