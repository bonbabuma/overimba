

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
app.use('/', express.static('front'));


app.get('/api/:platform/:btag', (req, res) => {
	
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
			res.redirect("/players/search/" + btag);
			console.log(error.message);
		} else {
			res.send(error.message);
			console.log(error);
		}
	});
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


