

const express = require('express');
const morgan = require('morgan');
const winston = require('winston');
const owStats = require('./stats.js');


const app = express();
const PORT = process.env.PORT || 3000;

let logger = winston.createLogger({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: 'access.log',
            handleExceptions: true,
            json: false,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: true
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});

logger.stream = {
    write: function (message, encoding) {
        logger.info(message);
    }
}; 


app.use(morgan('combined', { "stream": logger.stream }));
app.set('view engine', 'pug');
app.use('/assets/', express.static('front'));


app.get('/', (req, res) => {
	let currentSession = {};
	currentSession.nick = ""
	res.render('index', currentSession);
});


//jquery everything
app.get('/api/v2/all/:platform/:btag', (req, res) => {
	
	const platform = req.params.platform;
	const btag = req.params.btag;
	const start = Date.now();
	
	owStats.getNewStats(platform, btag)
	.then( (data) => {
		res.send(data);
		console.log(Date.now() - start);
	})
	.catch( (error) => {
		if ( error.message == "PROFILE_NOT_FOUND" ) {
			res.redirect("/player/search/" + btag);
			console.log(error.message);
		} else {
			res.send(error.message);
			console.log(error);
		}
	});
});




//profile page
app.get('/api/v2/player/:platform/:btag/:mode', (req, res) => {
	
	const platform = req.params.platform;
	const btag = req.params.btag;
	const mode = (req.params.mode == "competitiveStats") ? "competitiveStats" : "quickplayStats";
	owStats.getProfile( platform, btag, mode ).then( (stats) => {
		if ( stats.profile == 404 ) {
			res.send({ profile: 404 });
		} else {
			
			res.send(stats);
		}
	})
	.catch( (error) => {
		if ( error.message == "PROFILE_NOT_FOUND" ) {
			console.log(error.message);
		} else {
			res.send(error.message);
			console.log(error);
		}
	});
	
});

//jquery hero stats
app.get('/api/v2/hero/:platform/:btag/:mode/:hero', (req, res) => {
	
	const platform = req.params.platform;
	const btag = req.params.btag;
	const hero = req.params.hero;
	const mode = req.params.mode;
	owStats.getDBHeroStats(platform, btag, mode, hero).then( (stats) => {
		res.send(stats);
	})
	.catch( (error) => {
		console.log(error);
	});
});

//jquery user search
app.get('/api/v2/search/:platform/:btag', (req, res) => {
	const platform = req.params.platform;
	const btag = req.params.btag;
	const mode = "quickplayStats";
	owStats.searchOW(platform, btag).then( (data) => {
		
			res.send(data);
		
	})
	.catch( (error) => {
		if ( error.message == "PROFILE_NOT_FOUND" ) {
			console.log(error.message);
		} else {
			res.send(error.message);
			console.log(error);
		}
	});
});

//jquery rank stats
app.get('/api/v2/ranks/:platform', (req, res) => {
	
	const platform = req.params.platform;
	const mode = (req.query.mode == "competitiveStats") ? "competitiveStats" : "quickplayStats";
	const skip = parseInt(req.query.skip) || 0;
	const sort = (req.query.sort == "h10") ? "h10" : "d10";
	const qty = (parseInt(req.query.qty) <= 20 ) ? parseInt(req.query.qty) : 20;
	owStats.queryStats(platform, mode, sort, qty, skip).then( (stats) => {
		res.send(stats);
	})
	.catch( (error) => {
		console.log(error);
	});
});

//hero page
app.get('/player/:platform/:btag/:hero', (req, res) => {
	
	const platform = req.params.platform;
	const btag = req.params.btag;
	const hero = req.params.hero;
	const mode = (req.query.mode == "competitiveStats") ? "competitiveStats" : "quickplayStats";
	owStats.getDBHeroStats(platform, btag, mode, hero).then( (stats) => {
		if (stats.profile == 404) {
			//res.redirect("/player/search/" + btag); // change to pug view that gets stats.
		} else {
			res.render('hero', stats);
		}
	})
	.catch( (error) => {
		console.log(error);
	});
	
});

//profile page
app.get('/player/:platform/:btag', (req, res) => {
	
	const platform = req.params.platform;
	const btag = req.params.btag;
	const mode = (req.query.mode == "competitiveStats") ? "competitiveStats" : "quickplayStats";
	owStats.getProfile( platform, btag, mode ).then( (stats) => {
		if (stats.profile == 404) {
			res.redirect("/playersearch/pc" + btag);
		} else {
			console.log(stats.currentSession);
			res.render('profile', { global: stats[mode].global, 
									profile: stats.profile,
									currentSession: stats.currentSession,
									sessions: []
									});
		}
	})
	.catch( (error) => {
		if ( error.message == "PROFILE_NOT_FOUND" ) {
			console.log(error.message);
		} else {
			res.send(error.message);
			console.log(error);
		}
	});
	
});

app.get('/:platform/ranks', (req, res) => {
	const platform = req.params.platform;
	const mode = (req.query.mode == "competitiveStats") ? "competitiveStats" : "quickplayStats";
	
	
	
	res.render('ranks', { currentSession:
							{
								platform: platform,
								mode: mode
							}
	});
	
});

//search
app.get('/playersearch/pc/:btag', (req, res) => {
	const btag = req.params.btag;
	currentSession = {};
	currentSession.nick = btag;
	res.render('search', currentSession);
});


app.listen(PORT, (err) => {
	if (err) {
		console.log('ERROR: Failed to start express sever');
		return;
	}
	console.log('Express listening on port ' + PORT);
});

process.stdin.resume();

function exitHandler(options, exitCode) {
    if (options.cleanup) {
		console.log('Cleaning up');
		console.log('Storing stats to mongo...');
		console.log('Closing MongoDB...');
		owStats.cleanup()
		.then( () => {
			console.log('MongoDB.close() Success');
			process.exit();
		})
		.catch( (error) => {
			console.log('ERROR:', error);
			process.exit();
		});
	} 
}

process.on('SIGINT', exitHandler.bind(null, {cleanup:true}));
process.on('SIGUSR1', exitHandler.bind(null, {cleanup:true}));
process.on('SIGUSR2', exitHandler.bind(null, {cleanup:true}));
process.on('uncaughtException', exitHandler.bind(null, {cleanup:true}));


