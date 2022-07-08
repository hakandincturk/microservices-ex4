module.exports.constChannel = (channel) => {
	return (req, res, next) => {
		req.channel = channel;
		next();
	};
};