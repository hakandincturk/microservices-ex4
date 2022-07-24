import SecondService from '../Services/BService';

class BController{

	static async health(req, res){
		res.json({type: true, message: 'second controller working'});
	}

}

export default BController;