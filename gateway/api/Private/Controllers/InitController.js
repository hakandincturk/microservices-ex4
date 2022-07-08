class InitController{

	static async health(req, res){
		return res.status(200).json({type: true, message: 'init controller working'});
	}

}

export default InitController;