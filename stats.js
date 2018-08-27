

const owjs = require('overwatch-js');
//const database = require('./database.js');




let owStats = function() {
	
	
	let globalStats = (stats) => {
		return "yo dawg, sup";
	};


	this.getNewStats = (platform, btag) => { 
	
		return owjs
			.getAll(platform, 'us', btag)
			.then( (data) => {
				let result = {};
				let promises = [];
				
				result.personalStats = data;
				
				let p = new Promise((resolve, reject) => {
					result.globalStats = globalStats(data);

					resolve(result);
				});
				
				promises.push(p);
				
				
				return Promise.all(promises).then(() => {
					return result;
				});
			});
				
	}
}


module.exports = new owStats();