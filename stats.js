

const owjs = require('overwatch-js');
const statsHelper = require('./statsHelper.json');
const MongoDatabase = require('./database.js');




let owStats = function() {
	let globalStats = 	{
							quickplay: { global:{}, heroes:{} },
							Bronze: { global:{}, heroes:{} },
							Silver: { global:{}, heroes:{} },
							Gold: { global:{}, heroes:{} },
							Platinum: { global:{}, heroes:{} },
							Diamond: { global:{}, heroes:{} },
							Master: { global:{}, heroes:{} },
							Grandmaster: { global:{}, heroes:{} }
						};
	const OVERALLSTATSID = "5b8b4be609a44987df8d539a";
	const OVERALLSTATSCOLLECTION = "overallStats";
	const PLAYERSCOLLECTION = "players";
	const SESSIONCOLLECTION = "sessionStats";
	let db = new MongoDatabase( "overwatch" );
	
	let storeOverall = () => {
		return db.replaceDocument( OVERALLSTATSCOLLECTION, {_id: db.ObjectId(OVERALLSTATSID)}, globalStats );
	}
	
	
	let recalculateAverages = (average, cumulative, time) => {
		let statAverage = {};
		
		//static section
		statsHelper.general.average.forEach( (key) => {
			if (!isNaN(average[key])){
				statAverage[key] = average[key];
			}
		});
		
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
		
		//time-catch: sometimes damage ticks from previous characters(junkrat, symetra, etc)
		//get added onto current character when switching.
		if (stats.time.time_played < 180000) {
			stats.time.time_played = 180000;
		}
		
		//quickplay catch
		if (stats.cumulative.games_played == null) {
			stats.cumulative.games_played = stats.cumulative.games_won;
		}
		
		stats.average = recalculateAverages( stats.average, stats.cumulative, stats.time );
		
		return stats;
	};
	
	let statsFramework = (owjsStats) => {
		let start = Date.now();
		let statsFrame = {};
		statsFrame.global = {};
		statsFrame.heroes = {};
		statsFrame.sessions = [];
				
		statsFrame.global = refactor(owjsStats.global);
		statsFrame.global.masteringHeroe = owjsStats.global.masteringHeroe;
		
		Object.keys(statsHelper.heroSpecific).forEach( (hero) => {
			if (owjsStats.heroes[hero] != null) {
				statsFrame.heroes[hero] = refactor( owjsStats.heroes[hero] );
			}
		});
		
		console.log('total time to refactor: ' + (Date.now() - start));
		return statsFrame;
	};

	let diffStats = (newStats, oldStats) => {
		let diffStatsObj = {};
		diffStatsObj.cumulative = {};
		diffStatsObj.time = {};
		let newStat = 0;
		let oldStat = 0;
		
		Object.keys(newStats.cumulative).forEach( (key) => {
			newStat = newStats.cumulative[key];
			oldStat = oldStats.cumulative[key];
			if (oldStat == null) {
				oldStat = 0;
			}
			
			diffStatsObj.cumulative[key] = newStat - oldStat;
		});
		
		Object.keys(newStats.time).forEach( (key) => {
			newStat = newStats.time[key];
			oldStat = oldStats.time[key];
			if (oldStat == null) {
				oldStat = 0;
			}
			
			diffStatsObj.time[key] = newStat - oldStat;
			
		});
		
		//estimate time_played based on average of 'average per 10'
		if ( diffStatsObj.time.time_played == 0 ) {
			if ( diffStatsObj.cumulative.healing_done > diffStatsObj.cumulative.all_damage_done ) {
				let avgPerTen = (newStats.average.healing_done_avg_per_10_min + oldStats.average.healing_done_avg_per_10_min) / 2
				diffStatsObj.time.time_played = (diffStatsObj.cumulative.healing_done / avgPerTen ) * 10 * 60 * 1000
			} else {
				let avgPerTen = (newStats.average.all_damage_done_avg_per_10_min + oldStats.average.all_damage_done_avg_per_10_min) / 2
				diffStatsObj.time.time_played = (diffStatsObj.cumulative.all_damage_done / avgPerTen ) * 10 * 60 * 1000
			}
		}
		
		diffStatsObj.average = recalculateAverages( newStats.average, diffStatsObj.cumulative, diffStatsObj.time );
		
		return diffStatsObj;
	};
	
	let sessionStats = (newStats, oldStats) => {
		let sesStats = {};
		sesStats.heroes = {};
		
		sesStats.global = diffStats ( newStats.global, oldStats.global );
		
		if ( sesStats.global.cumulative.games_played > 0 ) {
			let newHeroe = {};
			let oldHeroe = {};
			
			Object.keys(newStats.heroes).forEach( (key) => {
				newHeroe = newStats.heroes[key];
				oldHeroe = oldStats.heroes[key];
				if (oldHeroe != null) {
					sesStats.heroes[key] = diffStats(newHeroe, oldHeroe);
				} else {
					if (newHeroe.cumulative.games_played > 0) {
						sesStats.heroes[key] = newHeroe;
					}
				}
			});			
		} else {
			return {};
		}
		return sesStats;
	};
	
	let recalculateGlobalStats = (stats, statsRank) => {
		console.log(statsRank);
		
		let recalculateIndividualStats = (statsAveragesObj, globalStatsMASD) => {
			Object.keys(statsAveragesObj).forEach( (key) => {			
				if ( globalStatsMASD[key] != null && statsAveragesObj[key] != NaN ) {
					let curAverage = globalStatsMASD[key].average;
					let curVariance = globalStatsMASD[key].variance;
					
					let newAverage = ((curAverage * 100) + statsAveragesObj[key]) / 101;
					let newVariance = (statsAveragesObj[key] - newAverage) ** 2;
					newVariance = ((curVariance * 100) + newVariance) / 101;
					
					globalStatsMASD[key].average = newAverage;
					globalStatsMASD[key].variance = newVariance;
				} else {
					globalStatsMASD[key] = {};
					globalStatsMASD[key].average = statsAveragesObj[key];
					globalStatsMASD[key].variance = statsAveragesObj[key] / 2;
				}
				
			});
		};
		

		if ( statsRank != null && Object.keys(stats.competitiveStats).length > 0 ) {
			recalculateIndividualStats( stats.competitiveStats.global.average, globalStats[statsRank].global );
			Object.keys(stats.competitiveStats.heroes).forEach( (hero) => {
				if ( globalStats[statsRank].heroes[hero] == null ) {
					globalStats[statsRank].heroes[hero] = {};
				}
				recalculateIndividualStats( stats.competitiveStats.heroes[hero].average, globalStats[statsRank].heroes[hero] );
			});
		}
		
		if ( Object.keys(stats.quickplayStats).length > 0 ) {
			if ( Object.keys(stats.quickplayStats.global.average).length > 0 ) {
				recalculateIndividualStats( stats.quickplayStats.global.average, globalStats.quickplay.global );	
				Object.keys(stats.quickplayStats.heroes).forEach( (hero) => {
						if ( globalStats.quickplay.heroes[hero] == null ) {
							globalStats.quickplay.heroes[hero] = {};
						}
					recalculateIndividualStats( stats.quickplayStats.heroes[hero].average, globalStats.quickplay.heroes[hero] );
				});
			}
		}
		
		storeOverall();
	};
	
	this.getOldStats = (platform, btag) => {
		return db.query( PLAYERSCOLLECTION , { "profile.nick": btag }, 1).then( (data) => {
			
			return data;
		})
		.catch( (error) => {
			console.log(error);
		});
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
				.then( (data) => {
					let startglobal = Date.now();
					let allSessions = {};
					let session = {};
					session.competitiveStats = {};
					session.quickplayStats = {};
					let globalRankStats = {};
					globalRankStats.quickplay = globalStats.quickplay;
					if ( Object.keys(data.competitiveStats).length > 0 ) {
						if ( data.profile.ranking != null ) {
							globalRankStats.rank = globalStats[data.profile.ranking];
						}
					}
					
					if (lastOverall.length > 0) {
						session.competitiveStats = sessionStats( data.competitiveStats, lastOverall[0].competitiveStats );
						session.quickplayStats = sessionStats( data.quickplayStats, lastOverall[0].quickplayStats );
						
						if ( Object.keys(session.competitiveStats).length > 0 || Object.keys(session.quickplayStats).length > 0 ) {
							
							let statsRank = data.profile.ranking;
							recalculateGlobalStats (session, statsRank);
							currentSessionStats.push(session);
							if (currentSessionStats.length >= 10) {
								currentSessionStats.pop();					
							}
							allSessions.sessions = currentSessionStats;
							allSessions.profile = data.profile;
							
							db.replaceDocument( SESSIONCOLLECTION, { "profile.nick": btag }, allSessions ); 
							db.replaceDocument( PLAYERSCOLLECTION, { "profile.nick": btag }, data );
							
							data.sessions = currentSessionStats;
						}
					} else {
						db.replaceDocument( PLAYERSCOLLECTION, { "profile.nick": btag }, data );
						//recalculateGlobalStats (data, data.profile.ranking);
					}
					
					console.log("Global time: " + (Date.now() - startglobal));
					recalculateGlobalStats (data, data.profile.ranking);//remove
					data.globalStats = globalRankStats;
					
					return data;
				});
		});
	}

	
	this.cleanup = () => {
		storeOverall()
		
		return db.close();
		
	}
	
	let connectDB = () => {
		db.connect().then( () => {
		
			db.query(OVERALLSTATSCOLLECTION, {_id: db.ObjectId(OVERALLSTATSID)}, 1).then( (data) => {
				console.log(data);
				if (data.length > 0) {
					globalStats = data[0];
				}
				
			})		
		})
		.catch( (error) => {
			console.log(error);
		});
	}
	
	connectDB();
}


module.exports = new owStats();