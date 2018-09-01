

const owjs = require('overwatch-js');
const statsHelper = require('./statsHelper.json');
//const database = require('./database.js');




let owStats = function() {
	
	let refactor = (rawStats) => {
		let stats = {};
		stats.average = {};
		stats.cumulative = {};
		stats.time = {};
		
		statsHelper.general.average.forEach( (key) =>{
			if (rawStats[key] != null) {
				stats.average[key] = rawStats[key];
			}
		});
		
		statsHelper.general.cumulative.forEach( (key) =>{			
			if (rawStats[key] != null) {
				stats.cumulative[key] = rawStats[key];
			}
		});
		
		//time stored as milliseconds. re-store as minutes.
		statsHelper.general.time.forEach( (key) =>{
			if (rawStats[key] != null) {
				stats.time[key] = rawStats[key] / 1000 / 60;
			}
		});
		
		if (stats.time.time_played != null) {
			let perTen = stats.time.time_played / 10;
			statsHelper.general.divideByMins.forEach( (key) =>{
				if (rawStats[key] != null) {
					let newKey = key + "_avg_per_10_min"
					stats.average[newKey] = rawStats[key] / perTen;
				}
			});
			statsHelper.general.time.forEach( (key) =>{
				if (rawStats[key] != null && key != "time_played") {
					let newKey = key + "_percent"
					stats.average[newKey] = rawStats[key] / rawStats.time_played;
				}
			});
		}
		
		//quickplay catch
		if (stats.cumulative.games_played == null) {
			stats.cumulative.games_played = stats.cumulative.games_won;
		}
		
		statsHelper.general.divideByGames.forEach( (key) =>{
			if (rawStats[key] != null) {
				let newKey = key + "_avg_per_game"
				stats.average[newKey] = rawStats[key] / stats.cumulative.games_played;
			}
		});
		
		
		return stats;
	};
	
	let statsFramework = (owjsStats) => {
		let start = Date.now();
		let stats = {};
		stats.global = {};
		stats.heroes = {};
				
		stats.global = refactor(owjsStats.global);
		stats.global.masteringHeroe = owjsStats.global.masteringHeroe;
		
		Object.keys(statsHelper.heroSpecific).forEach( (hero) => {
			if (owjsStats.heroes[hero] != null) {
				stats.heroes[hero] = refactor( owjsStats.heroes[hero] );
			}
		});
		
		console.log('total time to refactor: ' + (Date.now() - start));
		return stats;
	};

	let sessionStats = (newStats, oldStats) => {
		
		return ['yo session stats']
	}
	
	let globalStats = (stats) => {
		
		
		return "yo dawg, sup";
	};

	
	

	this.getNewStats = (platform, btag) => { 
	
		return owjs
			.getAll(platform, 'us', btag)
			.then( (data) => {
				let result = {};
				let promises = [];
				
				result.profile = data.profile;
				result.profile.nick = btag;
				/*
				promises.push( new Promise((resolve, reject) => {
					result.globalStats = globalStats(data);
					
					resolve(result);
				}));
				*/
				promises.push( new Promise((resolve, reject) => {
					result.competiveStats = statsFramework(data.competitive);
					
					resolve(result);
				}));
				
				promises.push( new Promise((resolve, reject) => {
					result.quickplayStats = statsFramework(data.quickplay);
					
					resolve(result);
				}));
				
				return Promise.all(promises).then(() => {
					return result;
				});
			})
			.then( (stats) => {
				//getOldStats
				//if oldStats exist:
				//		diffNewStatsOldStats
				//		if diff.competitive.games_played or diff.quickplay.games_played:
				//			push diff to return value by array.
				//			update/add newstats to db.
				
				
				
				return stats;
			});
				
	}
}


module.exports = new owStats();