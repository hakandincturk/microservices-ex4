class InitController{

	static async health(req, res){
		res.json({type: true, message: 'init controller working'});
	}

}

export default InitController;