module.exports.routeWithoutParams = (url, route) => {

	const urlRegex = new RegExp(`^${route}$`); 

	console.log(
		`[FS_SERVICE] -> [routeHelper.js] -> routeWithoutParams ${urlRegex.test(url)} url -> ${url} route -> ${route}`
	);

	if (urlRegex.test(url))
		return route;
	else return;
};

module.exports.routeWithParams = (url, route) => {
	const urlRegex = new RegExp(`^${route}/.*$`); 
	console.log(
		`[FS_SERVICE] -> [routeHelper.js] -> routeWithParams ${urlRegex.test(url)} url -> ${url} route -> ${route}`
	);
	if (urlRegex.test(url))
		return url;
	else return;
};

module.exports.separateParams = (url, wantedVars) => {
	const splittedUrl = url.split('/');

	if ((splittedUrl.length - 2) === (wantedVars.length)){
		const params = {};
		let j = 0;
		for (let i = 2;i < splittedUrl.length;i++) {
			params[wantedVars[j]] = splittedUrl[i];
			j++;
		}
		return {type: true, params: params};
	}
	return {type: false};

};
