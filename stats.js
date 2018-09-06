

const owjs = require('overwatch-js');
const statsHelper = require('./statsHelper.json');
const MongoDatabase = require('./database.js');




let owStats = function() {
	let db = new MongoDatabase( "overwatch" );
	const PLAYERSCOLLECTION = "players";
	const OVERALLSTATSCOLLECTION = "overallStats";
	const SESSIONCOLLECTION = "sessionStats";
	
	let recalculateAverages = (average, cumulative, time) => {
		let statAverage = average;
		
		if (time.time_played != 0 && time.time_played != null ) {
			let perTen = time.time_played / 1000 / 60 / 10;
			statsHelper.general.divideByMins.forEach( (key) => {
				if (cumulative[key] != null) {
					let newKey = key + "_avg_per_10_min"
					statAverage[newKey] = cumulative[key] / perTen;
				}
			});
			statsHelper.general.time.forEach( (key) => {
				if (cumulative[key] != null && key != "time_played") {
					let newKey = key + "_percent"
					statAverage[newKey] = cumulative[key] / time.time_played;
				}
			});
		}
		
		if (cumulative.games_played != 0 ) {
			statsHelper.general.divideByGames.forEach( (key) => {
				if (cumulative[key] != null) {
					let newKey = key + "_avg_per_game"
					statAverage[newKey] = cumulative[key] / cumulative.games_played;
				}
			});
		}
		return statAverage;
	};
	
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
		
		statsHelper.general.time.forEach( (key) =>{
			if (rawStats[key] != null) {
				stats.time[key] = rawStats[key];
			}
		});
		
		//quickplay catch
		if (stats.cumulative.games_played == null) {
			stats.cumulative.games_played = stats.cumulative.games_won;
		}
		
		stats.average = recalculateAverages( stats.average, stats.cumulative, stats.time );
		
		return stats;
	};
	
	let statsFramework = (owjsStats) => {
		let start = Date.now();
		let stats = {};
		stats.global = {};
		stats.heroes = {};
		stats.sessions = [];
				
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

	let diffStats = (newStats, oldStats) => {
		let stats = {};
		stats.cumulative = {};
		stats.time = {};
		let newStat = 0;
		let oldStat = 0;
		
		Object.keys(newStats.cumulative).forEach( (key) => {
			newStat = newStats.cumulative[key];
			oldStat = oldStats.cumulative[key];
			if (oldStat == null) {
				oldStat = 0;
			}
			
			stats.cumulative[key] = newStat - oldStat;
		});
		
		Object.keys(newStats.time).forEach( (key) => {
			newStat = newStats.time[key];
			oldStat = oldStats.time[key];
			if (oldStat == null) {
				oldStat = 0;
			}
			
			stats.time[key] = newStat - oldStat;
			
		});
		
		//estimate time_played based on average of 'average per 10'
		if ( stats.time.time_played == 0 ) {
			if ( stats.cumulative.healing_done > stats.cumulative.all_damage_done ) {
				let avgPerTen = (newStats.average.healing_done_avg_per_10_min + oldStats.average.healing_done_avg_per_10_min) / 2
				stats.time.time_played = (stats.cumulative.healing_done / avgPerTen ) * 10 * 60 * 1000
			} else {
				let avgPerTen = (newStats.average.all_damage_done_avg_per_10_min + oldStats.average.all_damage_done_avg_per_10_min) / 2
				stats.time.time_played = (stats.cumulative.all_damage_done / avgPerTen ) * 10 * 60 * 1000
			}
		}
		
		stats.average = recalculateAverages( newStats.average, stats.cumulative, stats.time );
		
		return stats;
	};
	
	let sessionStats = (newStats, oldStats) => {
		let stats = {};
		stats.global = diffStats ( newStats.global, oldStats.global );
		
		if ( stats.global.games_played > 0 ) {
			let newHeroe = {};
			let oldHeroe = {};
			
			Object.keys(newStats.heroes).forEach( (key) => {
				newHeroe = newStats.heroes[key];
				oldHeroe = oldStats.heroes[key];
				if (oldHeroe != null) {
					stats.heroes[key] = diffStats(newHeroe, oldHeroe);
				} else {
					if (newHeroe.cumulative.games_played > 0) {
						stats.heroes[key] = newHeroe;
					}
				}
			});			
		} else {
			return {};
		}
		return stats;
	};
	
	let globalStats = (stats) => {
		
		
		return "yo dawg, sup";
	};

	this.cleanup = () => {
		return db.close();
	}

	this.getNewStats = (platform, btag) => {
		let lastOverall = {};
		let currentSessionStats = [];
		let date = Date.now();

		return db.query( PLAYERSCOLLECTION , { "profile.nick": btag }, 1).then( (data) => {
			lastOverall = data;
			return lastOverall;
		})
		.then( () => {
			return db.query( SESSIONCOLLECTION , { "profile.nick": btag }, 1).then( (data) => {
				if (data.length > 0) {
					currentSessionStats = data[0].sessions;
				}
				return currentSessionStats;
			});
		})
		.then( () => {
			return owjs
				.getAll(platform, 'us', btag)
				.then( (data) => {
					let result = {};
					let promises = [];
					
					result.profile = data.profile;
					result.profile.nick = btag;
					result.profile.date = date;

					promises.push( new Promise((resolve, reject) => {
						result.competitiveStats = statsFramework(data.competitive);
						
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
					let allSessions = {};
					let session = {};
					session.competitiveStats = sessionStats( stats.competitiveStats, lastOverall[0].competitiveStats );
					session.quickplayStats = sessionStats( stats.quickplayStats, lastOverall[0].quickplayStats );
					
					if ( Object.keys(session.competitiveStats) > 0 || Object.keys(session.quickplayStats) > 0 ) {
						currentSessionStats.push(session);
						
						if (currentSessionStats.length >= 10) {
							currentSessionStats.pop();					
						}
						
						allSessions.sessions = currentSessionStats;
						allSessions.profile = stats.profile;
						
						db.replaceDocument( SESSIONCOLLECTION, { "profile.nick": btag }, allSessions ); 
					}
					db.replaceDocument( PLAYERSCOLLECTION, { "profile.nick": btag }, stats );
					return stats;
				});
		});
	}
}


module.exports = new owStats();