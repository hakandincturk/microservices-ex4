import SecondService from '../Services/InitService';

class SecondController{

	static async health(req, res){
		res.json({type: true, message: 'second controller working'});
	}

}

export default SecondController;